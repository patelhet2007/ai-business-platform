-- AI Business Operations Intelligence Platform
-- PostgreSQL Enterprise Database Initialization Script

-- 1. Create Companies & Subsidiaries
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    gstin VARCHAR(15) UNIQUE,
    industry_type VARCHAR(100) NOT NULL,
    iec_code VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Users & Role RBAC
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'User', -- SuperAdmin, Admin, CFO, InventoryManager, ProcurementHead, LogisticsHead
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Multi-Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    warehouse_type VARCHAR(50) DEFAULT 'Warehouse', -- Factory, Warehouse, Retail, Distributor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Live Inventory items
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE CASCADE NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_stock DOUBLE PRECISION DEFAULT 0.0,
    safety_stock DOUBLE PRECISION DEFAULT 10.0,
    reorder_point DOUBLE PRECISION DEFAULT 25.0,
    lead_time_days INTEGER DEFAULT 7,
    cost_price DOUBLE PRECISION NOT NULL,
    selling_price DOUBLE PRECISION NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    qr_code VARCHAR(100) UNIQUE,
    hsn_code VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Sales History for ML Prophet/XGBoost models
CREATE TABLE IF NOT EXISTS sales_history (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE NOT NULL,
    sale_date TIMESTAMP NOT NULL,
    quantity_sold DOUBLE PRECISION NOT NULL,
    unit_price DOUBLE PRECISION NOT NULL,
    external_factors JSONB
);

-- 6. Suppliers / Vendors Ranked by Intelligence
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    delivery_time_score DOUBLE PRECISION DEFAULT 5.0,
    quality_score DOUBLE PRECISION DEFAULT 5.0,
    price_score DOUBLE PRECISION DEFAULT 5.0,
    reliability_score DOUBLE PRECISION DEFAULT 5.0,
    complaint_rate DOUBLE PRECISION DEFAULT 0.0,
    overall_rank INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Customers & Accounts Credit Risk profile
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    credit_score INTEGER DEFAULT 750,
    payment_behavior_rating VARCHAR(100) DEFAULT 'Excellent',
    outstanding_amount DOUBLE PRECISION DEFAULT 0.0,
    returns_rate DOUBLE PRECISION DEFAULT 0.0,
    purchase_frequency_days INTEGER DEFAULT 30,
    late_payment_risk DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Invoices with Tax calculation Audit
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_type VARCHAR(50) DEFAULT 'Sale', -- Sale, Purchase
    partner_name VARCHAR(255) NOT NULL,
    partner_gstin VARCHAR(15),
    partner_type VARCHAR(100) NOT NULL,
    issue_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    cgst DOUBLE PRECISION DEFAULT 0.0,
    sgst DOUBLE PRECISION DEFAULT 0.0,
    igst DOUBLE PRECISION DEFAULT 0.0,
    total_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid',
    is_verified BOOLEAN DEFAULT TRUE,
    duplicate_status VARCHAR(50) DEFAULT 'Unique',
    fake_invoice_risk_score DOUBLE PRECISION DEFAULT 0.0,
    wrong_hsn_detected BOOLEAN DEFAULT FALSE,
    wrong_tax_detected BOOLEAN DEFAULT FALSE,
    msme_45day_alert BOOLEAN DEFAULT FALSE,
    ai_validation_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. AI Predictions Output storage
CREATE TABLE IF NOT EXISTS inventory_predictions (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    predicted_stockout_date TIMESTAMP,
    recommended_reorder_qty DOUBLE PRECISION NOT NULL,
    confidence_score DOUBLE PRECISION DEFAULT 0.90,
    recommended_vendor_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    is_overstocked BOOLEAN DEFAULT FALSE,
    overstock_dead_capital DOUBLE PRECISION DEFAULT 0.0,
    suggested_action TEXT,
    demand_forecast_monthly JSONB,
    price_trend_prediction VARCHAR(100) DEFAULT 'Stable'
);

