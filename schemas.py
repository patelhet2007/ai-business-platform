from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "User"
    company_name: str
    industry_type: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    full_name: str
    company_name: str

# Inventory Schemas
class InventoryItemCreate(BaseModel):
    sku: str
    name: str
    category: str
    current_stock: float
    safety_stock: float
    reorder_point: float
    lead_time_days: int
    cost_price: float
    selling_price: float
    barcode: Optional[str] = None
    warehouse_id: int
    hsn_code: Optional[str] = None

class WarehouseTransferRequest(BaseModel):
    sku: str
    from_warehouse_id: int
    to_warehouse_id: int
    quantity: float
    verified_by_barcode: bool = True

# Purchase Schemas
class SmartPurchaseRequest(BaseModel):
    sku: str
    current_stock: float
    target_warehouse_id: int

# Invoice & OCR Schemas
class OCRUploadResponse(BaseModel):
    invoice_number: str
    partner_name: str
    partner_gstin: str
    hsn_code: str
    subtotal: float
    cgst: float
    sgst: float
    igst: float
    total_amount: float
    confidence_score: float
    duplicate_status: str
    similarity_score: float
    fake_invoice_risk_score: float
    risk_category: str
    reasons: List[str]

class GSTINVerifyRequest(BaseModel):
    gstin: str

# Import-Export Schemas
class HSCodeRequest(BaseModel):
    product_name: str

class ContainerOptimizeItem(BaseModel):
    name: str
    carton_qty: int
    carton_length_m: float
    carton_width_m: float
    carton_height_m: float
    carton_weight_kg: float

class ContainerOptimizeRequest(BaseModel):
    target_container: str # 20FT, 40FT, 40HC
    items: List[ContainerOptimizeItem]

class ExportProfitCalculatorRequest(BaseModel):
    sku: str
    fob_value: float
    ocean_freight_usd: float
    insurance_premium_inr: float
    packaging_cost_inr: float
    customs_handling_inr: float
    duty_drawback_rate_percent: float = 1.5

# Copilot / Voice Schemas
class ChatRequest(BaseModel):
    session_id: str
    query: str
    voice_enabled: bool = False
    language: str = "English" # English, Hindi, Gujarati
