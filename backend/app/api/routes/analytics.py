from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from app.db.database import get_db
from app.db.models import SecurityEvent, Alert, Incident, RiskScore, AlertStatusEnum, SeverityEnum
from app.api.deps import get_current_user
from app.db.models import User

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns SOC dashboard analytics.
    """
    # Only allow admins to view full stats.
    # Note: Using string for simplicity in prototype, real app uses RoleEnum
    if current_user.role.value not in ["admin", "security_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized for SOC dashboard")

    # High-level stats
    total_events = db.query(SecurityEvent).count()
    open_incidents = db.query(Incident).filter(Incident.status == AlertStatusEnum.open).count()
    investigating_incidents = db.query(Incident).filter(Incident.status == AlertStatusEnum.investigating).count()
    resolved_incidents = db.query(Incident).filter(Incident.status == AlertStatusEnum.resolved).count()
    
    # Severity breakdown for Alerts
    severity_counts = db.query(Alert.severity, func.count(Alert.id)).group_by(Alert.severity).all()
    severity_dict = {s.value: count for s, count in severity_counts}
    
    # Threat distribution by type
    threat_types = db.query(Alert.alert_type, func.count(Alert.id)).group_by(Alert.alert_type).all()
    threat_distribution = [{"name": t, "value": c} for t, c in threat_types]
    
    return {
        "stats": {
            "total_events": total_events,
            "open_incidents": open_incidents,
            "investigating_incidents": investigating_incidents,
            "resolved_incidents": resolved_incidents
        },
        "severity": {
            "low": severity_dict.get("low", 0),
            "medium": severity_dict.get("medium", 0),
            "high": severity_dict.get("high", 0),
            "critical": severity_dict.get("critical", 0)
        },
        "threat_distribution": threat_distribution
    }

@router.get("/live-feed")
def get_live_feed(limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns the most recent alerts for the live feed.
    """
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).limit(limit).all()
    
    feed = []
    for alert in alerts:
        feed.append({
            "id": alert.id,
            "type": alert.alert_type,
            "severity": alert.severity.value,
            "description": alert.description,
            "timestamp": alert.created_at.isoformat(),
            "correlation_id": alert.correlation_id
        })
    return feed
