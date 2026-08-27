from sqlalchemy.orm import Session
from app.db.models import AuditLog
from typing import Optional, Dict, Any
import json

def log_audit_event(
    db: Session,
    action: str,
    target: Optional[str] = None,
    actor_user_id: Optional[int] = None,
    details: Optional[Dict[str, Any]] = None
) -> AuditLog:
    """
    Creates an audit log entry in the database.
    """
    audit_entry = AuditLog(
        actor_user_id=actor_user_id,
        action=action,
        target=target,
        details_json=details
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)
    return audit_entry
