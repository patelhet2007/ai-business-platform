from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.schemas import ContainerOptimizeRequest, ExportProfitCalculatorRequest
from backend.app.ml.optimizer import ContainerOptimizer

router = APIRouter(prefix="/import-export", tags=["Import-Export & Shipping Intelligence"])

# HS Code Database
HS_CODE_DIRECTORY = {
    "polyethylene resin": {
        "hs_code": "3901.10.10",
        "gst_rate_percent": 18,
        "import_duty_percent": 7.5,
        "export_duty_percent": 0.0,
        "required_certificates": ["BIS Indian Standards Certification", "Phytosanitary Certificate", "FSSAI (if food contact)"],
        "restricted_status": "Free",
        "labeling_requirements": "Hazardous chemicals labeling standards under IS 14489 apply. Must print batch no, manufacturing date, and net weight."
    },
    "paracetamol api": {
        "hs_code": "2922.11.90",
        "gst_rate_percent": 12,
        "import_duty_percent": 10.0,
        "export_duty_percent": 0.0,
        "required_certificates": ["CDSCO Drug Import License", "COA (Certificate of Analysis)", "WHO-GMP Clearance"],
        "restricted_status": "Restricted (Requires special DGFT Export/Import License)",
        "labeling_requirements": "Pharma regulations apply. Clear storage temperature (below 25C) and Drug schedule warning must be visible."
    },
    "cotton yarn": {
        "hs_code": "5205.24.00",
        "gst_rate_percent": 5,
        "import_duty_percent": 5.0,
        "export_duty_percent": 0.0,
        "required_certificates": ["Textiles Committee Inspection Report", "Certificate of Origin (EUR-1 or SAFTA)"],
        "restricted_status": "Free",
        "labeling_requirements": "Blend composition percentages (e.g. 100% Combed Cotton), counts, and ply must be marked on each bale."
    }
}

@router.get("/hs-lookup", response_model=Dict[str, Any])
def lookup_hs_code_intelligence(product_name: str):
    """
    Inputs a product query and resolves HSN, tax rate, import-export duty,
    restricted status, label guidelines, and compliance certifications.
    """
    query = product_name.lower().strip()
    
    # Simple keyword search
    matched_key = None
    for key in HS_CODE_DIRECTORY:
        if key in query or query in key:
            matched_key = key
            break
            
    if not matched_key:
        # Fallback general match
        return {
            "resolved": False,
            "product_name": product_name,
            "hs_code": "8471.30.10",
            "gst_rate_percent": 18,
            "import_duty_percent": 7.5,
            "export_duty_percent": 0.0,
            "required_certificates": ["E-Waste Registration", "BIS Standard Certification"],
            "restricted_status": "Free",
            "labeling_requirements": "Must carry standard CE and BIS markings on outer box.",
            "message": "Product name did not match database perfectly. Displaying fallback tech cargo HSN (8471)."
        }
        
    return {
        "resolved": True,
        "product_name": product_name,
        **HS_CODE_DIRECTORY[matched_key]
    }

@router.post("/container-optimize", response_model=Dict[str, Any])
def optimize_container_packing(request: ContainerOptimizeRequest):
    """
    Triggers the 3D packing optimizer. Feeds cartons array into the 
    container spec matrix to calculate utilization percentages and layout suggestions.
    """
    items_dict = [item.dict() for item in request.items]
    result = ContainerOptimizer.optimize_packing(items_dict, request.target_container)
    return result

