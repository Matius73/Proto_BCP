from fastapi import APIRouter, HTTPException
from db import get_conn
from models import UserIn, LoginIn, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(user: UserIn):
    with get_conn() as conn:
        try:
            cur = conn.execute(
                "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)",
                (user.nombre, user.email, user.contraseña),
            )
            uid = cur.lastrowid
            row = conn.execute(
                "SELECT id, nombre, email FROM usuarios WHERE id = ?",
                (uid,),
            ).fetchone()
            return dict(row)
        except Exception as e:
            if "UNIQUE" in str(e):
                raise HTTPException(status_code=400, detail="El email ya está registrado")
            raise

@router.post("/login", response_model=UserOut)
def login(data: LoginIn):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, nombre, email FROM usuarios WHERE email = ? AND contraseña = ?",
            (data.email, data.contraseña),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        return dict(row)
