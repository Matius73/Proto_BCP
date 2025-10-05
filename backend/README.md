# SmartCash Backend (FastAPI)

## Setup

1. Create venv and install deps:
```
cd backend
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

2. Run server:
```
uvicorn main:app --reload --port 8000
```

API at http://127.0.0.1:8000

## Structure
- db.py: SQLite connection and migrations (tables)
- models.py: Pydantic schemas
- routers/
  - auth.py: register/login
  - products.py: CRUD productos
  - orders.py: pedidos
  - payments.py: pagos
- main.py: FastAPI app, CORS, router include
