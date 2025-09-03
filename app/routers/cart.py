from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from .. import models, schemas, oauth2
from .. import database

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=schemas.CartBase)
def get_cart(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    cart = (
        db.query(models.Cart, models.CartItem, models.Product)
        .join(models.CartItem, models.Cart.id == models.CartItem.cart_id)
        .join(models.Product, models.Product.id == models.CartItem.product_id)
        .filter(models.Cart.user_id == current_user.id)
        .all()
    )
    return cart



