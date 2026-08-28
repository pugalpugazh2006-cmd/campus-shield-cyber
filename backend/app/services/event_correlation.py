import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.models import Alert, Incident, SecurityEvent, AlertStatusEnum

def correlate_events(db: Session, new_alert: Alert) -> str:
    """
    Correlates a new alert with existing open incidents for the same user within a time window.
    Returns the correlation_id.
    """
    time_window = datetime.utcnow() - timedelta(hours=24)
    
    # Find recent open alerts for the same user
    related_alerts = db.query(Alert).filter(
        Alert.user_id == new_alert.user_id,
        Alert.created_at >= time_window,
        Alert.id != new_alert.id,
        Alert.correlation_id.isnot(None)
    ).all()
    
    if related_alerts:
        # Join existing correlation chain
        correlation_id = related_alerts[0].correlation_id
    else:
        # Start new correlation chain
        correlation_id = str(uuid.uuid4())
        
    new_alert.correlation_id = correlation_id
    db.commit()
    
    # Manage Incident
    incident = db.query(Incident).filter(Incident.correlation_id == correlation_id).first()
    if not incident:
        incident = Incident(
            correlation_id=correlation_id,
            alert_id=new_alert.id,  # Primary alert
            status=AlertStatusEnum.open,
            investigation_timeline_json=[{
                "time": datetime.utcnow().isoformat(),
                "action": f"Incident auto-created due to {new_alert.alert_type}",
                "actor": "SYSTEM"
            }]
        )
        db.add(incident)
    else:
        # Append to timeline
        timeline = incident.investigation_timeline_json or []
        timeline.append({
            "time": datetime.utcnow().isoformat(),
            "action": f"Correlated new alert: {new_alert.alert_type}",
            "actor": "SYSTEM"
        })
        incident.investigation_timeline_json = timeline
        
    db.commit()
    return correlation_id
