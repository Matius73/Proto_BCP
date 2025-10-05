from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import init_db
from routers.auth import router as auth_router
from routers.products import router as products_router
from routers.orders import router as orders_router
from routers.payments import router as payments_router

app = FastAPI(title="SmartCash Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def _startup():
    init_db()

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(payments_router)

@app.get("/")
def root():
    return {"ok": True, "service": "SmartCash Backend"}
