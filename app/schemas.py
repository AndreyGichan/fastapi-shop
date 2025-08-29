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

class Product(ProductBase):
    id: int
    quantity: int

class ProductCreate(ProductBase):
    quantity: int


class OrderItemBase(BaseModel):
    name: str
    price: float
    quantity: int

class OrderItem(BaseModel):
    id: int
    product_id: int
    order_id: int

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderBase(BaseModel):
    total_price: float
    created_at: datetime
    status: str
    items: list[OrderItem]

class OrderCreate(BaseModel):
    items: list[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: str | None