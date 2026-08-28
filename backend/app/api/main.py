from fastapi import APIRouter
from app.api.routes import auth, websockets, analytics, incidents, security

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(security.router, prefix="/security", tags=["security"])
api_router.include_router(websockets.router, tags=["websockets"])
