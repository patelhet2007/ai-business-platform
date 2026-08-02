from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/purchase", tags=["AI Purchase & Supplier Intelligence"])

MOCK_SUPPLIERS = [
    {
        "id": 1,
        "name": "Gujarat Alkalies & Chemicals Ltd",
        "category": "Chemicals",
        "delivery_time_score": 4.8, # out of 5
        "quality_score": 4.9,
        "price_score": 4.1,
        "reliability_score": 4.7,
        "complaint_rate": 0.5, # %
        "overall_rank": 1,
        "gstin": "24AAACG1204R1Z3",
        "location": "Vadodara, Gujarat"
    },
    {
        "id": 2,
        "name": "Deccan Petro-Chemicals Ltd",
        "category": "Chemicals",
        "delivery_time_score": 3.9,
        "quality_score": 4.2,
        "price_score": 4.8, # Highly competitive price
        "reliability_score": 4.0,
        "complaint_rate": 2.2,
        "overall_rank": 2,
        "gstin": "36AAACD5502C1ZC",
        "location": "Hyderabad, Telangana"
    },
    {
        "id": 3,
        "name": "Aurobindo Pharma Ltd",
        "category": "Pharma Raw Materials",
        "delivery_time_score": 4.7,
        "quality_score": 4.9,
        "price_score": 4.3,
        "reliability_score": 4.8,
        "complaint_rate": 0.2,
        "overall_rank": 1,
        "gstin": "36AAPCA2204D1Z9",
        "location": "Visakhapatnam, Andhra Pradesh"
    },
    {
        "id": 4,
        "name": "Vardhman Textiles Group",
        "category": "Textiles",
        "delivery_time_score": 4.6,
        "quality_score": 4.8,
        "price_score": 4.5,
        "reliability_score": 4.7,
        "complaint_rate": 0.8,
        "overall_rank": 1,
        "gstin": "03AAACV9010E1Z1",
        "location": "Ludhiana, Punjab"
    },
    {
        "id": 5,
        "name": "Horizon Packs Pvt Ltd",
        "category": "Packaging",
        "delivery_time_score": 4.9,
        "quality_score": 4.5,
        "price_score": 4.2,
        "reliability_score": 4.8,
        "complaint_rate": 0.4,
        "overall_rank": 1,
        "gstin": "27AAACH2209F1Z0",
        "location": "Pune, Maharashtra"
    }
]

@router.get("/suppliers", response_model=List[Dict[str, Any]])
def get_suppliers(category: str = None):
    """
    Retrieves all ranked suppliers. Supports filtering by product vertical.
    """
    if category:
        filtered = [s for s in MOCK_SUPPLIERS if s["category"].lower() == category.lower()]
        return sorted(filtered, key=lambda x: x["overall_rank"])
    return sorted(MOCK_SUPPLIERS, key=lambda x: x["overall_rank"])

@router.get("/recommend-po/{sku}", response_model=Dict[str, Any])
def recommend_purchase_order(sku: str):
    """
    Combines inventory status, supplier rankings, and commodity prices trends to form
    a smart recommended purchase order.
    """
    # Sample items matching SKUs from inventory
    sku_item_map = {
        "CH-PL-902": {
            "name": "Polyethylene Resin Grade-A",
            "category": "Chemicals",
            "recommended_vendor": "Gujarat Alkalies & Chemicals Ltd",
            "recommended_qty": 450,
            "unit": "MT",
            "price_trend": "Rising (+4% monthly)",
            "estimated_price": 85000.0, # Rs per MT
            "purchase_urgency": "CRITICAL"
        },
        "PH-PA-500": {
            "name": "Paracetamol Active Pharma Ingredient",
            "category": "Pharma Raw Materials",
            "recommended_vendor": "Aurobindo Pharma Ltd",
            "recommended_qty": 350,
            "unit": "KG",
            "price_trend": "Stable",
            "estimated_price": 450.0,
            "purchase_urgency": "MEDIUM"
        },
        "TX-CT-40S": {
            "name": "Combed Cotton Yarn 40s",
            "category": "Textiles",
            "recommended_vendor": "Vardhman Textiles Group",
            "recommended_qty": 800,
            "unit": "Bales",
            "price_trend": "Dropping (-2% cotton harvest peak)",
            "estimated_price": 235.0,
            "purchase_urgency": "LOW"
        }
    }
    
    info = sku_item_map.get(sku, {
        "name": "General Raw Material SKU",
        "category": "General",
        "recommended_vendor": "National Wholesaler India",
        "recommended_qty": 1000,
        "unit": "Units",
        "price_trend": "Stable",
        "estimated_price": 100.0,
        "purchase_urgency": "MEDIUM"
    })
    
    # Calculate recommended purchase date - standard lead time subtracted from stockout
    import datetime
    reorder_date = datetime.date.today() + datetime.timedelta(days=2)
    
    return {
        "sku": sku,
        "product_name": info["name"],
        "category": info["category"],
        "recommended_vendor": info["recommended_vendor"],
        "recommended_qty": info["recommended_qty"],
        "unit": info["unit"],
        "estimated_unit_price": info["estimated_price"],
        "total_estimated_po_value": round(info["recommended_qty"] * info["estimated_price"], 2),
        "price_trend": info["price_trend"],
        "purchase_urgency": info["purchase_urgency"],
        "recommended_purchase_date": reorder_date.strftime("%Y-%m-%d"),
        "ai_rationale": f"Vendor {info['recommended_vendor']} selected due to highest reliability ({next((s['reliability_score'] for s in MOCK_SUPPLIERS if s['name'] == info['recommended_vendor']), 4.5)}/5) and shortest delivery lag. Immediate purchase recommended due to '{info['price_trend']}' trend predictions."
    }
