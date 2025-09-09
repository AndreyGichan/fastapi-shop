from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from .. import models, schemas, oauth2
from .. import database

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=list[schemas.CartItemBase])
def get_cart(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()

    if not cart:
        return []
    # if not cart:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Корзина пуста"
    #     )
    
    results = (
        db.query(models.CartItem, models.Product)
        .join(models.Product, models.Product.id == models.CartItem.product_id)
        .filter(models.CartItem.cart_id == cart.id)
        .all()
    )

    # if not results:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Корзина пуста"
    #     )

    items = []
    for cart_item, product in results:
        items.append(
            {
                "id": cart_item.id,
                "name": product.name,
                "price": cart_item.price,
                "quantity": cart_item.quantity,
                "image_url": product.image_url,
            }
        )
    return items

@router.delete("/{item_id}")
def delete_cart_item(item_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    cart_item = (
        db.query(models.CartItem)
        .join(models.Cart)
        .filter(models.CartItem.id == item_id, models.Cart.user_id == current_user.id)
        .first()
    )

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден в вашей корзине",
        )
    db.delete(cart_item)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/")
def clear_cart(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()

    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Корзина пуста"
        )

    db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).delete()
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{item_id}", response_model=schemas.CartItemBase)
def update_item_quantity(item_id: int, quantity: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    cart_item = (
        db.query(models.CartItem)
        .join(models.Cart)
        .filter(models.CartItem.id == item_id, models.Cart.user_id == current_user.id)
        .first()
    )

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден в вашей корзине",
        )
        
    product = db.query(models.Product).filter(models.Product.id == cart_item.product_id).first()

    if quantity <= 0:
        db.delete(cart_item)
    else:
        cart_item.quantity = quantity # type: ignore

    db.commit()

    updated_cart_item = schemas.CartItemBase(id=cart_item.id, name=product.name,price=cart_item.price,quantity=cart_item.quantity) # type: ignore

    return updated_cart_item