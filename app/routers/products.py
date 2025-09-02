from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
from .. import models, schemas, oauth2
from .. import database
from typing import Optional

ALLOWED_SORT_FIELDS = {"price", "name", "quantity"}

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[schemas.ProductBase])
def get_products(
    db: Session = Depends(database.get_db),
    search: str = Query("", description="Поиск по названию"),
    max_price: float | None = Query(None, ge=0, description="Фильтр по максимальной цене"),
    min_price: float | None = Query(None, ge=0, description="Фильтр по минимальной цене"),
    in_stock:  bool = Query(None, description="Фильтр по наличию товара"),
    category: str | None = Query(None, description="Фильтр по категории"),
    sort_by: str | None = Query(None, description="Поле для сортировки"),
    sort_order: str = Query("desc", description="Порядок сортировки")

):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_price не может быть больше max_price"
        )
    
    conditions = []
    if max_price is not None:
        conditions.append(models.Product.price <= max_price)
    if min_price is not None:
        conditions.append(models.Product.price >= min_price)
    if in_stock is True:
        conditions.append(models.Product.quantity > 0)
    if category:
        conditions.append(models.Product.category == category)

    query = db.query(models.Product).filter(models.Product.name.ilike(f"%{search}%"), *conditions)

    if sort_by:
        if sort_by not in ALLOWED_SORT_FIELDS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Недопустимое поле сортировки: {sort_by}"
            )
        sort_column = getattr(models.Product, sort_by)
        query = query.order_by(asc(sort_column) if sort_order == "asc" else desc(sort_column))

    else:
        query = query.order_by(models.Product.id)

    products = query.all()
    return products


@router.get("/{id}", response_model=schemas.ProductBase)
def get_product(id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Товар с id: {id} не был найден",
        )
    return product


@router.post("/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user),):
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут создавать товары",
        )
    
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{id}", response_model=schemas.Product)
def update_product(id: int, updated_product: schemas.ProductCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user),):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут обновлять товары",
        )
    
    product_query = db.query(models.Product).filter(models.Product.id == id)
    product =  product_query.first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Товар с id: {id} не был найден",
        )
    
    product_query.update(updated_product.model_dump(), synchronize_session=False)  # type: ignore
    db.commit()
    return product_query.first()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user),):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут удалять товары",
        )
    
    product_query = db.query(models.Product).filter(models.Product.id == id)
    product = product_query.first()

    if product == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Товар с id: {id} не существует",
        )

    product_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
    