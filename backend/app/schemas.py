from pydantic import BaseModel
from datetime import datetime


class User(BaseModel):
    id: int
    username: str
    email: str
    password: str
    role: str


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str


class UserUpdate(BaseModel):
    username: str
    email: str
    role: str


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: str | None = None


class Product(ProductBase):
    id: int
    quantity: int


class ProductCreate(ProductBase):
    quantity: int


class OrderItemBase(BaseModel):
    name: str
    price: float
    quantity: int


class OrderItem(OrderItemBase):
    id: int
    product_id: int
    order_id: int
    description: str


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderBase(BaseModel):
    id: int
    total_price: float
    created_at: datetime
    status: str
    items: list[OrderItemBase]


class Order(BaseModel):
    id: int
    total_price: float
    created_at: datetime
    status: str
    user_id: int
    items: list[OrderItem]


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]


class OrderStatusUpdate(BaseModel):
    status: str


class OrderStatusUpdateResponse(BaseModel):
    id: int
    total_price: float
    created_at: datetime
    status: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: str | None


class CartItemBase(BaseModel):
    name: str
    price: float
    quantity: int


class CartItem(CartItemBase):
    id: int
    cart_id: int
    product_id: int


class CartBase(BaseModel):
    items: list[CartItemBase]


class Cart(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    items: list[CartItem]
