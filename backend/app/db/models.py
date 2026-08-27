from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.database import Base

class RoleEnum(str, enum.Enum):
    student = "student"
    faculty = "faculty"
    admin = "admin"

class AlertStatusEnum(str, enum.Enum):
    open = "open"
    investigating = "investigating"
    resolved = "resolved"
    
class SeverityEnum(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.student)
    usual_city = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    devices = relationship("Device", back_populates="user")
    login_events = relationship("LoginEvent", back_populates="user")
    risk_scores = relationship("RiskScore", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="actor")

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_fingerprint = Column(String, index=True)
    first_seen_at = Column(DateTime(timezone=True), server_default=func.now())
    is_trusted = Column(Boolean, default=False)

    user = relationship("User", back_populates="devices")
    login_events = relationship("LoginEvent", back_populates="device")

class LoginEvent(Base):
    __tablename__ = "login_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    ip_address = Column(String)
    geo_location = Column(String, nullable=True)
    login_time = Column(DateTime(timezone=True), server_default=func.now())
    success = Column(Boolean, default=True)
    failure_reason = Column(String, nullable=True)

    user = relationship("User", back_populates="login_events")
    device = relationship("Device", back_populates="login_events")

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float)
    score_breakdown_json = Column(JSON)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="risk_scores")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    alert_type = Column(String) # e.g. "brute_force", "new_device", "high_risk"
    severity = Column(Enum(SeverityEnum), default=SeverityEnum.low)
    description = Column(String)
    status = Column(Enum(AlertStatusEnum), default=AlertStatusEnum.open)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="alerts")
    incident = relationship("Incident", back_populates="alert", uselist=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String)
    target = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details_json = Column(JSON, nullable=True)

    actor = relationship("User", back_populates="audit_logs")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), unique=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(Enum(AlertStatusEnum), default=AlertStatusEnum.open)
    notes = Column(String, nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    alert = relationship("Alert", back_populates="incident")
    assignee = relationship("User")
