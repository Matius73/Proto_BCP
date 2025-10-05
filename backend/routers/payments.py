from fastapi import APIRouter
from typing import List
from db import get_conn
from models import PaymentIn, PaymentOut

router = APIRouter(prefix="/pagos", tags=["pagos"])

@router.get("", response_model=List[PaymentOut])
def list_payments():
    with get_conn() as conn:
        rows = conn.execute("SELECT id, pedido_id, monto, estado FROM pagos ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]

@router.post("", response_model=PaymentOut)
def create_payment(p: PaymentIn):
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO pagos (pedido_id, monto, estado) VALUES (?, ?, ?)",
            (p.pedido_id, p.monto, p.estado),
        )
        pid = cur.lastrowid
        row = conn.execute("SELECT id, pedido_id, monto, estado FROM pagos WHERE id = ?", (pid,)).fetchone()
        return dict(row)
