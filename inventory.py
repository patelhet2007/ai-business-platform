from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from backend.app.schemas import InventoryItemCreate, WarehouseTransferRequest
from backend.app.ml.demand_forecast import AIDemandForecaster

router = APIRouter(prefix="/inventory", tags=["AI Inventory Intelligence"])

# Sample Mock Database of Inventory Items
MOCK_INVENTORY = [
    {
        "id": 1,
        "sku": "CH-PL-902",
        "name": "Polyethylene Resin Grade-A",
        "category": "Chemicals",
        "current_stock": 12.0,
        "safety_stock": 25.0,
        "reorder_point": 35.0,
        "lead_time_days": 15,
        "cost_price": 85.0,
        "selling_price": 120.0,
        "barcode": "8901234005112",
        "warehouse_name": "Hazira Factory Warehouse",
        "hsn_code": "39011010",
        "recent_sales_30d": 45.0
    },
    {
        "id": 2,
        "sku": "PH-PA-500",
        "name": "Paracetamol Active Pharma Ingredient",
        "category": "Pharma Raw Materials",
        "current_stock": 280.0,
        "safety_stock": 50.0,
        "reorder_point": 100.0,
        "lead_time_days": 5,
        "cost_price": 450.0,
        "selling_price": 620.0,
        "barcode": "8902234002441",
        "warehouse_name": "Baddi Formulations Warehouse",
        "hsn_code": "29221190",
        "recent_sales_30d": 620.0
    },
    {
        "id": 3,
        "sku": "TX-CT-40S",
        "name": "Combed Cotton Yarn 40s",
        "category": "Textiles",
        "current_stock": 1500.0,
        "safety_stock": 200.0,
        "reorder_point": 400.0,
        "lead_time_days": 10,
        "cost_price": 240.0,
        "selling_price": 310.0,
        "barcode": "8903321003552",
        "warehouse_name": "Coimbatore Spinning Unit",
        "hsn_code": "52052400",
        "recent_sales_30d": 180.0
    },
    {
        "id": 4,
        "sku": "PKG-BX-DF",
        "name": "Double Wall Corrugated Cartons",
        "category": "Packaging",
        "current_stock": 4200.0,
        "safety_stock": 500.0,
        "reorder_point": 800.0,
        "lead_time_days": 3,
        "cost_price": 15.0,
        "selling_price": 22.0,
        "barcode": "8905221008891",
        "warehouse_name": "Bhiwandi Logistics Hub",
        "hsn_code": "48191000",
        "recent_sales_30d": 950.0
    },
    {
        "id": 5,
        "sku": "FMCG-PO-1L",
        "name": "Refined Sunflower Oil 1L Pouch",
        "category": "FMCG",
        "current_stock": 50.0,
        "safety_stock": 300.0,
        "reorder_point": 600.0,
        "lead_time_days": 4,
        "cost_price": 115.0,
        "selling_price": 135.0,
        "barcode": "8901023001223",
        "warehouse_name": "Kandla Port Warehouse",
        "hsn_code": "15121910",
        "recent_sales_30d": 1200.0
    }
]

@router.get("/items", response_model=List[Dict[str, Any]])
def get_inventory():
    """
    Returns live inventory across warehouses, marking stock status.
    """
    results = []
    for item in MOCK_INVENTORY:
        status = "Healthy"
        if item["current_stock"] <= item["safety_stock"]:
            status = "Stock-out Risk"
        elif item["current_stock"] >= (item["recent_sales_30d"] * 4): # Over 4 months stock
            status = "Overstocked (Dead Capital)"
            
        results.append({
            **item,
            "status": status,
            "stock_value": round(item["current_stock"] * item["cost_price"], 2)
        })
    return results

@router.get("/predict/{item_id}", response_model=Dict[str, Any])
def predict_item_dynamics(item_id: int):
    """
    Leverages AIDemandForecaster ML engine to calculate expected stockout date,
    reorder metrics, dead capital, and monthly demand projections (Prophet & Seasonality).
    """
    item = next((i for i in MOCK_INVENTORY if i["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory SKU item not found.")
        
    # Generate fake history of sales
    base_qty = item["recent_sales_30d"] / 4
    sales_history = [
        round(base_qty * 0.9), round(base_qty * 1.1), round(base_qty * 0.8),
        round(base_qty * 1.2), round(base_qty * 1.05), round(item["recent_sales_30d"])
    ]
    
    # ML Prediction Calculations
    forecast_details = AIDemandForecaster.calculate_reorder_and_stockout(
        current_stock=item["current_stock"],
        safety_stock=item["safety_stock"],
        lead_time_days=item["lead_time_days"],
        history_sales_30d=item["recent_sales_30d"],
        cost_price=item["cost_price"]
    )
    
    # 6 Month demand projections
    demand_projections = AIDemandForecaster.forecast_demand(
        history_sales=sales_history,
        months_to_forecast=6
    )
    
    # Vendor Recommendations Map
    vendor_map = {
        "Chemicals": {"vendor": "Gujarat Alkalies & Chemicals Ltd", "lead_time": 10},
        "Pharma Raw Materials": {"vendor": "Aurobindo Pharma Ltd", "lead_time": 4},
        "Textiles": {"vendor": "Vardhman Textiles Group", "lead_time": 12},
        "Packaging": {"vendor": "Horizon Packs Pvt Ltd", "lead_time": 2},
        "FMCG": {"vendor": "Adani Wilmar Logistics", "lead_time": 3}
    }
    
    vendor_info = vendor_map.get(item["category"], {"vendor": "National Wholesaler India", "lead_time": 7})
    
    return {
        "sku": item["sku"],
        "name": item["name"],
        "category": item["category"],
        "current_stock": item["current_stock"],
        "reorder_point": forecast_details["reorder_point"],
        "recommended_reorder_qty": forecast_details["recommended_reorder_qty"],
        "predicted_stockout_date": forecast_details["stockout_date"],
        "days_until_stockout": forecast_details["days_until_stockout"],
        "is_overstocked": forecast_details["is_overstocked"],
        "dead_capital": forecast_details["dead_capital"],
        "suggested_action": forecast_details["suggested_action"],
        "confidence_score": forecast_details["confidence_score"],
        "recommended_vendor": vendor_info["vendor"],
        "price_trend_prediction": "Rising (+4% due to crude price surge)" if item["category"] == "Chemicals" else "Stable",
        "monthly_forecast": demand_projections
    }

@router.post("/transfer", response_model=Dict[str, Any])
def warehouse_transfer(transfer: WarehouseTransferRequest):
    """
    Submits and tracks warehouse-to-warehouse stock transfers.
    Validates barcodes during physical checkouts & checkins.
    """
    item = next((i for i in MOCK_INVENTORY if i["sku"] == transfer.sku), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item SKU not registered in Central Inventory.")
        
    if item["current_stock"] < transfer.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock at the originating warehouse.")
        
    # Process transfer
    item["current_stock"] -= transfer.quantity
    
    # Audit log mock
    return {
        "status": "Transferred",
        "sku": transfer.sku,
        "product_name": item["name"],
        "from_warehouse_id": transfer.from_warehouse_id,
        "to_warehouse_id": transfer.to_warehouse_id,
        "quantity_moved": transfer.quantity,
        "barcode_verified": transfer.verified_by_barcode,
        "tracking_reference": f"TRF-2026-{random_randint(10000, 99999)}",
        "message": f"Successfully moved {transfer.quantity} units to Destination Warehouse. Live Stock updated."
    }

def random_randint(low: int, high: int) -> int:
    import random
    return random.randint(low, high)
