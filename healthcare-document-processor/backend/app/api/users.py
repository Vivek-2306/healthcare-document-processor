from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_admin, require_staff, get_current_active_user
from app.models import User, UserRole
from app.schemas.auth import UserResponse
from app.services.auth_services import get_auth_service, AuthService

router = APIRouter(prefix='/users', tags=["users"])

@router.get("/", response_model=List[UserResponse])
async def list_users(skip: int=0, limit:int=100, current_user: User = Depends(require_staff), db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user: User = Depends(require_staff), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}/activate")
async def activate_user(user_id: str, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.is_active = False
    db.commit()
    return {"message": "User deactivate successfully"}

@router.put("/{user_id}/role")
async def update_user_role(user_id:str, new_role: UserRole, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.role = new_role
    db.commit()
    return {"message": f"User role updated to {new_role.value}"}