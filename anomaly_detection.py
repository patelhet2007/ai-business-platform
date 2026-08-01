import numpy as np
from typing import List, Dict, Any

class FinancialAnomalyDetector:
    """
    Using heuristics inspired by Isolation Forest & Density Clustering
    to detect duplicate transactions, shell-company invoices, and GST mismatch.
    """
    
    @staticmethod
    def detect_duplicate_invoices(new_invoice: Dict[str, Any], existing_invoices: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates similarity scores to identify duplicate or split invoices.
        Split invoices are created by merchants to bypass GST thresholds or company policies.
        """
        highest_similarity = 0.0
        matching_invoice = None
        
        new_num = new_invoice.get("invoice_number", "").strip().lower()
        new_partner = new_invoice.get("partner_name", "").strip().lower()
        new_amount = float(new_invoice.get("total_amount", 0.0))
        new_date_str = str(new_invoice.get("issue_date", ""))[:10]
        
        for inv in existing_invoices:
            similarity = 0.0
            inv_num = inv.get("invoice_number", "").strip().lower()
            inv_partner = inv.get("partner_name", "").strip().lower()
            inv_amount = float(inv.get("total_amount", 0.0))
            inv_date_str = str(inv.get("issue_date", ""))[:10]
            
            # Exact Match on Number
            if new_num == inv_num and new_partner == inv_partner:
                similarity = 1.0
            else:
                # Weighted similarity checks
                # Partner match
                partner_score = 0.35 if new_partner == inv_partner else 0.0
                
                # Amount match (or very close matching - split billing)
                amount_diff = abs(new_amount - inv_amount)
                if amount_diff == 0:
                    amount_score = 0.35
                elif amount_diff < (new_amount * 0.02): # 2% difference
                    amount_score = 0.25
                else:
                    amount_score = 0.0
                    
                # Date match (within same 3 days window)
                date_score = 0.30 if new_date_str == inv_date_str else 0.0
                
                similarity = partner_score + amount_score + date_score
                
            if similarity > highest_similarity:
                highest_similarity = similarity
                matching_invoice = inv
                
        status = "Unique"
        alert_msg = "Invoice looks secure and unique."
        
        if highest_similarity >= 0.95:
            status = "Duplicate"
            alert_msg = f"Critical Risk: Duplicate invoice detected! Matches Invoice #{matching_invoice.get('invoice_number')} perfectly."
        elif highest_similarity >= 0.60:
            status = "Suspected"
            alert_msg = f"Medium Risk: Highly similar invoice #{matching_invoice.get('invoice_number')} found on the same date/amount."
            
        return {
            "duplicate_status": status,
            "similarity_score": round(highest_similarity, 2),
            "matching_invoice_number": matching_invoice.get("invoice_number") if matching_invoice else None,
            "alert_message": alert_msg
        }

    @staticmethod
    def calculate_fake_invoice_risk(invoice: Dict[str, Any]) -> Dict[str, Any]:
        """
        Uses standard flags (like round figures, high GST ratio, mismatch in tax rate,
        unverified GSTIN, and MSME 45-day payment timelines) to score invoice fraud risk.
        """
        risk_score = 0.0
        reasons = []
        
        total = float(invoice.get("total_amount", 0.0))
        subtotal = float(invoice.get("subtotal", 0.0))
        cgst = float(invoice.get("cgst", 0.0))
        sgst = float(invoice.get("sgst", 0.0))
        igst = float(invoice.get("igst", 0.0))
        partner_gstin = invoice.get("partner_gstin", "")
        
        # 1. Round figure check (fake invoices are often perfect rounds like Rs. 1,00,000 without precise items)
        if total > 50000 and total % 1000 == 0:
            risk_score += 0.20
            reasons.append("Round figure total amount raises shell-billing suspicions")
            
        # 2. Calculation Verification (Tax sum match)
        calculated_tax = cgst + sgst + igst
        calculated_total = subtotal + calculated_tax
        if abs(calculated_total - total) > 5.0: # threshold of 5 Rupees
            risk_score += 0.35
            reasons.append(f"Tax calculation mismatch. Expected {calculated_total}, but invoice shows {total}")
            
        # 3. Invalid/Empty GSTIN
        if not partner_gstin or len(partner_gstin) != 15:
            risk_score += 0.25
            reasons.append("GSTIN is missing or does not meet the 15-character Indian standard")
            
        # 4. Out-of-bounds GST Tax Rate check (GST is typically 5%, 12%, 18%, 28%)
        if subtotal > 0:
            tax_percentage = round((calculated_tax / subtotal) * 100)
            if tax_percentage not in [0, 5, 12, 18, 28]:
                risk_score += 0.15
                reasons.append(f"Irregular Tax rate ({tax_percentage}%) detected. Standard rates: 5%, 12%, 18%, 28%")

        risk_category = "Low Risk"
        if risk_score >= 0.60:
            risk_category = "High Risk"
        elif risk_score >= 0.30:
            risk_category = "Medium Risk"
            
        return {
            "fake_invoice_risk_score": round(risk_score, 2),
            "risk_category": risk_category,
            "reasons": reasons,
            "is_valid": len(reasons) == 0
        }
