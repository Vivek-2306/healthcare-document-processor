from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from app.core.database import get_db
from app.core.security import create_token_pair, verify_password, get_password_hash, create_access_token, verify_token
from app.models import User, UserRole
from app.schemas.auth import UserCreate, UserLogin


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user_data: UserCreate) -> dict:

        if user_data.password != user_data.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password do not match"
            )

        existing_user = self.db.query(User).filter(
            User.email == user_data.email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        if len(user_data.password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters long"
            )

        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            role=user_data.role,
            is_active=True,
            is_verified=False
        )

        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)

        tokens = create_token_pair(user_id=str(new_user.id), email=new_user.email, role=new_user.role.value)

        return {
            "user": {
                "id": str(new_user.id),
                "email": new_user.email,
                "full_name": new_user.full_name,
                "role": new_user.role.value,
                "is_active": new_user.is_active,
                "is_verified": new_user.is_verified
            },
            "tokens": tokens
        }

    def login_user(self, login_data: UserLogin) -> dict:
        
        user = self.db.query(User).filter(User.email == login_data.email).first()

        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )

        user.last_login = datetime.utcnow()
        self.db.commit()

        tokens = create_token_pair(
            user_id=str(user.id),
            email=user.email,
            role=user.role.value
        )

        return {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value,
                "is_active": user.is_active,
                "is_verified": user.is_verified
            },
            "tokens": tokens
        }

    def refresh_token(self, refresh_token: str) -> dict:

        payload = verify_token(refresh_token, "refresh")
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        new_access_token = create_token_pair(
            user_id=str(user.id),
            email=user.email,
            role=user.role.value
        )["access_token"]

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }

    def get_current_user(self, token: str) -> User:

        payload = verify_token(token, "access")
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        return user

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
        return AuthService(db)