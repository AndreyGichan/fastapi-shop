from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from .. import models, schemas, oauth2
from .. import database

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=list[schemas.Order])
def get_orders(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут получать информацию о других заказах",
        )
    orders = db.query(models.Order).all()
    return orders

@router.get("/my_orders", response_model=list[schemas.OrderBase])
def get_my_orders(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):

    my_orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return my_orders

@router.post("/", response_model=schemas.OrderBase, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    
    new_order = models.Order(user_id=current_user.id, total_price=0)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    total_price = 0 
    order_items = [] 

    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product with id {item.product_id} not found")

        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        total_price += product.price * item.quantity
        db.add(order_item)
        order_items.append({
            "id": order_item.id,
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": item.quantity
        })

    db.query(models.Order).filter(models.Order.id == new_order.id).update({
        models.Order.total_price.name: total_price
    })
    db.commit()

    return new_order