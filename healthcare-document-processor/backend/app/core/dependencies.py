from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi import security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_token
from app.models import User, UserRole
from app.services.auth_services import get_auth_service, AuthService

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_serivce: AuthService = Depends(get_auth_service)
) -> User:
    return auth_serivce.get_current_user(credentials.credentials)

def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

def require_roles(allowed_roles: List[UserRole]):
    
    def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user

    return role_checker

require_admin = require_roles([UserRole.ADMIN])
require_doctor = require_roles([UserRole.DOCTOR, UserRole.ADMIN])
require_nurse = require_roles([UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN])
require_staff = require_roles([UserRole.STAFF, UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN])
