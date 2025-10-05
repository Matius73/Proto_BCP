from fastapi import APIRouter
from typing import List
from datetime import datetime
from db import get_conn
from models import OrderIn, OrderOut

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

@router.get("", response_model=List[OrderOut])
def list_orders():
    with get_conn() as conn:
        rows = conn.execute("SELECT id, usuario_id, producto_id, fecha FROM pedidos ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]

@router.post("", response_model=OrderOut)
def create_order(o: OrderIn):
    fecha = o.fecha or datetime.utcnow().strftime("%Y-%m-%d")
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO pedidos (usuario_id, producto_id, fecha) VALUES (?, ?, ?)",
            (o.usuario_id, o.producto_id, fecha),
        )
        oid = cur.lastrowid
        row = conn.execute("SELECT id, usuario_id, producto_id, fecha FROM pedidos WHERE id = ?", (oid,)).fetchone()
        return dict(row)
