from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserIn(BaseModel):
    nombre: str
    email: EmailStr
    contraseña: str

class LoginIn(BaseModel):
    email: EmailStr
    contraseña: str

class UserOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr

class ProductIn(BaseModel):
    nombre: str
    precio: float

class ProductOut(BaseModel):
    id: int
    nombre: str
    precio: float

class OrderIn(BaseModel):
    usuario_id: int
    producto_id: int
    fecha: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    usuario_id: int
    producto_id: int
    fecha: str

class PaymentIn(BaseModel):
    pedido_id: int
    monto: float
    estado: str

class PaymentOut(BaseModel):
    id: int
    pedido_id: int
    monto: float
    estado: str
