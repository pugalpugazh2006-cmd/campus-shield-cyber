from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict
from app.db.database import get_db
from app.db.models import Incident, Alert, SecurityEvent, User, AlertStatusEnum
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/")
def list_incidents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    List all incidents (SOC view).
    """
    incidents = db.query(Incident).order_by(Incident.id.desc()).limit(50).all()
    result = []
    for inc in incidents:
        alert = inc.alert
        if not alert:
            continue
        result.append({
            "id": inc.id,
            "correlation_id": inc.correlation_id,
            "status": inc.status.value,
            "type": alert.alert_type,
            "severity": alert.severity.value,
            "user_id": alert.user_id,
            "created_at": alert.created_at.isoformat()
        })
    return result

@router.get("/{incident_id}")
def get_incident_details(incident_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get deep investigation details for a specific incident.
    """
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    # Get all alerts related to this correlation_id
    alerts = db.query(Alert).filter(Alert.correlation_id == incident.correlation_id).all()
    
    # Extract related events from those alerts (using user_id and rough time window)
    # A true system would link events explicitly to alerts, but we'll approximate for prototype
    user_id = incident.alert.user_id if incident.alert else None
    
    return {
        "incident": {
            "id": incident.id,
            "status": incident.status.value,
            "timeline": incident.investigation_timeline_json or [],
            "notes": incident.notes
        },
        "alerts": [{
            "id": a.id,
            "type": a.alert_type,
            "severity": a.severity.value,
            "description": a.description,
            "timestamp": a.created_at.isoformat(),
            "detection_methods": a.detection_methods
        } for a in alerts],
        "user_id": user_id
    }

@router.patch("/{incident_id}/status")
def update_incident_status(
    incident_id: int, 
    status: str = Body(..., embed=True), 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    try:
        new_status = AlertStatusEnum(status.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    incident.status = new_status
    if new_status == AlertStatusEnum.resolved:
        incident.resolved_at = datetime.utcnow()
        
    # Append to timeline
    timeline = incident.investigation_timeline_json or []
    timeline.append({
        "time": datetime.utcnow().isoformat(),
        "action": f"Status changed to {status}",
        "actor": current_user.email
    })
    incident.investigation_timeline_json = timeline
    
    db.commit()
    return {"status": "success", "new_status": incident.status.value}

@router.post("/{incident_id}/response")
def trigger_automated_response(
    incident_id: int, 
    action: str = Body(..., embed=True), 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Controlled Automated Response (e.g. restrict_session, force_reauth).
    """
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    timeline = incident.investigation_timeline_json or []
    timeline.append({
        "time": datetime.utcnow().isoformat(),
        "action": f"Automated Response Triggered: {action}",
        "actor": current_user.email
    })
    incident.investigation_timeline_json = timeline
    db.commit()
    return {"status": "success", "action_taken": action}
