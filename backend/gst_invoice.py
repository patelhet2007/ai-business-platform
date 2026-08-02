import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Dict, Any
from backend.app.ml.ocr import InvoiceOCRPipeline
from backend.app.ml.anomaly_detection import FinancialAnomalyDetector

router = APIRouter(prefix="/gst-invoice", tags=["AI GST & Invoice Intelligence"])

# In-memory database tracking processed invoices
MOCK_INVOICES = [
    {
        "id": 1,
        "invoice_number": "INV/2026/0401",
        "invoice_type": "Purchase",
        "partner_name": "Balaji Polymers & Chemicals Ltd",
        "partner_gstin": "24AAACB1209C1Z9",
        "partner_type": "MSME (Micro)",
        "issue_date": "2026-07-10",
        "due_date": "2026-08-24", # Exactly 45 days limit
        "subtotal": 100000.0,
        "cgst": 9000.0,
        "sgst": 9000.0,
        "igst": 0.0,
        "total_amount": 118000.0,
        "status": "Unpaid",
        "is_verified": True,
        "duplicate_status": "Unique",
        "fake_invoice_risk_score": 0.05,
        "wrong_hsn_detected": False,
        "wrong_tax_detected": False,
        "msme_45day_alert": True,
        "days_outstanding": 22
    },
    {
        "id": 2,
        "invoice_number": "TX-PO-1049",
        "invoice_type": "Purchase",
        "partner_name": "Vardhman Textiles Group",
        "partner_gstin": "03AAACV9010E1Z1",
        "partner_type": "Regular",
        "issue_date": "2026-06-15",
        "due_date": "2026-07-30",
        "subtotal": 240000.0,
        "cgst": 12000.0,
        "sgst": 12000.0,
        "igst": 0.0,
        "total_amount": 264000.0,
        "status": "Overdue",
        "is_verified": True,
        "duplicate_status": "Unique",
        "fake_invoice_risk_score": 0.12,
        "wrong_hsn_detected": False,
        "wrong_tax_detected": False,
        "msme_45day_alert": False,
        "days_outstanding": 47
    },
    {
        "id": 3,
        "invoice_number": "AID-5591-SPLIT",
        "invoice_type": "Purchase",
        "partner_name": "Acme Industrial Distributors Ltd",
        "partner_gstin": "27AAPCS1023D1Z4",
        "partner_type": "Regular",
        "issue_date": "2026-07-28",
        "due_date": "2026-09-10",
        "subtotal": 84745.0,
        "cgst": 7627.0,
        "sgst": 7627.0,
        "igst": 0.0,
        "total_amount": 99999.0,
        "status": "Unpaid",
        "is_verified": False,
        "duplicate_status": "Suspected", # Flagged by FinancialAnomalyDetector
        "fake_invoice_risk_score": 0.65, # High risk due to round total + suspect gstin
        "wrong_hsn_detected": True,
        "wrong_tax_detected": True,
        "msme_45day_alert": False,
        "days_outstanding": 4
    }
]

@router.get("/all", response_model=List[Dict[str, Any]])
def get_all_invoices(invoice_type: str = None):
    """
    Returns all processed purchase and sales invoices.
    """
    if invoice_type:
        return [i for i in MOCK_INVOICES if i["invoice_type"].lower() == invoice_type.lower()]
    return MOCK_INVOICES

