from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import UserCreate, UserLogin, TokenRefresh, PasswordChange, UserResponse, TokenResponse
from app.services.auth_services import get_auth_service, AuthService
from app.core.dependencies import get_current_active_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register_user(user_data)

@router.post("/login", response_model=dict)
async def login(login_data: UserLogin, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login_user(login_data)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_data: TokenRefresh, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.refresh_token(refresh_data.refresh_token)

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.post("/change-password")
async def change_password(password_data: PasswordChange, current_user: User = Depends(get_current_active_user), auth_service: AuthService = Depends(get_auth_service)):
    from app.core.security import verify_password, get_password_hash

    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrent"
        )

    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long"
        )

    current_user.password_hash = get_password_hash(password_data.new_password)
    auth_service.db.commit()

    return {"message": "Password changed successfully"}
