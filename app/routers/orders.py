from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from .. import models, schemas, oauth2
from .. import database

ALLOWED_SORT_FIELDS = {"total_price", "status", "created_at", "user_id"}

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=list[schemas.Order])
def get_orders(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
    search_by_status: str = Query("", detail="Поиск по статусу"),
    search_by_product_name: str = Query("", detail="Поиск по названию товара в заказе"),
    max_total_price: float | None = Query(None, ge=0, detail="Фильтр по максимальной стоимости заказа"),
    min_total_price: float | None = Query(None, ge=0, detail="Фильтр по минимальной стоимости заказа"),
    sort_by: str | None = Query(None, description="Поле для сортировки"),
    sort_order: str = Query("desc", description="Порядок сортировки")
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут получать информацию о других заказах",
        )
    if min_total_price is not None and max_total_price is not None and min_total_price > max_total_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_total_price не может быть больше max_total_price"
        )
    conditions= []
    if max_total_price is not None:
        conditions.append(models.Order.total_price <= max_total_price)

    if min_total_price is not None:
        conditions.append(models.Order.total_price >= min_total_price)
        
    query = (
        db.query(models.Order, models.OrderItem, models.Product)
        .filter(models.Order.status.ilike(f"%{search_by_status}%"), *conditions)
        .join(models.OrderItem, models.Order.id == models.OrderItem.order_id)
        .join(models.Product, models.Product.id == models.OrderItem.product_id)
    )

    if search_by_product_name is not None:
        query = query.filter(models.Product.name.ilike(f"%{search_by_product_name}%"))

    if sort_by:
        if sort_by not in ALLOWED_SORT_FIELDS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Недопустимое поле сортировки: {sort_by}"
            )
        sort_column = getattr(models.Order, sort_by)
        query = query.order_by(asc(sort_column) if sort_order == "asc" else desc(sort_column))

    else:
        query = query.order_by(models.Order.id)

    results = query.all()

    orders_dict = {}
    for order, order_item, product in results:
        if order.id not in orders_dict:
            orders_dict[order.id] = {
                "id": order.id,
                "user_id": order.user_id,
                "created_at": order.created_at,
                "total_price": order.total_price,
                "status": order.status,
                "items": [],
            }
        orders_dict[order.id]["items"].append(
            {
                "id": order_item.id,
                "product_id": order_item.product_id,
                "order_id": order_item.order_id,
                "quantity": order_item.quantity,
                "name": product.name,
                "description": product.description,
                "price": order_item.price,
            }
        )
    orders = list(orders_dict.values())

    return orders


@router.get("/my_orders", response_model=list[schemas.OrderBase])
def get_my_orders(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
    search_by_status: str = Query("", detail="Поиск по статусу"),
    search_by_product_name: str = Query("", detail="Поиск по названию товара в заказе"),
    max_total_price: float | None = Query(None, ge=0, detail="Фильтр по максимальной стоимости заказа"),
    min_total_price: float | None = Query(None, ge=0, detail="Фильтр по минимальной стоимости заказа"),
    sort_by: str | None = Query(None, description="Поле для сортировки"),
    sort_order: str = Query("desc", description="Порядок сортировки")
):
    if min_total_price is not None and max_total_price is not None and min_total_price > max_total_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_total_price не может быть больше max_total_price"
        )
    conditions= []
    if max_total_price is not None:
        conditions.append(models.Order.total_price <= max_total_price)

    if min_total_price is not None:
        conditions.append(models.Order.total_price >= min_total_price)

    query = (
        db.query(models.Order, models.OrderItem, models.Product)
        .join(models.OrderItem, models.Order.id == models.OrderItem.order_id)
        .join(models.Product, models.Product.id == models.OrderItem.product_id)
        .filter(models.Order.user_id == current_user.id, models.Order.status.ilike(f"%{search_by_status}%"), *conditions)
    )
    if search_by_product_name is not None:
        query = query.filter(models.Product.name.ilike(f"%{search_by_product_name}%"))


    if sort_by:
        if sort_by not in ALLOWED_SORT_FIELDS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Недопустимое поле сортировки: {sort_by}"
            )
        sort_column = getattr(models.Order, sort_by)
        query = query.order_by(asc(sort_column) if sort_order == "asc" else desc(sort_column))

    else:
        query = query.order_by(models.Order.id)

    results = query.all()
    orders_dict = {}
    for order, order_item, product in results:
        if order.id not in orders_dict:
            orders_dict[order.id] = {
                "id": order.id,
                "created_at": order.created_at,
                "total_price": order.total_price,
                "status": order.status,
                "items": [],
            }
        orders_dict[order.id]["items"].append(
            {
                "name": product.name,
                "price": order_item.price,
                "quantity": order_item.quantity,
            }
        )
    my_orders = list(orders_dict.values())
    return my_orders


@router.post("/", response_model=schemas.OrderBase, status_code=status.HTTP_201_CREATED)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if not order.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Список товаров пуст"
        )
    
    total_price = 0
    order_items_objects = []

    for item in order.items:
        product = (
            db.query(models.Product)
            .filter(models.Product.id == item.product_id)
            .first()
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Товар с id {item.product_id} не был найден",
            )
        if product.quantity < item.quantity: # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Недостаточно товара '{product.name}' на складе",
            )
        total_price += product.price * item.quantity

        order_items_objects.append(
            models.OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price
            )
        )
        product.quantity -= item.quantity  # type: ignore

    new_order = models.Order(
        user_id=current_user.id,
        total_price=total_price,
        items=order_items_objects
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for order_item in new_order.items:
        if not getattr(order_item, "product", None):
            order_item.product = db.query(models.Product).filter(models.Product.id == order_item.product_id).first()
        order_item.name = order_item.product.name if order_item.product else ""
        
    return new_order


@router.put("/{id}", response_model=schemas.OrderStatusUpdateResponse)
def update_order_status(
    id: int,
    updated_order: schemas.OrderStatusUpdate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут обновлять статус заказа",
        )
    order_query = db.query(models.Order).filter(models.Order.id == id)
    order = order_query.first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден"
        )

    order_query.update(updated_order.model_dump(), synchronize_session=False)  # type: ignore
    db.commit()
    return order_query.first()