@router.post("/upload", response_model=Dict[str, Any])
def upload_invoice_ocr(filename: str = "acme_invoice.pdf"):
    """
    Executes AI Invoice Intelligence workflow:
    1. Runs high-fidelity OCR extractor (Tesseract/PaddleOCR approximation).
    2. Runs Duplicate check using FinancialAnomalyDetector.
    3. Runs Shell/Fake invoice risk assessment.
    4. Evaluates GST computation compliance & MSME rules.
    """
    # 1. OCR Extraction
    ocr_result = InvoiceOCRPipeline.process_file_ocr(filename)
    
    # 2. Duplicate Detection
    duplicate_results = FinancialAnomalyDetector.detect_duplicate_invoices(
        ocr_result, MOCK_INVOICES
    )
    
    # 3. Fake Invoice & Computation check
    risk_results = FinancialAnomalyDetector.calculate_fake_invoice_risk(ocr_result)
    
    # 4. Check for state-interstate tax compliance (CGST + SGST vs IGST based on GSTIN codes)
    # GSTIN starts with a 2 digit state code. E.g. '24' is Gujarat, '27' Maharashtra.
    company_state_code = "24" # Assuming client company is located in Gujarat
    partner_state_code = ocr_result["partner_gstin"][:2]
    
    expected_tax_type = "IGST" if company_state_code != partner_state_code else "CGST+SGST"
    wrong_tax_detected = False
    
    if expected_tax_type == "IGST" and ocr_result["cgst"] > 0:
        wrong_tax_detected = True
    elif expected_tax_type == "CGST+SGST" and ocr_result["igst"] > 0:
        wrong_tax_detected = True
        
    # MSME classification logic (mocking based on company names)
    partner_type = "Regular"
    msme_45day_alert = False
    if "polymers" in ocr_result["partner_name"].lower() or "micro" in filename.lower():
        partner_type = "MSME (Micro)"
        msme_45day_alert = True
        
    final_analysis = {
        "id": len(MOCK_INVOICES) + 1,
        "invoice_number": ocr_result["invoice_number"],
        "invoice_type": "Purchase",
        "partner_name": ocr_result["partner_name"],
        "partner_gstin": ocr_result["partner_gstin"],
        "partner_type": partner_type,
        "issue_date": str(datetime.date.today() - datetime.timedelta(days=2)),
        "due_date": str(datetime.date.today() + datetime.timedelta(days=43)) if msme_45day_alert else str(datetime.date.today() + datetime.timedelta(days=30)),
        "subtotal": ocr_result["subtotal"],
        "cgst": ocr_result["cgst"],
        "sgst": ocr_result["sgst"],
        "igst": ocr_result["igst"],
        "total_amount": ocr_result["total_amount"],
        "status": "Unpaid",
        "is_verified": not wrong_tax_detected and risk_results["fake_invoice_risk_score"] < 0.40,
        "duplicate_status": duplicate_results["duplicate_status"],
        "similarity_score": duplicate_results["similarity_score"],
        "fake_invoice_risk_score": risk_results["fake_invoice_risk_score"],
        "risk_category": risk_results["risk_category"],
        "wrong_hsn_detected": len(ocr_result["hsn_code"]) < 4 or ocr_result["hsn_code"] == "0000",
        "wrong_tax_detected": wrong_tax_detected,
        "msme_45day_alert": msme_45day_alert,
        "reasons": risk_results["reasons"] + ([f"Tax category mismatch. Expected {expected_tax_type}"] if wrong_tax_detected else []),
        "days_outstanding": 2
    }
    
    # Save to mock DB
    MOCK_INVOICES.append(final_analysis)
    return final_analysis

@router.get("/msme-tracker", response_model=List[Dict[str, Any]])
def get_msme_compliance_status():
    """
    Returns purchase invoices subjected to Section 43B(h) of the Income Tax Act (MSME 45-day payment rule).
    Highlights payment deadlines and potential interest liabilities if delayed.
    """
    msme_invoices = [i for i in MOCK_INVOICES if "MSME" in i["partner_type"]]
    results = []
    
    for inv in msme_invoices:
        days_left = 45 - inv["days_outstanding"]
        status = "Safe"
        if days_left < 0:
            status = "Non-Compliant (Compound Interest Accruing)"
        elif days_left <= 7:
            status = "Action Required (Critical)"
        elif days_left <= 15:
            status = "Warning"
            
        # Standard RBI compound interest on default is 3x Bank Rate. Under MSME Act, it's roughly 15-20% per annum
        interest_liab = 0.0
        if days_left < 0:
            delay_days = abs(days_left)
            interest_liab = round((inv["total_amount"] * 0.18 / 365) * delay_days, 2)
            
        results.append({
            "invoice_number": inv["invoice_number"],
            "vendor_name": inv["partner_name"],
            "total_amount": inv["total_amount"],
            "days_outstanding": inv["days_outstanding"],
            "days_remaining_for_payment": max(0, days_left) if days_left >= 0 else 0,
            "interest_accrued_liability_inr": interest_liab,
            "compliance_status": status,
            "rbi_msme_rule": "Under MSME Development Act Section 15 & Section 16, delay beyond 45 days mandates 3x RBI bank rate interest and disallowance of tax expense deduction."
        })
    return results

@router.post("/verify-gstin", response_model=Dict[str, Any])
def verify_gstin(gstin: str):
    """
    Simulates direct real-time validation via GST portal API wrapper.
    Returns business registrations metadata and validation status.
    """
    gst_clean = gstin.strip().upper()
    gstin_regex = r"\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}"
    
    import re
    if not re.match(gstin_regex, gst_clean):
        return {
            "valid": False,
            "gstin": gstin,
            "message": "Invalid GSTIN format structure.",
            "metadata": {}
        }
        
    state_codes = {
        "24": "Gujarat",
        "27": "Maharashtra",
        "36": "Telangana",
        "03": "Punjab",
        "09": "Uttar Pradesh",
        "19": "West Bengal",
        "33": "Tamil Nadu"
    }
    
    state_code = gst_clean[:2]
    pan = gst_clean[2:12]
    
    return {
        "valid": True,
        "gstin": gst_clean,
        "message": "GSTIN verified successfully.",
        "metadata": {
            "legal_name": "Balaji Specialty Polymers Pvt Ltd" if state_code == "24" else "Standard Enterprise India",
            "trade_name": "Balaji Polymers",
            "state_jurisdiction": state_codes.get(state_code, "Other Indian State"),
            "taxpayer_type": "Regular Regular Taxpayer",
            "pan_number": pan,
            "filing_frequency": "Monthly GSTR-1 & GSTR-3B",
            "last_gstr1_filed": "June 2026",
            "status_active": True
        }
    }
