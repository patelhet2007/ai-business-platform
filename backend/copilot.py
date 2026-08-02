from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.schemas import ChatRequest

router = APIRouter(prefix="/copilot", tags=["AI CFO & Voice Copilot"])

# Core Knowledge base of AI CFO
CHAT_ANSWERS = {
    "how much stock should i buy": (
        "Based on our demand forecasting models, you should purchase 450 MT of Polyethylene Resin Grade-A "
        "and 350 KG of Paracetamol API. Your safety stock limits are currently under-provisioned due to upcoming "
        "festive seasons (Diwali/Navratri) which typically experience a 35% surge in domestic logistics transit time."
    ),
    "which customer pays late": (
        "Chirag General Store is currently flagged as High Risk (Risk Score: 74%). Their average payment duration "
        "is 65 days, which violates your standard 30-day term. They currently have Rs. 6,20,000 outstanding. "
        "I suggest pausing active shipments and freezing their credit ceiling."
    ),
    "which supplier is best": (
        "Gujarat Alkalies & Chemicals Ltd is ranked #1 in your Supplier Directory (Overall score: 4.8/5). "
        "They maintain a 98% on-time delivery record and have the lowest complaint rate (0.5%). Deccan Petro-Chemicals "
        "is cheaper by 4%, but has a much higher delivery lag (+5 days)."
    ),
    "expected profit next month": (
        "Your projected net profit for August 2026 is Rs. 6,30,000, with gross cash inflows of Rs. 24.5 Lakhs "
        "and outflows of Rs. 18.2 Lakhs. Note that your profit is currently leaking Rs. 62,500 due to overstocked "
        "paracetamol active pharma ingredients at the Baddi warehouse."
    ),
    "which products are dead stock": (
        "Your primary dead stock is 'Double Wall Corrugated Cartons' at the Bhiwandi Hub (4200 units, exceeding 120 days demand) "
        "and 'Paracetamol Active Pharma Ingredient' at Baddi (280 kg). Total blocked working capital is Rs. 1,22,500."
    )
}

@router.post("/chat", response_model=Dict[str, Any])
def cfo_chat_bot(request: ChatRequest):
    """
    AI CFO Copilot natural language responder. Interprets questions regarding stocks, late payers,
    supplier ranks, future cash flow, and matches queries using NLP keyword-closeness scoring.
    """
    query_lower = request.query.lower().strip()
    
    # Simple semantic similarity matcher
    matched_response = None
    for pattern in CHAT_ANSWERS:
        if pattern in query_lower or any(word in query_lower for word in pattern.split()):
            matched_response = CHAT_ANSWERS[pattern]
            break
            
    if not matched_response:
        matched_response = (
            "I've analyzed your financial ledger. Your overall business health score is 81/100, which is stable. "
            "Your main concern is cash flow constraints due to Rs. 10.7 Lakhs in aggregate accounts outstanding, "
            "with Chirag General Store accounting for the largest share. Let me know if you would like me to list "
            "the top purchase order recommendations for this week."
        )
        
    # Audio response mapping
    audio_file_url = None
    if request.voice_enabled:
        if request.language.lower() == "hindi":
            audio_file_url = "/audio/stock_tip_hi.mp3"
        else:
            audio_file_url = "/audio/stock_tip_en.mp3"
            
    return {
        "query": request.query,
        "response": matched_response,
        "language": request.language,
        "audio_url": audio_file_url,
        "status": "Success",
        "cfo_insights_metadata": {
            "critical_warning_flag": "Chirag General Store default risk" in matched_response or "Chirag" in query_lower,
            "actions_triggered": ["Block Credit Limit"] if "Chirag" in query_lower else []
        }
    }