@router.get("/shipping-compare", response_model=Dict[str, Any])
def compare_shipping_modes(origin: str, destination: str, weight_kg: float, volume_cbm: float):
    """
    Evaluates shipping models (Air, Sea, Courier) based on rates,
    delivery times, duties, and flags the optimal ROI channel.
    """
    # Simple dynamic rating heuristics
    # Air freight: ~$4.50 per kg or volumetric equivalent
    # Ocean freight: ~$120 per CBM
    # Courier: ~$8.50 per kg
    
    volumetric_weight = volume_cbm * 167 # Standard air conversion factor
    chargeable_air_weight = max(weight_kg, volumetric_weight)
    
    air_cost = round(chargeable_air_weight * 380, 2) # In INR (~$4.5/kg)
    air_time = "3 - 5 Days"
    
    courier_cost = round(weight_kg * 650, 2) # In INR (~$8.0/kg)
    courier_time = "2 - 4 Days"
    
    # Sea freight min charge is usually 1 CBM
    sea_cbm_chargeable = max(1.0, volume_cbm)
    sea_cost = round(sea_cbm_chargeable * 15000, 2) # In INR (~$180/CBM)
    sea_time = "25 - 35 Days"
    
    # Recommendations
    best_value = "Sea Freight"
    cheapest = "Sea Freight"
    fastest = "Courier"
    
    if weight_kg < 150:
        best_value = "Air Freight"
        cheapest = "Air Freight"
    if weight_kg < 30:
        cheapest = "Courier"
        best_value = "Courier"
        
    return {
        "origin": origin,
        "destination": destination,
        "chargeable_weight_kg": weight_kg,
        "volume_cbm": volume_cbm,
        "channels": [
            {
                "channel_name": "Ocean Cargo Carrier",
                "transit_time": sea_time,
                "freight_cost_inr": sea_cost,
                "compliance_effort": "High (Customs clearance, BL, COO, Packing List)",
                "status": "Cheapest" if cheapest == "Sea Freight" else "Standard"
            },
            {
                "channel_name": "International Air Cargo",
                "transit_time": air_time,
                "freight_cost_inr": air_cost,
                "compliance_effort": "Medium (Air Way Bill, Customs clearance)",
                "status": "Best Value" if best_value == "Air Freight" else "Fast"
            },
            {
                "channel_name": "Express Courier (DHL/FedEx)",
                "transit_time": courier_time,
                "freight_cost_inr": courier_cost,
                "compliance_effort": "Low (Door-to-door clearance handled)",
                "status": "Fastest" if fastest == "Courier" else "Premium"
            }
        ],
        "recommendation": f"For {weight_kg} kg weight and {volume_cbm} CBM volume, we recommend choosing {best_value} to ship from {origin} to {destination}."
    }

@router.post("/profit-calculator", response_model=Dict[str, Any])
def export_profit_calculator(request: ExportProfitCalculatorRequest):
    """
    Computes final product margins for global deals:
    Subtracts manufacturing, packing, logistics, duties, and adds Indian Government Incentives
    (Duty Drawback + RoDTEP) to verify true ROI.
    """
    # 1. Base Costs
    fob_val = request.fob_value
    freight = request.ocean_freight_usd * 83.5 # Convert to INR
    insurance = request.insurance_premium_inr
    packaging = request.packaging_cost_inr
    customs = request.customs_handling_inr
    
    total_logistics_cost = freight + insurance + packaging + customs
    
    # 2. Government Export Incentives (Duty Drawback / RoDTEP)
    # Exporters receive percentage refunds on custom duties paid on raw materials
    duty_drawback = fob_val * (request.duty_drawback_rate_percent / 100)
    
    # 3. Calculation
    cogs_estimate = fob_val * 0.55 # Assuming raw manufacturing cost is 55% of FOB
    total_cost = cogs_estimate + total_logistics_cost - duty_drawback
    
    profit = fob_val - total_cost
    margin = (profit / fob_val) * 100
    
    break_even_units = round(total_logistics_cost / (fob_val * 0.45)) # units needed to cover logistics setup
    
    return {
        "currency": "INR",
        "fob_value": fob_val,
        "cogs_estimate": round(cogs_estimate, 2),
        "total_logistics_cost": round(total_logistics_cost, 2),
        "government_drawback_incentive": round(duty_drawback, 2),
        "net_export_cost": round(total_cost, 2),
        "estimated_net_profit": round(profit, 2),
        "net_margin_percent": round(margin, 2),
        "break_even_volume_units": break_even_units,
        "cfo_strategic_tip": "High margin deal. Leverage Duty Drawback scheme actively by filling shipping bill form DBK-01 during port customs processing." if margin > 20 else "Low margin. Try shifting logistics freight carrier from Air to Sea or renegotiating packaging carton costs."
    }
