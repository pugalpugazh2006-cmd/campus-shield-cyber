from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.db.models import LoginEvent, Device, Alert, User, SeverityEnum, AlertStatusEnum
from app.services.risk_scoring import calculate_rule_based_risk_score
from app.services.ml_anomaly import calculate_ml_anomaly_score, calculate_hybrid_risk_score
from app.db.models import RiskScore

BRUTE_FORCE_TIME_WINDOW_MINUTES = 10
BRUTE_FORCE_THRESHOLD = 5

def check_brute_force(db: Session, user_id: int) -> bool:
    """
    Checks if a user has exceeded the allowed failed login attempts within the time window.
    """
    time_threshold = datetime.utcnow() - timedelta(minutes=BRUTE_FORCE_TIME_WINDOW_MINUTES)
    
    failed_attempts = db.query(LoginEvent).filter(
        LoginEvent.user_id == user_id,
        LoginEvent.success == False,
        LoginEvent.login_time >= time_threshold
    ).count()
    
    if failed_attempts >= BRUTE_FORCE_THRESHOLD:
        existing_alert = db.query(Alert).filter(
            Alert.user_id == user_id,
            Alert.alert_type == "brute_force",
            Alert.status == AlertStatusEnum.open,
            Alert.created_at >= time_threshold
        ).first()
        
        if not existing_alert:
            alert = Alert(
                user_id=user_id,
                alert_type="brute_force",
                severity=SeverityEnum.high,
                description=f"Potential brute force attack detected: {failed_attempts} failed attempts in the last {BRUTE_FORCE_TIME_WINDOW_MINUTES} minutes."
            )
            db.add(alert)
            db.commit()
            
        return True
    return False

def get_or_create_device(db: Session, user_id: int, device_fingerprint: str) -> tuple[Device, bool]:
    device = db.query(Device).filter(
        Device.user_id == user_id,
        Device.device_fingerprint == device_fingerprint
    ).first()
    
    is_new = False
    if not device:
        is_new = True
        device = Device(
            user_id=user_id,
            device_fingerprint=device_fingerprint,
            is_trusted=False
        )
        db.add(device)
        db.commit()
        db.refresh(device)
        
        alert = Alert(
            user_id=user_id,
            alert_type="new_device",
            severity=SeverityEnum.medium,
            description="Login from a new, unrecognized device."
        )
        db.add(alert)
        db.commit()
        
    return device, is_new

def process_login_attempt(
    db: Session,
    user_id: int,
    device_fingerprint: str,
    ip_address: str,
    success: bool,
    failure_reason: str = None
):
    device, is_new_device = get_or_create_device(db, user_id, device_fingerprint)
    
    login_event = LoginEvent(
        user_id=user_id,
        device_id=device.id,
        ip_address=ip_address,
        success=success,
        failure_reason=failure_reason
    )
    db.add(login_event)
    db.commit()
    db.refresh(login_event)
    
    if not success:
        check_brute_force(db, user_id)
        
    time_threshold = datetime.utcnow() - timedelta(minutes=10)
    failed_attempts_count = db.query(LoginEvent).filter(
        LoginEvent.user_id == user_id,
        LoginEvent.success == False,
        LoginEvent.login_time >= time_threshold
    ).count()
    
    location_distance_km = 0.0
    if is_new_device:
        location_distance_km = 500.0
        
    # Calculate rule-based risk
    rule_result = calculate_rule_based_risk_score(
        failed_attempts_count=failed_attempts_count,
        is_new_device=is_new_device,
        location_distance_km=location_distance_km,
        login_time=login_event.login_time
    )
    
    # Calculate ML anomaly risk
    ml_score = calculate_ml_anomaly_score(
        login_hour=login_event.login_time.hour,
        geo_distance_km=location_distance_km,
        is_new_device=is_new_device,
        failed_attempts=failed_attempts_count
    )
    
    # Calculate Hybrid risk
    hybrid_result = calculate_hybrid_risk_score(
        rule_score=rule_result["score"],
        ml_score=ml_score
    )
    
    # Save the risk score with full breakdown
    full_breakdown = {
        "rule_based_breakdown": rule_result["breakdown"],
        "hybrid_breakdown": hybrid_result
    }
    
    risk_score_entry = RiskScore(
        user_id=user_id,
        score=hybrid_result["final_hybrid_score"],
        score_breakdown_json=full_breakdown
    )
    db.add(risk_score_entry)
    
    if hybrid_result["final_hybrid_score"] >= 0.7:
        alert = Alert(
            user_id=user_id,
            alert_type="high_risk_login",
            severity=SeverityEnum.critical,
            description=f"High risk login detected. Hybrid Score: {hybrid_result['final_hybrid_score']:.2f}"
        )
        db.add(alert)
        
    db.commit()
    return login_event
