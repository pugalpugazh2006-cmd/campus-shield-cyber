import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import User, SecurityEvent

def get_user_baseline(db: Session, user_id: int) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.baseline_behavior_json:
        return {
            "typical_hours": [],
            "known_ips": [],
            "common_services": []
        }
    return user.baseline_behavior_json

def update_user_baseline(db: Session, user_id: int):
    """
    Recalculates the user's baseline based on their recent successful security events.
    """
    events = db.query(SecurityEvent).filter(
        SecurityEvent.user_id == user_id,
        SecurityEvent.success == True
    ).order_by(SecurityEvent.timestamp.desc()).limit(100).all()
    
    if not events:
        return
        
    hours = {}
    ips = {}
    services = {}
    
    for event in events:
        hour = event.timestamp.hour
        hours[hour] = hours.get(hour, 0) + 1
        
        ip = event.ip_address
        ips[ip] = ips.get(ip, 0) + 1
        
        service = event.campus_service
        if service:
            services[service] = services.get(service, 0) + 1
            
    # Keep top 3 most frequent for each category as "baseline"
    typical_hours = sorted(hours.keys(), key=lambda k: hours[k], reverse=True)[:3]
    known_ips = sorted(ips.keys(), key=lambda k: ips[k], reverse=True)[:5]
    common_services = sorted(services.keys(), key=lambda k: services[k], reverse=True)[:3]
    
    baseline = {
        "typical_hours": typical_hours,
        "known_ips": known_ips,
        "common_services": common_services
    }
    
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.baseline_behavior_json = baseline
        db.commit()

def calculate_uba_deviation(db: Session, user_id: int, current_event: SecurityEvent) -> dict:
    """
    Compares the current event to the user's baseline.
    Returns a dict with 'deviation_score' (0-100) and 'reasons'.
    """
    baseline = get_user_baseline(db, user_id)
    reasons = []
    score = 0
    
    # If no baseline exists, assume it's normal but we can't be sure
    if not baseline.get("typical_hours"):
        return {"deviation_score": 0, "reasons": ["No established baseline yet."]}
        
    current_hour = current_event.timestamp.hour
    if current_hour not in baseline.get("typical_hours", []):
        score += 30
        reasons.append(f"Login at {current_hour}:00 is outside usual hours {baseline['typical_hours']}")
        
    if current_event.ip_address not in baseline.get("known_ips", []):
        score += 40
        reasons.append(f"Unrecognized IP address: {current_event.ip_address}")
        
    if current_event.campus_service and current_event.campus_service not in baseline.get("common_services", []):
        score += 20
        reasons.append(f"Unusual access to campus service: {current_event.campus_service}")
        
    # Cap score at 100
    score = min(score, 100)
    
    if score == 0:
        reasons.append("Behavior matches normal baseline.")
        
    return {
        "deviation_score": score,
        "reasons": reasons
    }
