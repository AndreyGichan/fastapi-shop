from fastapi import APIRouter, Depends, HTTPException, status, Response, Query, Body
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
    max_price: float | None = Query(
        None, ge=0, description="Фильтр по максимальной цене"
    ),
    min_price: float | None = Query(
        None, ge=0, description="Фильтр по минимальной цене"
    ),
    in_stock: bool = Query(None, description="Фильтр по наличию товара"),
    categories: list[str] = Query(None, description="Фильтр по категориям"),
    sort_by: str | None = Query(None, description="Поле для сортировки"),
    sort_order: str = Query("desc", description="Порядок сортировки"),
):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_price не может быть больше max_price",
        )

    conditions = []
    if max_price is not None:
        conditions.append(models.Product.price <= max_price)
    if min_price is not None:
        conditions.append(models.Product.price >= min_price)
    if in_stock is True:
        conditions.append(models.Product.quantity > 0)
    if categories:
        conditions.append(models.Product.category.in_(categories))

    query = db.query(models.Product).filter(
        models.Product.name.ilike(f"%{search}%"), *conditions
    )

    if sort_by:
        if sort_by not in ALLOWED_SORT_FIELDS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Недопустимое поле сортировки: {sort_by}",
            )
        sort_column = getattr(models.Product, sort_by)
        query = query.order_by(
            asc(sort_column) if sort_order == "asc" else desc(sort_column)
        )

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


from fastapi import Form, UploadFile, File
import os
from uuid import uuid4


@router.post("/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    quantity: int = Form(...),
    category: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут создавать товары",
        )

    upload_dir = "static/images"

    if not image.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Файл изображения должен иметь имя",
        )

    allowed_exts = {"jpg", "jpeg", "png", "gif", "webp"}
    ext = image.filename.rsplit(".", 1)[-1].lower()
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Недопустимый формат изображения. Разрешены: {', '.join(allowed_exts)}",
        )
    file_name = f"{uuid4()}.{ext}"
    file_path = os.path.join(upload_dir, file_name)

    with open(file_path, "wb") as buffer:
        buffer.write(image.file.read())

    image_url = f"/static/images/{file_name}"

    new_product = models.Product(
        name=name,
        description=description,
        price=price,
        quantity=quantity,
        category=category,
        image_url=image_url,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{id}", response_model=schemas.Product)
def update_product(
    id: int,
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    quantity: int = Form(...),
    category: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен: только администраторы могут обновлять товары",
        )

    product_query = db.query(models.Product).filter(models.Product.id == id)
    product = product_query.first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Товар с id: {id} не был найден",
        )
    update_data = {
        "name": name,
        "description": description,
        "price": price,
        "quantity": quantity,
        "category": category,
    }

    if image and image.filename:
        upload_dir = "static/images"
        os.makedirs(upload_dir, exist_ok=True)

        allowed_exts = {"jpg", "jpeg", "png", "gif", "webp"}
        ext = image.filename.rsplit(".", 1)[-1].lower()
        if ext not in allowed_exts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Недопустимый формат изображения. Разрешены: {', '.join(allowed_exts)}",
            )

        file_name = f"{uuid4()}.{ext}"
        file_path = os.path.join(upload_dir, file_name)

        with open(file_path, "wb") as buffer:
            buffer.write(image.file.read())

        update_data["image_url"] = f"/{file_path}"

    product_query.update(update_data, synchronize_session=False)  # type: ignore
    db.commit()

    return product_query.first()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
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


@router.post("/cart", status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: schemas.CartAdd = Body(...),
    # product_id: int,
    # quantity: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    print(payload)
    product_id = payload.product_id
    quantity = payload.quantity
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Товар с id: {product_id} не найден",
        )

    if product.quantity < quantity:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недостаточно товара на складе",
        )

    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    if not cart:
        cart = models.Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_item = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.cart_id == cart.id, models.CartItem.product_id == product_id
        )
        .first()
    )

    if cart_item:
        cart_item.quantity += quantity  # type: ignore
    else:
        cart_item = models.CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            price=product.price,
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    cart_item_data = schemas.CartItemBase(id=cart_item.id, name=product.name, price=cart_item.price, quantity=cart_item.quantity, image_url=product.image_url)  # type: ignore
    return cart_item_data


@router.get("/categories/", response_model=list[str])
def get_categories(db: Session = Depends(database.get_db)):
    categories = db.query(models.Product.category).distinct().all()
    return [c[0] for c in categories]
