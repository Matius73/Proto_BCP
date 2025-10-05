from fastapi import APIRouter, HTTPException
from typing import List
from db import get_conn
from models import ProductIn, ProductOut

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("", response_model=List[ProductOut])
def list_products():
    with get_conn() as conn:
        rows = conn.execute("SELECT id, nombre, precio FROM productos ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]

@router.post("", response_model=ProductOut)
def create_product(p: ProductIn):
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO productos (nombre, precio) VALUES (?, ?)",
            (p.nombre, p.precio),
        )
        pid = cur.lastrowid
        row = conn.execute("SELECT id, nombre, precio FROM productos WHERE id = ?", (pid,)).fetchone()
        return dict(row)

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, p: ProductIn):
    with get_conn() as conn:
        conn.execute(
            "UPDATE productos SET nombre = ?, precio = ? WHERE id = ?",
            (p.nombre, p.precio, product_id),
        )
        row = conn.execute("SELECT id, nombre, precio FROM productos WHERE id = ?", (product_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return dict(row)

@router.delete("/{product_id}")
def delete_product(product_id: int):
    with get_conn() as conn:
        conn.execute("DELETE FROM productos WHERE id = ?", (product_id,))
    return {"ok": True}
