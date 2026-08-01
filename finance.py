from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/finance", tags=["AI CFO & Payment Intelligence"])

# Mock database for credit risk
MOCK_CUSTOMERS = [
    {
        "id": 1,
        "name": "Reliable Distripress India Pvt Ltd",
        "credit_score": 810, # Excellent
        "payment_behavior": "Excellent (Pay in ~14 days)",
        "outstanding_amount": 125000.0,
        "returns_rate": 0.8, # %
        "purchase_frequency_days": 10,
        "late_payment_risk": 0.05
    },
    {
        "id": 2,
        "name": "Mahalaxmi Wholesalers & Retailers",
        "credit_score": 680, # Average
        "payment_behavior": "Average (Pay in ~38 days)",
        "outstanding_amount": 450000.0,
        "returns_rate": 3.4,
        "purchase_frequency_days": 20,
        "late_payment_risk": 0.28
    },
    {
        "id": 3,
        "name": "Apex Pharma Logistics & Distributors",
        "credit_score": 790, # Excellent
        "payment_behavior": "Excellent (Pay in ~18 days)",
        "outstanding_amount": 80000.0,
        "returns_rate": 1.1,
        "purchase_frequency_days": 12,
        "late_payment_risk": 0.08
    },
    {
        "id": 4,
        "name": "Chirag General Store Retail chain",
        "credit_score": 540, # High Risk
        "payment_behavior": "Poor (Frequent defaults, pays in ~65 days)",
        "outstanding_amount": 620000.0,
        "returns_rate": 7.2,
        "purchase_frequency_days": 45,
        "late_payment_risk": 0.74
    }
]

@router.get("/customer-intelligence", response_model=List[Dict[str, Any]])
def get_customers_credit_risk():
    """
    Ranks customers by Credit Score, Payment Behavior, Outstanding amount,
    and calculates AI-predicted Late Payment Risk indices.
    """
    return sorted(MOCK_CUSTOMERS, key=lambda x: x["late_payment_risk"], reverse=True)

@router.get("/cash-flow-prediction", response_model=Dict[str, Any])
def predict_cash_flow_and_leakage():
    """
    Simulates forecasting working capital, expected cash inflows, cash outflows,
    and alerts on hidden profit leakage (e.g. freight, storage fees, over-payment of interest).
    """
    # Predictive modeling (LSTM/XGBoost Mock)
    expected_inflow_august = 2450000.00
    expected_outflow_august = 1820000.00
    
    # Simulate a sudden customer default pattern
    high_risk_outstanding = sum(c["outstanding_amount"] for c in MOCK_CUSTOMERS if c["late_payment_risk"] > 0.50)
    adjusted_inflow = expected_inflow_august - (high_risk_outstanding * 0.40) # 40% probability of default or delay
    
    net_working_capital = 1200000.0
    
    # Profit Leakage Indicators
    leakages = [
        {
            "category": "Freight Excess Cost",
            "amount_leakage": 42000.0,
            "cause": "Overnight expedited cargo used due to Baddi warehouse stockouts",
            "remedy": "Sync AI purchase recommendation trigger with Baddi's lead time."
        },
        {
            "category": "Dead Stock Capital Drag",
            "amount_leakage": 12000.0,
            "cause": "Excess Polymer resin stored in Hazira factory past 120 days",
            "remedy": "Bundle resin with slower products at 15% discount."
        },
        {
            "category": "MSME Interest Liabilities",
            "amount_leakage": 8500.0,
            "cause": "Delayed payout of BP-902 invoice past 45 days limit",
            "remedy": "Auto-schedule MSME invoices through payment gateway integration."
        }
    ]
    
    return {
        "monthly_forecast_period": "August 2026",
        "predicted_gross_inflow": expected_inflow_august,
        "risk_adjusted_inflow": round(adjusted_inflow, 2),
        "predicted_gross_outflow": expected_outflow_august,
        "net_predicted_cashflow": round(adjusted_inflow - expected_outflow_august, 2),
        "net_working_capital": net_working_capital,
        "profit_leakage_total": sum(l["amount_leakage"] for l in leakages),
        "profit_leakage_details": leakages,
        "cash_flow_safety_status": "Healthy" if (adjusted_inflow - expected_outflow_august) > 200000 else "Tight Working Capital"
    }

@router.get("/business-health-score", response_model=Dict[str, Any])
def get_comprehensive_health_scores():
    """
    Calculates overall business performance index by analyzing different modules.
    Acts as a dashboard control tower score.
    """
    inventory_score = 78 # Out of 100 (reduced due to some overstock and stock-out risks)
    finance_score = 84   # Good margins but some late paying customers
    gst_score = 92       # Mostly compliant, minor wrong taxes detected
    supplier_score = 89  # High reliability suppliers on contract
    customer_score = 71  # Dragged down by poor payment behavior from retailers
    
    overall_score = round(
        (inventory_score * 0.25) + 
        (finance_score * 0.30) + 
        (gst_score * 0.15) + 
        (supplier_score * 0.15) + 
        (customer_score * 0.15)
    )
    
    status_label = "Optimal" if overall_score >= 85 else "Stable" if overall_score >= 70 else "Needs Attention"
    
    return {
        "overall_health_score": overall_score,
        "health_category": status_label,
        "breakdown": {
            "inventory_health_score": inventory_score,
            "finance_health_score": finance_score,
            "gst_compliance_score": gst_score,
            "supplier_reliability_score": supplier_score,
            "customer_payment_score": customer_score
        },
        "critical_alerts": [
            "Customer 'Chirag General Store' late payment risk exceeds 70%. Freeze credit limit immediately.",
            "Stockout of SKU 'CH-PL-902' expected in 13 days at Hazira factory.",
            "Rs. 62,500 in potential capital locked in overstocked formulations at Baddi."
        ]
    }
