from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from .. import models, schemas, oauth2
from .. import database

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=list[schemas.CartBase])
def get_cart(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    results = (
        db.query(models.Cart, models.CartItem, models.Product)
        .join(models.CartItem, models.Cart.id == models.CartItem.cart_id)
        .join(models.Product, models.Product.id == models.CartItem.product_id)
        .filter(models.Cart.user_id == current_user.id)
        .all()
    )

    cart_dict = {}
    for cart, cart_item, product in results:
        if cart.id not in cart_dict:
            cart_dict[cart.id] = {
                "id": cart.id,
                "created_at": cart.created_at,
                "items": [],
            }
        cart_dict[cart.id]["items"].append(
            {
                "name": product.name,
                "price": cart_item.price,
                "quantity": cart_item.quantity,
            }
        )
    cart = list(cart_dict.values())
    return cart

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

@router.put("/{item_id}")
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
    
    if quantity <= 0:
        db.delete(cart_item)
    else:
        cart_item.quantity = quantity # type: ignore

    db.commit()

    return cart_item