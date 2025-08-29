from fastapi import FastAPI
from . import models
from .routers import users, products, orders, auth
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(users.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)


@app.get("/")
def root():
    return {"message": "Hello world!"}
