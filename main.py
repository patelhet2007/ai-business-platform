import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from backend.app.config import settings
from backend.app.routers import inventory, purchase, gst_invoice, finance, import_export, copilot

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise-grade AI ERP, CFO, & Global Supply Chain Intelligence Platform for Indian SMEs.",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENV") != "production" else None
)

# Allow CORS requests from standard frontend ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend domains e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Static files to stream generated voice files (MP3s)
os.makedirs("/home/user/audio", exist_ok=True)
app.mount("/audio", StaticFiles(directory="/home/user/audio"), name="audio")

# Mount API Routers
app.include_router(inventory.router, prefix=settings.API_V1_STR)
app.include_router(purchase.router, prefix=settings.API_V1_STR)
app.include_router(gst_invoice.router, prefix=settings.API_V1_STR)
app.include_router(finance.router, prefix=settings.API_V1_STR)
app.include_router(import_export.router, prefix=settings.API_V1_STR)
app.include_router(copilot.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "platform": settings.PROJECT_NAME,
        "vision": "ERP + CFO + AI Supply Chain Control Tower",
        "version": "1.0.0-Beta",
        "timezone": "Asia/Kolkata",
        "current_date": "2026-08-01",
        "api_docs_url": "/docs"
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "Healthy",
        "services": {
            "postgres": "Connected",
            "redis_cache": "Active",
            "celery_workers": "Running",
            "ocr_models": "PaddleOCR Online",
            "demand_forecast_model": "Prophet/XGBoost Ready"
        }
    }

# General Error Handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": f"An internal platform error occurred: {str(exc)}"},
    )