-- 10. Voice Sessions logs
CREATE TABLE IF NOT EXISTS ai_cfo_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    voice_language VARCHAR(50) DEFAULT 'English',
    audio_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Platform Audit Trail Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, VERIFY, PREDICT, EXPORT
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------
-- INSERT SEED DATA FOR MOCK ERP SYSTEM
-- ----------------------------------------------------

INSERT INTO companies (name, gstin, industry_type, iec_code, address) 
VALUES ('Aditya Polymers & Formulation Ltd', '24AAACB1209C1Z9', 'Chemicals & Manufacturing', 'IEC104992', 'GIDC Industrial Estate, Hazira, Surat, Gujarat')
ON CONFLICT DO NOTHING;

INSERT INTO users (email, hashed_password, full_name, role, company_id, is_active)
VALUES ('jayesh.doshi@adityapoly.in', 'argon2_hashed_dummy_key_1029', 'Jayesh Doshi', 'CFO', 1, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO warehouses (company_id, name, location, warehouse_type) VALUES 
(1, 'Hazira Factory Warehouse', 'Surat, Gujarat', 'Factory'),
(1, 'Baddi Formulations Hub', 'Solan, Himachal Pradesh', 'Warehouse'),
(1, 'Coimbatore Spinning Complex', 'Coimbatore, Tamil Nadu', 'Warehouse'),
(1, 'Bhiwandi Logistics master', 'Bhiwandi, Maharashtra', 'Distributor')
ON CONFLICT DO NOTHING;

INSERT INTO inventory (company_id, warehouse_id, sku, name, category, current_stock, safety_stock, reorder_point, lead_time_days, cost_price, selling_price, barcode, qr_code, hsn_code) VALUES
(1, 1, 'CH-PL-902', 'Polyethylene Resin Grade-A', 'Chemicals', 12.0, 25.0, 35.0, 15, 85.0, 120.0, '8901234005112', 'QR39011010_01', '39011010'),
(1, 2, 'PH-PA-500', 'Paracetamol Active Pharma Ingredient', 'Pharma Raw Materials', 280.0, 50.0, 100.0, 5, 450.0, 620.0, '8902234002441', 'QR29221190_02', '29221190'),
(1, 3, 'TX-CT-40S', 'Combed Cotton Yarn 40s', 'Textiles', 1500.0, 200.0, 400.0, 10, 240.0, 310.0, '8903321003552', 'QR52052400_03', '52052400'),
(1, 4, 'PKG-BX-DF', 'Double Wall Corrugated Cartons', 'Packaging', 4200.0, 500.0, 800.0, 3, 15.0, 22.0, '8905221008891', 'QR48191000_04', '48191000')
ON CONFLICT DO NOTHING;

INSERT INTO suppliers (company_id, name, gstin, delivery_time_score, quality_score, price_score, reliability_score, complaint_rate, overall_rank, location) VALUES
(1, 'Gujarat Alkalies & Chemicals Ltd', '24AAACG1204R1Z3', 4.8, 4.9, 4.1, 4.7, 0.5, 1, 'Vadodara, Gujarat'),
(1, 'Aurobindo Pharma Ltd', '36AAPCA2204D1Z9', 4.7, 4.9, 4.3, 4.8, 0.2, 1, 'Visakhapatnam, AP'),
(1, 'Vardhman Textiles Group', '03AAACV9010E1Z1', 4.6, 4.8, 4.5, 4.7, 0.8, 1, 'Ludhiana, Punjab')
ON CONFLICT DO NOTHING;

INSERT INTO customers (company_id, name, gstin, credit_score, payment_behavior_rating, outstanding_amount, returns_rate, purchase_frequency_days, late_payment_risk) VALUES
(1, 'Reliable Distripress India Pvt Ltd', '27AAPCS1023D1Z4', 810, 'Excellent', 125000.0, 0.8, 10, 0.05),
(1, 'Chirag General Store Retail chain', '24AAACC5501B1ZE', 540, 'Poor (Delayed)', 620000.0, 7.2, 45, 0.74)
ON CONFLICT DO NOTHING;
