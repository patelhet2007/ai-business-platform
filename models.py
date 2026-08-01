import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    gstin = Column(String, unique=True, index=True, nullable=True)
    industry_type = Column(String, nullable=False) # e.g., Pharma, Textile, FMCG, Manufacturing
    iec_code = Column(String, nullable=True) # Import-Export Code
    address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    warehouses = relationship("Warehouse", back_populates="company")
    users = relationship("User", back_populates="company")
    inventories = relationship("Inventory", back_populates="company")
    invoices = relationship("Invoice", back_populates="company")
    suppliers = relationship("Supplier", back_populates="company")
    customers = relationship("Customer", back_populates="company")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="User") # SuperAdmin, Admin, CFO, InventoryManager, ProcurementHead, LogisticsHead
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="users")
    audit_logs = relationship("AuditLog", back_populates="user")


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String, nullable=False) # e.g., Factory, Warehouse A, Retail Outlet
    location = Column(String, nullable=False) # City/State
    warehouse_type = Column(String, default="Warehouse") # Factory, Warehouse, Retail, Distributor
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="warehouses")
    stocks = relationship("Inventory", back_populates="warehouse")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    sku = Column(String, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    current_stock = Column(Float, default=0.0)
    safety_stock = Column(Float, default=10.0)
    reorder_point = Column(Float, default=25.0)
    lead_time_days = Column(Integer, default=7)
    cost_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    barcode = Column(String, unique=True, index=True, nullable=True)
    qr_code = Column(String, unique=True, index=True, nullable=True)
    hsn_code = Column(String, nullable=True)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="inventories")
    warehouse = relationship("Warehouse", back_populates="stocks")
    sales_history = relationship("SalesHistory", back_populates="inventory")
    predictions = relationship("InventoryPrediction", back_populates="inventory")


class SalesHistory(Base):
    __tablename__ = "sales_history"

    id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)
    sale_date = Column(DateTime, nullable=False)
    quantity_sold = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    external_factors = Column(JSON, nullable=True) # e.g., {"festival": "Diwali", "weather": "Sunny", "season": "Winter"}

    inventory = relationship("Inventory", back_populates="sales_history")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    invoice_number = Column(String, index=True, nullable=False)
    invoice_type = Column(String, default="Sale") # Sale, Purchase
    partner_name = Column(String, nullable=False) # Customer or Supplier Name
    partner_gstin = Column(String, nullable=True)
    partner_type = Column(String, nullable=False) # Manufacturer, Wholesaler, Retailer, MSME, Regular
    issue_date = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False)
    subtotal = Column(Float, nullable=False)
    cgst = Column(Float, default=0.0)
    sgst = Column(Float, default=0.0)
    igst = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="Unpaid") # Unpaid, Paid, Overdue, Cancelled
    
    # Invoice Intelligence fields
    is_verified = Column(Boolean, default=True)
    duplicate_status = Column(String, default="Unique") # Duplicate, Suspected, Unique
    fake_invoice_risk = Column(Float, default=0.0) # 0 to 1 risk score
    gst_match_status = Column(String, default="Verified") # Match, Discrepancy, Missing
    wrong_hsn_detected = Column(Boolean, default=False)
    wrong_tax_detected = Column(Boolean, default=False)
    msme_45day_alert = Column(Boolean, default=False)
    ai_validation_details = Column(JSON, nullable=True) # Full details from Invoice Intelligence
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="invoices")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String, nullable=False)
    gstin = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    
    # Supplier Intelligence
    delivery_time_score = Column(Float, default=5.0) # Rating out of 5
    quality_score = Column(Float, default=5.0) # Rating out of 5
    price_score = Column(Float, default=5.0) # Rating out of 5
    reliability_score = Column(Float, default=5.0) # Rating out of 5
    complaint_rate = Column(Float, default=0.0) # percentage
    overall_rank = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="suppliers")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String, nullable=False)
    gstin = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    # Customer Credit Intelligence
    credit_score = Column(Integer, default=750) # 300 - 900 score
    payment_behavior_rating = Column(String, default="Excellent") # Excellent, Good, Average, Poor, High Risk
    outstanding_amount = Column(Float, default=0.0)
    returns_rate = Column(Float, default=0.0) # percentage
    purchase_frequency_days = Column(Integer, default=30)
    late_payment_risk = Column(Float, default=0.0) # 0 to 1 risk score
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="customers")


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    tracking_number = Column(String, index=True, nullable=False)
    carrier = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    shipping_mode = Column(String, default="Sea") # Air, Sea, Courier
    current_status = Column(String, default="Factory") # Factory, Warehouse, Port, Customs, Vessel, Destination, Delivered
    incoterms = Column(String, default="FOB") # FOB, CIF, EXW, DDP, etc.
    container_type = Column(String, default="20FT") # 20FT, 40FT, 40HC
    estimated_delivery = Column(DateTime, nullable=True)
    actual_delivery = Column(DateTime, nullable=True)
    is_import_export = Column(Boolean, default=False)
    compliance_documents = Column(JSON, nullable=True) # e.g. {"Commercial Invoice": "Verified", "Packing List": "Verified", "Bill of Lading": "Missing"}
    currency_risk_usd_gbp_eur = Column(JSON, nullable=True) # e.g. {"USD_risk": "Low", "EUR_risk": "Moderate"}
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class InventoryPrediction(Base):
    __tablename__ = "inventory_predictions"

    id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)
    prediction_date = Column(DateTime, default=datetime.datetime.utcnow)
    predicted_stockout_date = Column(DateTime, nullable=True)
    recommended_reorder_qty = Column(Float, nullable=False)
    confidence_score = Column(Float, default=0.90) # percentage/score 0-1
    recommended_vendor_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    is_overstocked = Column(Boolean, default=False)
    overstock_dead_capital = Column(Float, default=0.0)
    suggested_action = Column(String, nullable=True) # Discount, Bundle, Stop Purchase
    demand_forecast_monthly = Column(JSON, nullable=True) # JSON array of [Month, Qty]
    price_trend_prediction = Column(String, default="Stable") # Rising, Dropping, Stable

    inventory = relationship("Inventory", back_populates="predictions")


class AICFOCopilotSession(Base):
    __tablename__ = "ai_cfo_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    voice_language = Column(String, default="English") # English, Hindi, Gujarati
    audio_path = Column(String, nullable=True) # Path to saved mp3/wav
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False) # CREATE, UPDATE, DELETE, VERIFY, PREDICT, EXPORT
    table_name = Column(String, nullable=False)
    record_id = Column(Integer, nullable=True)
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
