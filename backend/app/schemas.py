from pydantic import BaseModel, conint, EmailStr
from datetime import datetime


class User(BaseModel):
    id: int
    username: str
    last_name: str | None = None
    email: str
    password: str
    role: str


class UserCreate(BaseModel):
    username: str
    last_name: str | None = None
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    last_name: str | None = None
    email: str
    role: str


class UserUpdate(BaseModel):
    username: str
    last_name: str | None = None
    email: str
    role: str


class UserUpdateProfile(BaseModel):
    username: str
    last_name: str | None = None
    email: str
    password: str | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class ProductBase(BaseModel):
    id: int
    name: str
    description: str
    price: float
    original_price: float | None = None
    discount: float | None = None
    original_price: float | None = None
    discount: float | None = None
    image_url: str | None = None


class Product(ProductBase):
    quantity: int
    category: str


class ProductCreate(ProductBase):
    quantity: int
    category: str


class ProductWithRating(ProductBase):
    average_rating: float | None = None
    reviews_count: int | None = None


class OrderItemBase(BaseModel):
    product_id: int
    id: int
    name: str
    price: float
    quantity: int
    image_url: str | None = None


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
    address: str
    phone: str
    items: list[OrderItemBase]


class Order(BaseModel):
    id: int
    total_price: float
    created_at: datetime
    status: str
    address: str
    phone: str
    user_id: int
    items: list[OrderItem]


class OrderCreate(BaseModel):
    address: str
    phone: str
    # items: list[OrderItemCreate]


class OrderStatusUpdate(BaseModel):
    status: str


class OrderStatusUpdateResponse(BaseModel):
    id: int
    total_price: float
    created_at: datetime
    status: str


class ReviewCreate(BaseModel):
    rating: conint(ge=1, le=5)  # type: ignore


class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    rating: int
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: str | None


class CartItemBase(BaseModel):
    id: int
    name: str
    price: float
    quantity: int
    image_url: str | None = None


class CartItem(CartItemBase):
    cart_id: int
    product_id: int


class CartBase(BaseModel):
    items: list[CartItemBase]


class Cart(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    items: list[CartItem]


class CartAdd(BaseModel):
    product_id: int
    quantity: int


class AdminTempPasswordRequest(BaseModel):
    email: EmailStr


class AdminTempPasswordResponse(BaseModel):
    email: EmailStr
    temp_password: str
