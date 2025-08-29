from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from .. import models, schemas, oauth2
from .. import database

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[schemas.ProductBase])
def get_products(db: Session = Depends(database.get_db)):
    products = db.query(models.Product).all()
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
    