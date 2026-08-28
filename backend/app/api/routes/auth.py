from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request, Header, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.schemas.auth import Token
from app.schemas.user import UserCreate, User as UserSchema
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.api.deps import get_current_user
from app.services.audit import log_audit_event
from app.services.threat_detection import process_security_event

router = APIRouter()

@router.post("/register", response_model=UserSchema)
def register(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    """
    Register a new user.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.email,
        name=user_in.name,
        role=user_in.role,
        usual_city=user_in.usual_city,
        password_hash=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Audit logging
    log_audit_event(
        db=db,
        action="user_registered",
        target=f"user:{user.id}",
        actor_user_id=user.id,
        details={"email": user.email, "ip_address": request.client.host}
    )
    
    return user

@router.post("/login", response_model=Token)
def login(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_agent: str = Header(default="Unknown")
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    ip_address = request.client.host
    device_fingerprint = f"{user_agent}|{ip_address}" # Simple fingerprint
    
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        if user:
            # Audit log
            log_audit_event(
                db=db,
                action="login_failed",
                target=f"user:{user.id}",
                actor_user_id=user.id,
                details={"reason": "incorrect_password", "ip_address": ip_address}
            )
            # Process failed login attempt for threat detection (brute force etc.)
            process_security_event(
                db=db,
                user_id=user.id,
                device_fingerprint=device_fingerprint,
                ip_address=ip_address,
                geo_location=None,
                event_type="login",
                campus_service="Student Portal",
                success=False,
                failure_reason="incorrect_password",
                background_tasks=background_tasks
            )
            
        raise HTTPException(
            status_code=400, detail="Incorrect email or password"
        )
        
    # Process successful login attempt for threat detection
    process_security_event(
        db=db,
        user_id=user.id,
        device_fingerprint=device_fingerprint,
        ip_address=ip_address,
        geo_location=None,
        event_type="login",
        campus_service="Student Portal",
        success=True,
        background_tasks=background_tasks
    )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    # Audit logging
    log_audit_event(
        db=db,
        action="login_success",
        target=f"user:{user.id}",
        actor_user_id=user.id,
        details={"ip_address": ip_address}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user.
    """
    return current_user
