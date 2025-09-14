from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas, utils, oauth2
from .. import database

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[schemas.UserOut])
def get_users(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут получать информацию о других пользователях",
        )

    users = db.query(models.User).all()
    return users


@router.get("/stats")
def get_users_stats(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут получать статистику",
        )

    users_stats = (
        db.query(
            models.User.id,
            models.User.username,
            models.User.last_name,
            models.User.email,
            models.User.role,
            func.count(models.Order.id).label("orders"),
            func.coalesce(func.sum(models.Order.total_price), 0).label("totalSpent"),
        )
        .outerjoin(models.Order, models.Order.user_id == models.User.id)
        .group_by(models.User.id)
        .all()
    )

    return [
        {
            "id": u.id,
            "username": u.username,
            "last_name": u.last_name,
            "email": u.email,
            "role": u.role,
            "orders": u.orders,
            "totalSpent": u.totalSpent,
        }
        for u in users_stats
    ]


@router.get("/me", response_model=schemas.UserOut)
def get_current_user_profile(
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    return current_user


@router.get("/{id:int}", response_model=schemas.UserOut)
def get_user(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут получать информацию о других пользователях",
        )

    user = db.query(models.User).filter(models.User.id == id).first()

    if user == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с id: {id} не существует",
        )
    return user


@router.post(
    "/create_user", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut
)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут создавать пользователей",
        )

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.put("/me", response_model=schemas.UserCreate)
def update_user_profile(
    updated_user: schemas.UserCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    user_query = db.query(models.User).filter(models.User.id == current_user.id)
    user = user_query.first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с id: {current_user.id} не был найден",
        )

    user_query.update(
        {
            models.User.username.name: updated_user.username,
            models.User.last_name.name: updated_user.last_name,
            models.User.email.name: updated_user.email,
            models.User.password.name: (
                utils.hash(updated_user.password) if updated_user.password else None
            ),
        },
        synchronize_session=False,
    )

    db.commit()
    return user


@router.put("/{id}", response_model=schemas.UserOut)
def update_user_by_admin(
    id: int,
    updated_user: schemas.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут обновлять пользователей",
        )
    user_query = db.query(models.User).filter(models.User.id == id)
    user = user_query.first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с id: {id} не был найден",
        )

    user_query.update(updated_user.model_dump(), synchronize_session=False)  # type: ignore

    db.commit()
    return user_query.first()


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_profile(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):

    user_query = db.query(models.User).filter(models.User.id == current_user.id)
    user = user_query.first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с id: {current_user.id} не был найден",
        )

    user_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_admin(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут удалять пользователей",
        )

    user_query = db.query(models.User).filter(models.User.id == id)
    user = user_query.first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с id: {id} не был найден",
        )

    user_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
