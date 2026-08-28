from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import json
from app.db.models import SecurityEvent, Device, Alert, User, SeverityEnum, AlertStatusEnum, RiskScore
from app.services.risk_scoring import calculate_hybrid_risk_score
from app.services.ml_anomaly import calculate_ml_anomaly_score
from app.services.uba import calculate_uba_deviation, update_user_baseline
from app.services.event_correlation import correlate_events

# Configurable constants
BRUTE_FORCE_THRESHOLD = 5
BRUTE_FORCE_TIME_WINDOW_MINUTES = 15

def get_or_create_device(db: Session, user_id: int, device_fingerprint: str):
    device = db.query(Device).filter(
        Device.user_id == user_id,
        Device.device_fingerprint == device_fingerprint
    ).first()
    
    if not device:
        device = Device(user_id=user_id, device_fingerprint=device_fingerprint)
        db.add(device)
        db.commit()
        db.refresh(device)
        return device, True
    return device, False

def check_location_anomaly(db: Session, user_id: int, geo_location: str) -> float:
    if not geo_location:
        return 0.0
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.usual_city:
        return 0.0
    if geo_location.lower() != user.usual_city.lower():
        return 500.0 # Mock 500km distance
    return 0.0

from fastapi import BackgroundTasks
from app.api.routes.websockets import manager

def process_security_event(
    db: Session, 
    user_id: int, 
    device_fingerprint: str, 
    ip_address: str, 
    geo_location: str, 
    event_type: str,
    campus_service: str,
    success: bool, 
    failure_reason: str = None,
    background_tasks: BackgroundTasks = None
):
    """
    Main entry point for processing any security event.
    Calculates risk, generates alerts if necessary, and logs the event.
    """
    device, is_new_device = get_or_create_device(db, user_id, device_fingerprint)
    
    security_event = SecurityEvent(
        user_id=user_id,
        device_id=device.id,
        event_type=event_type,
        campus_service=campus_service,
        ip_address=ip_address,
        geo_location=geo_location,
        success=success,
        failure_reason=failure_reason
    )
    db.add(security_event)
    db.commit()
    db.refresh(security_event)
    
    # 1. Update UBA Baseline if successful
    if success:
        update_user_baseline(db, user_id)
        
    # 2. Gather context for risk scoring
    time_threshold = datetime.utcnow() - timedelta(minutes=15)
    failed_attempts_count = db.query(SecurityEvent).filter(
        SecurityEvent.user_id == user_id,
        SecurityEvent.success == False,
        SecurityEvent.timestamp >= time_threshold
    ).count()
    
    location_distance_km = check_location_anomaly(db, user_id, geo_location)
    
    # 3. ML Anomaly
    ml_result = calculate_ml_anomaly_score(
        login_hour=security_event.timestamp.hour,
        geo_distance_km=location_distance_km,
        is_new_device=is_new_device,
        failed_attempts=failed_attempts_count
    )
    
    # 4. UBA Deviation
    uba_result = calculate_uba_deviation(db, user_id, security_event)
    
    # 5. Hybrid Risk Score
    risk_result = calculate_hybrid_risk_score(
        failed_attempts_count=failed_attempts_count,
        is_new_device=is_new_device,
        location_distance_km=location_distance_km,
        uba_result=uba_result,
        ml_result=ml_result
    )
    
    # 6. Save Risk Score
    risk_score = RiskScore(
        user_id=user_id,
        score=risk_result["score"],
        score_breakdown_json=risk_result
    )
    db.add(risk_score)
    db.commit()
    db.refresh(risk_score)
    
    # Link score to event
    security_event.risk_score_id = risk_score.id
    db.commit()
    
    # 7. Generate Alerts & Correlate Incidents
    if risk_result["level"] in ["MEDIUM", "HIGH", "CRITICAL"]:
        alert = Alert(
            user_id=user_id,
            alert_type="behavioral_anomaly" if ml_result.get("is_anomaly") else "high_risk_activity",
            severity=SeverityEnum(risk_result["level"].lower()),
            description=f"Risk Score {int(risk_result['score'])}: " + "; ".join(risk_result["reasons"]),
            detection_methods=["rule-based", "ml-anomaly", "uba-deviation"]
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        
        # Correlate Alert to an Incident
        correlation_id = correlate_events(db, alert)
        
        # Broadcast via WebSockets
        if background_tasks:
            background_tasks.add_task(
                manager.broadcast, 
                {
                    "type": "NEW_ALERT", 
                    "alert_id": alert.id,
                    "severity": alert.severity.value,
                    "description": alert.description,
                    "user_id": user_id,
                    "correlation_id": correlation_id
                }
            )
        
    return security_event
