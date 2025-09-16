from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, utils, oauth2
from ..database import get_db
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
import secrets
import string

router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=schemas.Token)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.email == user_credentials.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Неверные учетные данные",
        )

    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Неверные учетные данные",
        )

    access_token = oauth2.create_access_token(data={"user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_user = (
        db.query(models.User).filter(models.User.email == user.email).first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует",
        )

    hashed_password = utils.hash(user.password)
    new_user = models.User(
        username=user.username,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def generate_temp_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_"
    return "".join(secrets.choice(alphabet) for _ in range(length))


@router.post("/admin/temp-password", response_model=schemas.AdminTempPasswordResponse)
def admin_generate_temp_password(
    request: schemas.AdminTempPasswordRequest,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы ",
        )

    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь с таким email не найден",
        )

    temp_password = generate_temp_password()

    hashed = utils.hash(temp_password)
    user.password = hashed  # type: ignore
    db.commit()

    return schemas.AdminTempPasswordResponse(
        email=user.email, temp_password=temp_password  # type: ignore
    )
