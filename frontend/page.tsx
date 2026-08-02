"use html"
"use client";

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  FileSpreadsheet,
  Cpu,
  Globe,
  DollarSign,
  UserCheck,
  Search,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  Plus,
  RefreshCw,
  Send,
  Volume2,
  Settings,
  Truck,
  Layers,
  Sparkles,
  Info,
  Calendar,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Percent,
  Calculator,
  UserX,
  Languages,
  Activity
} from 'lucide-react';

// Responsive Mock Data matching our Backend Contracts perfectly
const INITIAL_INVENTORY = [
  { id: 1, sku: "CH-PL-902", name: "Polyethylene Resin Grade-A", category: "Chemicals", current_stock: 12.0, safety_stock: 25.0, reorder_point: 35.0, lead_time_days: 15, cost_price: 85.0, selling_price: 120.0, barcode: "8901234005112", warehouse_name: "Hazira Factory", hsn_code: "39011010", recent_sales_30d: 45.0, status: "Stock-out Risk", stock_value: 1020.0 },
  { id: 2, sku: "PH-PA-500", name: "Paracetamol Active Ingredient", category: "Pharma", current_stock: 280.0, safety_stock: 50.0, reorder_point: 100.0, lead_time_days: 5, cost_price: 450.0, selling_price: 620.0, barcode: "8902234002441", warehouse_name: "Baddi Formulations", hsn_code: "29221190", recent_sales_30d: 620.0, status: "Healthy", stock_value: 126000.0 },
  { id: 3, sku: "TX-CT-40S", name: "Combed Cotton Yarn 40s", category: "Textiles", current_stock: 1500.0, safety_stock: 200.0, reorder_point: 400.0, lead_time_days: 10, cost_price: 240.0, selling_price: 310.0, barcode: "8903321003552", warehouse_name: "Coimbatore Spinning", hsn_code: "52052400", recent_sales_30d: 180.0, status: "Overstocked", stock_value: 360000.0 },
  { id: 4, sku: "PKG-BX-DF", name: "Double Wall Corrugated Cartons", category: "Packaging", current_stock: 4200.0, safety_stock: 500.0, reorder_point: 800.0, lead_time_days: 3, cost_price: 15.0, selling_price: 22.0, barcode: "8905221008891", warehouse_name: "Bhiwandi Hub", hsn_code: "48191000", recent_sales_30d: 950.0, status: "Overstocked", stock_value: 63000.0 },
  { id: 5, sku: "FMCG-PO-1L", name: "Refined Sunflower Oil 1L", category: "FMCG", current_stock: 50.0, safety_stock: 300.0, reorder_point: 600.0, lead_time_days: 4, cost_price: 115.0, selling_price: 135.0, barcode: "8901023001223", warehouse_name: "Kandla Port", hsn_code: "15121910", recent_sales_30d: 1200.0, status: "Stock-out Risk", stock_value: 5750.0 }
];

const INITIAL_SUPPLIERS = [
  { id: 1, name: "Gujarat Alkalies & Chemicals Ltd", category: "Chemicals", delivery_time_score: 4.8, quality_score: 4.9, price_score: 4.1, reliability_score: 4.7, complaint_rate: 0.5, overall_rank: 1, gstin: "24AAACG1204R1Z3", location: "Vadodara, Gujarat" },
  { id: 2, name: "Deccan Petro-Chemicals Ltd", category: "Chemicals", delivery_time_score: 3.9, quality_score: 4.2, price_score: 4.8, reliability_score: 4.0, complaint_rate: 2.2, overall_rank: 2, gstin: "36AAACD5502C1ZC", location: "Hyderabad, Telangana" },
  { id: 3, name: "Aurobindo Pharma Ltd", category: "Pharma", delivery_time_score: 4.7, quality_score: 4.9, price_score: 4.3, reliability_score: 4.8, complaint_rate: 0.2, overall_rank: 1, gstin: "36AAPCA2204D1Z9", location: "Visakhapatnam, AP" },
  { id: 4, name: "Vardhman Textiles Group", category: "Textiles", delivery_time_score: 4.6, quality_score: 4.8, price_score: 4.5, reliability_score: 4.7, complaint_rate: 0.8, overall_rank: 1, gstin: "03AAACV9010E1Z1", location: "Ludhiana, Punjab" },
  { id: 5, name: "Horizon Packs Pvt Ltd", category: "Packaging", delivery_time_score: 4.9, quality_score: 4.5, price_score: 4.2, reliability_score: 4.8, complaint_rate: 0.4, overall_rank: 1, gstin: "27AAACH2209F1Z0", location: "Pune, Maharashtra" }
];

const INITIAL_CUSTOMERS = [
  { id: 1, name: "Reliable Distripress India Pvt Ltd", credit_score: 810, payment_behavior: "Excellent (Pay in ~14 days)", outstanding_amount: 125000, returns_rate: 0.8, purchase_frequency_days: 10, late_payment_risk: 0.05 },
  { id: 2, name: "Mahalaxmi Wholesalers & Retailers", credit_score: 680, payment_behavior: "Average (Pay in ~38 days)", outstanding_amount: 450000, returns_rate: 3.4, purchase_frequency_days: 20, late_payment_risk: 0.28 },
  { id: 3, name: "Apex Pharma Logistics & Distributors", credit_score: 790, payment_behavior: "Excellent (Pay in ~18 days)", outstanding_amount: 80000, returns_rate: 1.1, purchase_frequency_days: 12, late_payment_risk: 0.08 },
  { id: 4, name: "Chirag General Store Retail chain", credit_score: 540, payment_behavior: "Poor (Delayed, pays in ~65 days)", outstanding_amount: 620000, returns_rate: 7.2, purchase_frequency_days: 45, late_payment_risk: 0.74 }
];

const INITIAL_INVOICES = [
  { id: 1, invoice_number: "INV/2026/0401", partner_name: "Balaji Polymers & Chemicals", partner_gstin: "24AAACB1209C1Z9", partner_type: "MSME (Micro)", total_amount: 118000, status: "Unpaid", is_verified: true, duplicate_status: "Unique", fake_invoice_risk_score: 0.05, wrong_hsn_detected: false, wrong_tax_detected: false, msme_45day_alert: true, days_outstanding: 22, issue_date: "2026-07-10", due_date: "2026-08-24" },
  { id: 2, invoice_number: "TX-PO-1049", partner_name: "Vardhman Textiles Group", partner_gstin: "03AAACV9010E1Z1", partner_type: "Regular", total_amount: 264000, status: "Overdue", is_verified: true, duplicate_status: "Unique", fake_invoice_risk_score: 0.12, wrong_hsn_detected: false, wrong_tax_detected: false, msme_45day_alert: false, days_outstanding: 47, issue_date: "2026-06-15", due_date: "2026-07-30" },
  { id: 3, invoice_number: "AID-5591-SPLIT", partner_name: "Acme Industrial Distributors Ltd", partner_gstin: "27AAPCS1023D1Z4", partner_type: "Regular", total_amount: 99999, status: "Unpaid", is_verified: false, duplicate_status: "Suspected", fake_invoice_risk_score: 0.65, wrong_hsn_detected: true, wrong_tax_detected: true, msme_45day_alert: false, days_outstanding: 4, issue_date: "2026-07-28", due_date: "2026-09-10" }
];

export default function AIDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States for Modules
  const [inventoryList, setInventoryList] = useState(INITIAL_INVENTORY);
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedInventoryItem, setSelectedInventoryId] = useState(1);
  const [aiPredictionData, setAiPredictionData] = useState<any>(null);
  const [predictLoading, setPredictLoading] = useState(false);

  // States for Purchase
  const [supplierList, setSupplierList] = useState(INITIAL_SUPPLIERS);
  const [selectedSkuPo, setSelectedSkuPo] = useState('CH-PL-902');
  const [poRecommendation, setPoRecommendation] = useState<any>(null);
  const [poLoading, setPoLoading] = useState(false);

  // States for Invoices & OCR
  const [invoiceList, setInvoiceList] = useState(INITIAL_INVOICES);
  const [selectedOcrMockFile, setSelectedOcrMockFile] = useState('balaji_polymers.pdf');
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [gstinVerify, setGstinVerify] = useState('');
  const [gstinResult, setGstinResult] = useState<any>(null);

  // States for Finance
  const [customerList, setCustomerList] = useState(INITIAL_CUSTOMERS);
  const [cashflowForecast, setCashflowForecast] = useState<any>(null);
  const [leakageTotal, setLeakageTotal] = useState(0);

  // States for Copilot
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { role: 'cfo', text: "Hello! I am your AI CFO. I continuously audit your logistics, cash flow, and inventory across your 5 Indian factories and warehouses. What would you like to solve today?", time: "12:00 PM" }
  ]);
  const [voiceLang, setVoiceLang] = useState('English');
  const [chatLoading, setChatLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // States for Import Export
  const [hsCodeInput, setHsCodeInput] = useState('polyethylene resin');
  const [hsResult, setHsResult] = useState<any>(null);
  const [containerSpec, setContainerSpec] = useState('20FT');
  const [containerItems, setContainerItems] = useState([
    { name: "Polyethylene Sacks", carton_qty: 120, carton_length_m: 0.5, carton_width_m: 0.4, carton_height_m: 0.3, carton_weight_kg: 25 },
    { name: "Yarn Bales", carton_qty: 40, carton_length_m: 0.8, carton_width_m: 0.6, carton_height_m: 0.5, carton_weight_kg: 50 }
  ]);
  const [containerOptimization, setContainerOptimization] = useState<any>(null);
  const [shippingOrigin, setOrigin] = useState('Nhava Sheva Port, Mumbai');
  const [shippingDestination, setDestination] = useState('Port of Felixstowe, UK');
  const [shippingCompareResult, setShippingCompareResult] = useState<any>(null);

  // Export profit calculator
  const [exportSku, setExportSku] = useState('CH-PL-902');
  const [fobInr, setFobInr] = useState(850000);
  const [oceanFreightUsd, setOceanFreightUsd] = useState(2400);
  const [packagingInr, setPackagingInr] = useState(45000);
  const [customsInr, setCustomsInr] = useState(30000);
  const [exportProfitResult, setExportProfitResult] = useState<any>(null);

  // Load calculations automatically on mounting
  useEffect(() => {
    fetchPrediction(1);
    fetchPoRecommendation('CH-PL-902');
    fetchCashFlow();
    runContainerOptimization();
    runExportProfitCalculator();
  }, []);

  // API Call simulation: AI Inventory Dynamics
  const fetchPrediction = async (id: number) => {
    setPredictLoading(true);
    // Simulate FastAPI backend prediction endpoint
    setTimeout(() => {
      const item = inventoryList.find(i => i.id === id) || inventoryList[0];
      
      // Calculate forecasting metrics dynamically
      const velocity = item.recent_sales_30d / 30.0;
      const daysLeft = Math.max(0, Math.round(item.current_stock / velocity));
      const r_qty = Math.round(Math.max(250, velocity * 45));
      const dead_cap = item.current_stock > (velocity * 60) ? Math.round((item.current_stock - velocity * 60) * item.cost_price) : 0;
      
      const months = ["August 2026", "September 2026", "October 2026", "November 2026", "December 2026", "January 2027"];
      const factor = item.category === "Chemicals" ? 1.3 : 1.0;
      
      setAiPredictionData({
        sku: item.sku,
        name: item.name,
        category: item.category,
        current_stock: item.current_stock,
        reorder_point: item.reorder_point,
        recommended_reorder_qty: r_qty,
        days_until_stockout: daysLeft,
        predicted_stockout_date: daysLeft < 90 ? `2026-08-${1 + daysLeft}` : "2026-11-15",
        is_overstocked: dead_cap > 0,
        dead_capital: dead_cap,
        suggested_action: dead_cap > 100000 ? "Trigger 20% bundle discount on bulk wholesale channels immediately." : "Keep price stable and pause next purchase cycle.",
        confidence_score: item.recent_sales_30d > 100 ? 0.96 : 0.84,
        price_trend_prediction: item.category === "Chemicals" ? "Rising (+4% monthly due to crude oil surge)" : "Stable",
        monthly_forecast: months.map((m, idx) => ({
          month: m,
          predicted_quantity: Math.round(item.recent_sales_30d * (1 + Math.sin(idx) * 0.15) * factor),
          confidence_lower: Math.round(item.recent_sales_30d * 0.8 * (1 + Math.sin(idx) * 0.15)),
          confidence_upper: Math.round(item.recent_sales_30d * 1.2 * (1 + Math.sin(idx) * 0.15))
        }))
      });
      setPredictLoading(false);
    }, 450);
  };

  // API Call simulation: Smart PO Recommend
  const fetchPoRecommendation = async (sku: string) => {
    setPoLoading(true);
    setTimeout(() => {
      const recs: any = {
        "CH-PL-902": { vendor: "Gujarat Alkalies & Chemicals Ltd", qty: 450, price: 85, total: 38250, trend: "Rising (+4% monthly)", urgency: "CRITICAL" },
        "PH-PA-500": { vendor: "Aurobindo Pharma Ltd", qty: 350, price: 450, total: 157500, trend: "Stable", urgency: "MEDIUM" },
        "TX-CT-40S": { vendor: "Vardhman Textiles Group", qty: 800, price: 240, total: 192000, trend: "Dropping (-2%)", urgency: "LOW" },
        "PKG-BX-DF": { vendor: "Horizon Packs Pvt Ltd", qty: 1500, price: 15, total: 22500, trend: "Stable", urgency: "MEDIUM" },
        "FMCG-PO-1L": { vendor: "Adani Wilmar Logistics", qty: 2500, price: 115, total: 287500, trend: "Stable", urgency: "HIGH" }
      };
      
      const item = inventoryList.find(i => i.sku === sku) || inventoryList[0];
      const details = recs[sku] || recs["CH-PL-902"];
      
      setPoRecommendation({
        sku: sku,
        product_name: item.name,
        category: item.category,
        recommended_vendor: details.vendor,
        recommended_qty: details.qty,
        estimated_unit_price: details.price,
        total_estimated_po_value: details.qty * details.price,
        price_trend: details.trend,
        purchase_urgency: details.urgency,
        recommended_purchase_date: "2026-08-04",
        ai_rationale: `Vendor ${details.vendor} is ranked #1 in reliability (${INITIAL_SUPPLIERS.find(s => s.name === details.vendor)?.reliability_score || 4.7}/5). Suggested volume aligns exactly with next 45-day sales peaks, minimizing sea-freight overhead.`
      });
      setPoLoading(false);
    }, 400);
  };

  // API Call simulation: Cash Flow & Leakage
  const fetchCashFlow = () => {
    setCashflowForecast({
      predicted_gross_inflow: 2450000,
      risk_adjusted_inflow: 2202000,
      predicted_gross_outflow: 1820000,
      net_predicted_cashflow: 382000,
      net_working_capital: 1200000,
      cash_flow_safety_status: "Healthy (Positive Net Inflow)"
    });
    setLeakageTotal(62500);
  };

  // API Call: Run OCR Invoice analysis
  const handleOcrTrigger = () => {
    setOcrLoading(true);
    setTimeout(() => {
      if (selectedOcrMockFile === "balaji_polymers.pdf") {
        const added = {
          id: invoiceList.length + 1,
          invoice_number: "BP-902",
          partner_name: "Balaji Polymers & Chemicals",
          partner_gstin: "24AAACB1209C1Z9",
          partner_type: "MSME (Micro)",
          total_amount: 118000,
          status: "Unpaid",
          is_verified: true,
          duplicate_status: "Unique",
          fake_invoice_risk_score: 0.08,
          wrong_hsn_detected: false,
          wrong_tax_detected: false,
          msme_45day_alert: true,
          days_outstanding: 1,
          issue_date: "2026-07-31",
          due_date: "2026-09-14"
        };
        setOcrResult({
          invoice_number: "BP-902",
          partner_name: "Balaji Polymers & Chemicals Ltd",
          partner_gstin: "24AAACB1209C1Z9",
          hsn_code: "39011010",
          subtotal: 100000,
          cgst: 9000,
          sgst: 9000,
          igst: 0,
          total_amount: 118000,
          confidence_score: 0.99,
          duplicate_status: "Unique",
          similarity_score: 0.12,
          fake_invoice_risk_score: 0.08,
          risk_category: "Low Risk",
          reasons: ["Tax rates correctly match standard 18% Polymer criteria", "Active MSME registration recognized in CDSL database", "GSTIN matches state transaction log"]
        });
        setInvoiceList([added, ...invoiceList]);
      } else {
        const added = {
          id: invoiceList.length + 1,
          invoice_number: "AID-5591-DUP",
          partner_name: "Acme Industrial Distributors Ltd",
          partner_gstin: "27AAPCS1023D1Z4",
          partner_type: "Regular",
          total_amount: 99999,
          status: "Unpaid",
          is_verified: false,
          duplicate_status: "Duplicate",
          fake_invoice_risk_score: 0.92,
          wrong_hsn_detected: true,
          wrong_tax_detected: true,
          msme_45day_alert: false,
          days_outstanding: 1,
          issue_date: "2026-08-01",
          due_date: "2026-08-31"
        };
        setOcrResult({
          invoice_number: "AID-5591-DUP",
          partner_name: "Acme Industrial Distributors Ltd",
          partner_gstin: "27AAPCS1023D1Z4",
          hsn_code: "0000",
          subtotal: 84745,
          cgst: 7627,
          sgst: 7627,
          igst: 0,
          total_amount: 99999,
          confidence_score: 0.94,
          duplicate_status: "Duplicate",
          similarity_score: 0.98,
          fake_invoice_risk_score: 0.92,
          risk_category: "CRITICAL FRAUD ALERT",
          reasons: [
            "Matches outstanding invoice AID-5591-SPLIT with 98% similarity (Split transaction fraud bypass attempt)",
            "HSN code printed is 0000 (Invalid / Missing HSN category)",
            "Tax billing discrepancy: Interstate transaction from Maharashtra (27) to Gujarat (24) must charge IGST, but CGST + SGST was incorrectly charged."
          ]
        });
        setInvoiceList([added, ...invoiceList]);
      }
      setOcrLoading(false);
    }, 700);
  };

  // GSTIN Verifier Simulation
  const handleGstinVerify = () => {
    if (!gstinVerify || gstinVerify.length < 5) return;
    setGstinResult({
      legal_name: "Balaji Specialty Polymers Pvt Ltd",
      trade_name: "Balaji Polymers",
      state_jurisdiction: "Gujarat (State Code: 24)",
      taxpayer_type: "Regular Taxpayer",
      pan_number: gstinVerify.substring(2, 12).toUpperCase(),
      filing_frequency: "Monthly GSTR-1 & GSTR-3B",
      last_gstr3b_filed: "June 2026",
      status_active: true
    });
  };

  // CFO Copilot Chat
  const handleChatSend = () => {
    if (!chatQuery.trim()) return;
    const userMsg = { role: 'user', text: chatQuery, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatHistory(prev => [...prev, userMsg]);
    setChatLoading(true);
    
    const query = chatQuery;
    setChatQuery('');
    
    setTimeout(() => {
      let responseText = "";
      let audioPath = null;
      
      const cleanQ = query.toLowerCase();
      if (cleanQ.includes("stock") || cleanQ.includes("buy")) {
        responseText = "Based on our demand forecasting models, you should purchase 450 MT of Polyethylene Resin Grade-A and 350 KG of Paracetamol API immediately. Your safety stock limits are currently under-provisioned due to upcoming festive seasons (Diwali/Navratri) which typically experience a 35% surge in domestic logistics transit time.";
        audioPath = "/audio/stock_tip_en.mp3";
      } else if (cleanQ.includes("customer") || cleanQ.includes("pay") || cleanQ.includes("late")) {
        responseText = "Chirag General Store is currently flagged as High Risk (Risk Score: 74%). Their average payment duration is 65 days, which violates your standard 30-day term. They currently have Rs. 6,20,000 outstanding. I suggest pausing active shipments and freezing their credit ceiling.";
        audioPath = "/audio/stock_tip_en.mp3";
      } else if (cleanQ.includes("supplier") || cleanQ.includes("vendor")) {
        responseText = "Gujarat Alkalies & Chemicals Ltd is ranked #1 in your Supplier Directory (Overall score: 4.8/5). They maintain a 98% on-time delivery record and have the lowest complaint rate (0.5%). Deccan Petro-Chemicals is cheaper by 4%, but has a much higher delivery lag (+5 days).";
      } else if (cleanQ.includes("profit") || cleanQ.includes("expected")) {
        responseText = "Your projected net profit for August 2026 is Rs. 6,30,000, with gross cash inflows of Rs. 24.5 Lakhs and outflows of Rs. 18.2 Lakhs. Note that your profit is currently leaking Rs. 62,500 due to overstocked paracetamol active pharma ingredients at the Baddi warehouse.";
      } else if (cleanQ.includes("dead") || cleanQ.includes("overstock")) {
        responseText = "Your primary dead stock is 'Double Wall Corrugated Cartons' at the Bhiwandi Hub (4200 units, exceeding 120 days demand) and 'Paracetamol Active Pharma Ingredient' at Baddi (280 kg). Total blocked working capital is Rs. 1,22,500.";
      } else {
        responseText = "I've analyzed your financial ledger. Your overall business health score is 81/100, which is stable. Your main concern is cash flow constraints due to Rs. 10.7 Lakhs in aggregate accounts outstanding, with Chirag General Store accounting for the largest share. Let me know if you would like me to list the top purchase order recommendations for this week.";
      }
      
      const botMsg = {
        role: 'cfo',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audio_url: audioPath
      };
      
      setChatHistory(prev => [...prev, botMsg]);
      setChatLoading(false);
    }, 550);
  };

  // Play synthesized voices
  const playCfoVoice = (url: string) => {
    if (playingAudio) {
      setPlayingAudio(null);
      return;
    }
    setPlayingAudio(url);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => {
      setPlayingAudio(null);
    };
  };

  // Container Packing Optimization Heuristic
  const runContainerOptimization = () => {
    let limitVol = containerSpec === "20FT" ? 33.2 : containerSpec === "40FT" ? 67.7 : 76.4;
    let limitWt = containerSpec === "20FT" ? 28200 : 26600 : 26500;
    
    let totalVol = 0;
    let totalWt = 0;
    
    containerItems.forEach(item => {
      let v = item.carton_length_m * item.carton_width_m * item.carton_height_m * item.carton_qty;
      let w = item.carton_weight_kg * item.carton_qty;
      totalVol += v;
      totalWt += w;
    });
    
    const volUtil = Math.round((totalVol / limitVol) * 100);
    const wtUtil = Math.round((totalWt / limitWt) * 100);
    const overallUtil = Math.round((volUtil + wtUtil) / 2);
    
    setContainerOptimization({
      container_type: containerSpec,
      limit_volume: limitVol,
      limit_weight: limitWt,
      total_volume_packed: totalVol.toFixed(2),
      total_weight_packed: totalWt,
      vol_utilization: volUtil,
      weight_utilization: wtUtil,
      overall_utilization: overallUtil,
      pallets_estimated: Math.ceil(totalVol / 1.5),
      recommendation: overallUtil > 90 ? "Excellent utilization limit. Ready to seal." : "Lower packing density. We recommend adding 50 more cartons to minimize freight wastage."
    });
  };

  // Export profit calculations
  const runExportProfitCalculator = () => {
    const freightCostInr = oceanFreightUsd * 83.5;
    const dutyDrawback = fobInr * 0.015; // 1.5%
    const estimatedCogs = fobInr * 0.58;
    const totalExpenses = estimatedCogs + freightCostInr + packagingInr + customsInr - dutyDrawback;
    const profit = fobInr - totalExpenses;
    const margin = (profit / fobInr) * 100;
    
    setExportProfitResult({
      fob_value: fobInr,
      cogs: estimatedCogs,
      freight_inr: freightCostInr,
      incentives: dutyDrawback,
      net_profit: profit,
      margin_percent: margin.toFixed(1),
      break_even_units: Math.ceil((freightCostInr + packagingInr + customsInr) / (fobInr * 0.40))
    });
  };

  // HSN Lookup
  const runHsLookup = () => {
    const q = hsCodeInput.toLowerCase().trim();
    if (q.includes("polyethylene") || q.includes("resin")) {
      setHsResult({
        hs_code: "3901.10.10",
        gst: "18%",
        import_duty: "7.5%",
        restricted: "Free (No permit needed)",
        certs: ["BIS Quality Seal", "Phytosanitary Cert (for bags)"],
        labels: "IS 14489 Chemical Caution details required on outer wrap."
      });
    } else if (q.includes("paracetamol") || q.includes("api") || q.includes("drug")) {
      setHsResult({
        hs_code: "2922.11.90",
        gst: "12%",
        import_duty: "10.0%",
        restricted: "Restricted (CDSCO license mandatory)",
        certs: ["CDSCO Form 10", "WHO-GMP Certificate of Analysis"],
        labels: "Schedule H Drug warning, store below 25°C label compulsory."
      });
    } else {
      setHsResult({
        hs_code: "5205.24.00",
        gst: "5%",
        import_duty: "5.0%",
        restricted: "Free",
        certs: ["Textiles Committee Inspection", "Origin Certificate"],
        labels: "Yarn Count, Blend Composition percentages must be stamped."
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      
      {/* SIDEBAR NAVIGATION - Dark theme Linear/Vercel styling */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
              <Cpu size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight tracking-wider bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                BIZ-OPS AI
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">ERP CFO PLATFORM</span>
            </div>
          </div>

          {/* Quick Business Health Meter */}
          <div className="p-4 mx-3 my-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="text-emerald-400" size={16} />
              <span className="text-xs text-slate-400">Health Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-emerald-400">81%</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 badge-glow-green"></span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'dashboard' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <TrendingUp size={16} />
              CFO Control Tower
            </button>
            <button
              onClick={() => { setActiveTab('inventory'); fetchPrediction(selectedInventoryItem); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'inventory' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <Package size={16} />
              AI Inventory Prediction
            </button>
            <button
              onClick={() => { setActiveTab('purchase'); fetchPoRecommendation(selectedSkuPo); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'purchase' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <Layers size={16} />
              Smart Purchase & Vendors
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'invoice' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <FileSpreadsheet size={16} />
              GST & Invoice Intelligence
            </button>
            <button
              onClick={() => setActiveTab('copilot')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'copilot' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-indigo-400" />
                AI CFO Copilot
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">LIVE Voice</span>
            </button>
            <button
              onClick={() => { setActiveTab('shipping'); runContainerOptimization(); runHsLookup(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'shipping' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <Globe size={16} />
              Import Export & Shipping
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'admin' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <Settings size={16} />
              Super Admin & RBAC
            </button>
          </nav>
        </div>

        {/* User profile section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xs">
            JD
          </div>
          <div>
            <p className="text-xs font-bold">Jayesh Doshi</p>
            <p className="text-[10px] text-indigo-400 font-semibold">Chief Financial Officer</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP BAR HEADER */}
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between shrink-0 bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar size={12} />
              FY 2026-27 (Active)
            </span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 badge-glow-green">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Tally & ERP Live-Sync Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Authorized Company</span>
              <span className="text-xs font-bold text-slate-200">Aditya Polymers & Formulation Ltd</span>
            </div>
            <div className="w-1 h-8 bg-slate-800 rounded-full"></div>
            <button 
              onClick={() => { playCfoVoice('/audio/stock_tip_en.mp3'); }}
              className={`p-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all ${playingAudio ? 'animate-bounce' : ''}`}
              title="Listen to Live AI CFO Briefing"
            >
              <Volume2 size={18} />
            </button>
          </div>
        </header>

        {/* TAB BODY INNER SCROLLABLE */}
        <div className="p-8 space-y-8 flex-1">

          {/* TAB 1: CFO CONTROL TOWER */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Headline Welcome */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">CFO Control Tower</h2>
                  <p className="text-sm text-slate-400">Consolidated analytics and business anomalies detected across multi-branch ledgers.</p>
                </div>
                <button 
                  onClick={fetchCashFlow}
                  className="bg-slate-900 border border-slate-800 text-xs px-4 py-2 rounded-lg text-slate-300 flex items-center gap-2 hover:bg-slate-800 transition"
                >
                  <RefreshCw size={14} />
                  Refresh Ledger
                </button>
              </div>

              {/* Score Indicator Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-6 -mt-6"></div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Working Capital</span>
                    <DollarSign className="text-indigo-400" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold mt-3">₹1.20 Cr</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                    <TrendingUp size={12} />
                    <span>+12.4% vs last FY</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-6 -mt-6"></div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accounts Receivable</span>
                    <AlertTriangle className="text-amber-400" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold mt-3">₹12.75 L</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-rose-400">
                    <AlertCircle size={12} />
                    <span>₹6.2 L high-risk default warning</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-6 -mt-6"></div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Stock Value</span>
                    <Package className="text-emerald-400" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold mt-3">₹5.55 L</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                    <CheckCircle2 size={12} />
                    <span>Optimal 5 SKU classes tracked</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -mr-6 -mt-6"></div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capital Leaked</span>
                    <UserX className="text-rose-400" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold mt-3">₹62,500</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-amber-400">
                    <Info size={12} />
                    <span>Baddi Warehouse dead stock</span>
                  </div>
                </div>

              </div>

              {/* Multi-Score Audit Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Score breakdown bar */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-1 space-y-6">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Departmental Health Scores</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Inventory Turn Score</span>
                        <span className="text-indigo-400 font-bold">78%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>GST & Tax Compliance</span>
                        <span className="text-emerald-400 font-bold">92%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Supplier On-Time Score</span>
                        <span className="text-violet-400 font-bold">89%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-violet-500 h-full rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Customer Payment Default Risk</span>
                        <span className="text-rose-400 font-bold">71%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: '71%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Audit Status</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase text-[9px] badge-glow-green">SECURE</span>
                  </div>
                </div>

                {/* AI CFO strategic insights list */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-indigo-400 animate-pulse" size={16} />
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">CFO AI Strategic Insights</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                      <div className="bg-rose-500/10 p-2.5 rounded-lg text-rose-400 shrink-0 h-10 w-10 flex items-center justify-center">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-rose-300">Late Payment Default Alarm (Chirag Store)</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Retailer <b>Chirag General Store</b> outstanding balance has crossed ₹6,20,000 with avg payout delayed to 65 days. 
                          Our LSTM risk engine predicts a 74% default possibility. I recommend halting outstanding transport shipments.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                      <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-400 shrink-0 h-10 w-10 flex items-center justify-center">
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-300">Chemical Raw Material Price Spike Trigger</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          <b>Polyethylene Resin</b> prices are predicted to surge +4% next month due to Brent Crude supply contractions. 
                          We recommend placing a 450 MT purchase order with Gujarat Alkalies immediately to freeze bulk rates.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                      <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-400 shrink-0 h-10 w-10 flex items-center justify-center">
                        <FileCheck size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-300">MSME 45-Day Compliance Liability</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Purchase Invoice <b>BP-902</b> from Balaji Polymers (MSME certified) is on day 22. Under Income Tax Section 43B(h), 
                          non-payment by August 24 will disallow total deduction expense and accrue a 3x RBI bank rate interest penalty.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Visual Graphic Representation (Table of Customer Risks & Cash Flow Forecast summary) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Cash Flow Forecast Graph details */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">CFO Cash Flow forecast & Working Capital</h3>
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">August 2026 Forecast Period</span>
                      <span className="text-emerald-400 font-bold">Stable Liquidity</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-slate-900 rounded-lg">
                        <span className="text-[10px] text-slate-400 block font-semibold">Inflow (Gross)</span>
                        <span className="text-sm font-extrabold text-indigo-400">₹24.5 L</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg">
                        <span className="text-[10px] text-slate-400 block font-semibold">Risk Adjusted</span>
                        <span className="text-sm font-extrabold text-amber-400">₹22.0 L</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg">
                        <span className="text-[10px] text-slate-400 block font-semibold">Outflow</span>
                        <span className="text-sm font-extrabold text-rose-400">₹18.2 L</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Expected Net Balance Surplus:</span>
                        <span className="font-bold text-emerald-400">₹3,82,000</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Risk Deficit contingency buffer:</span>
                        <span className="font-bold text-rose-400">₹2,48,000 (Chirag default possibility)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer outstanding list */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Customer Risk Intelligence Directory</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2.5">Customer Name</th>
                          <th className="py-2.5">Credit Score</th>
                          <th className="py-2.5 text-right">Outstanding (INR)</th>
                          <th className="py-2.5 text-center">Default Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerList.map((customer) => (
                          <tr key={customer.id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                            <td className="py-3 font-bold text-slate-200">{customer.name}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                customer.credit_score > 750 ? 'bg-emerald-500/10 text-emerald-400' : customer.credit_score > 600 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-rose-400'
                              }`}>
                                {customer.credit_score}
                              </span>
                            </td>
                            <td className="py-3 text-right font-extrabold text-slate-300">₹{customer.outstanding_amount.toLocaleString()}</td>
                            <td className="py-3 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                customer.late_payment_risk < 0.1 ? 'bg-emerald-500/10 text-emerald-400' : customer.late_payment_risk < 0.4 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-rose-400'
                              }`}>
                                {Math.round(customer.late_payment_risk * 100)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* TAB 2: AI INVENTORY PREDICTION */}
          {activeTab === 'inventory' && (
            <div className="space-y-8">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">AI Inventory Dynamics</h2>
                  <p className="text-sm text-slate-400">Uses machine learning (Prophet + XGBoost) to forecast stock depleted dates and capital allocations.</p>
                </div>
              </div>

              {/* Main Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Inventory Item Table */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Live Warehouse Stocks</h3>
                    <div className="relative w-48">
                      <Search className="absolute left-2.5 top-2.5 text-slate-500" size={14} />
                      <input 
                        type="text"
                        placeholder="Search SKU..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="glass-input pl-8 pr-3 py-1.5 w-full rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2.5">SKU / Item</th>
                          <th className="py-2.5">Factory Location</th>
                          <th className="py-2.5 text-right">Current Stock</th>
                          <th className="py-2.5 text-right">Reorder Point</th>
                          <th className="py-2.5 text-center">Status</th>
                          <th className="py-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryList
                          .filter(i => i.name.toLowerCase().includes(inventorySearch.toLowerCase()) || i.sku.toLowerCase().includes(inventorySearch.toLowerCase()))
                          .map((item) => (
                            <tr 
                              key={item.id} 
                              onClick={() => { setSelectedInventoryId(item.id); fetchPrediction(item.id); }}
                              className={`border-b border-slate-800/60 hover:bg-indigo-600/5 transition cursor-pointer ${
                                selectedInventoryItem === item.id ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500' : ''
                              }`}
                            >
                              <td className="py-3 pl-2">
                                <div className="font-bold text-slate-100">{item.name}</div>
                                <div className="text-[10px] text-slate-500">{item.sku} • HSN {item.hsn_code}</div>
                              </td>
                              <td className="py-3 text-slate-400">{item.warehouse_name}</td>
                              <td className="py-3 text-right font-extrabold">{item.current_stock}</td>
                              <td className="py-3 text-right text-slate-400">{item.reorder_point}</td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                                  item.status === "Healthy" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button className="text-indigo-400 font-bold hover:underline">Analyze</button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Transfer stock tool */}
                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <ArrowRightLeft size={14} className="text-indigo-400" />
                      Inter-Warehouse Stock Transfer (Live QR)
                    </h4>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Select Item SKU</label>
                        <select className="w-full glass-input p-2 rounded-lg text-xs">
                          {inventoryList.map(i => <option key={i.id} value={i.sku}>{i.sku}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">From Factory</label>
                        <input type="text" className="w-full glass-input p-2 rounded-lg text-xs" value="Hazira Factory" disabled />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">To Warehouse</label>
                        <select className="w-full glass-input p-2 rounded-lg text-xs">
                          <option>Bhiwandi Hub</option>
                          <option>Coimbatore Spinning</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button className="w-full bg-indigo-600 text-white font-bold p-2 rounded-lg hover:bg-indigo-700 transition" onClick={() => alert("Warehouse transfer initialized. Barcode system scanning verified.")}>
                          Authorize Transfer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right AI Predict Dynamic Side Card */}
                <div className="glass-card p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1.5">
                      <Cpu size={14} className="animate-spin" />
                      AI Prediction Engine
                    </h3>
                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider badge-glow-green">PROPHET-XGB</span>
                  </div>

                  {predictLoading ? (
                    <div className="py-20 text-center text-slate-500 text-xs">Computing seasonal forecast matrix...</div>
                  ) : aiPredictionData ? (
                    <div className="space-y-6 text-xs">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-100">{aiPredictionData.name}</h4>
                        <p className="text-[10px] text-slate-400 uppercase mt-0.5">{aiPredictionData.category} • SKU {aiPredictionData.sku}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Predicted Stockout</span>
                          <span className="text-sm font-extrabold text-rose-400">{aiPredictionData.predicted_stockout_date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Days Until Empty</span>
                          <span className="text-sm font-extrabold text-rose-400">{aiPredictionData.days_until_stockout} Days</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-[10px] text-slate-400 block font-semibold">Reorder Target Qty</span>
                          <span className="text-sm font-extrabold text-indigo-400">{aiPredictionData.recommended_reorder_qty} Units</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-[10px] text-slate-400 block font-semibold">Confidence Score</span>
                          <span className="text-sm font-extrabold text-emerald-400">{Math.round(aiPredictionData.confidence_score * 100)}%</span>
                        </div>
                      </div>

                      {aiPredictionData.is_overstocked && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                          <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle size={14} />
                            Overstock Alert (Capital Blocked)
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Dead Capital locked: <b>₹{aiPredictionData.dead_capital.toLocaleString()}</b>. 
                            {aiPredictionData.suggested_action}
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-200">Recommended Next Step:</h4>
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Purchase trend is <b>{aiPredictionData.price_trend_prediction}</b>. 
                            Procure recommended quantity before stockout date to avoid transport congestion delay.
                          </p>
                        </div>
                      </div>

                      {/* Display Monthly Forecast Matrix Table */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-300">Monthly Predicted Demand (August - Jan)</h4>
                        <div className="space-y-1.5">
                          {aiPredictionData.monthly_forecast?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] border-b border-slate-800/60 pb-1">
                              <span className="text-slate-400">{item.month}</span>
                              <div className="flex gap-2 font-mono">
                                <span className="text-slate-500">[{item.confidence_lower}]</span>
                                <span className="text-slate-200 font-bold">{item.predicted_quantity}</span>
                                <span className="text-slate-500">[{item.confidence_upper}]</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : null}
                </div>

              </div>

            </div>
          )}


          {/* TAB 3: SMART PURCHASE RECOMMENDATION */}
          {activeTab === 'purchase' && (
            <div className="space-y-8">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Smart Purchase & Vendors</h2>
                  <p className="text-sm text-slate-400">Ranks domestic suppliers dynamically and auto-computes optimal Procurement Purchase Orders.</p>
                </div>
              </div>

              {/* Vendor Matrix & Smart Recommendation Column */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Ranked Suppliers */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Strategic Supplier Ranking Directory</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2.5">Supplier Name</th>
                          <th className="py-2.5 text-center">Delivery Time</th>
                          <th className="py-2.5 text-center">Quality Score</th>
                          <th className="py-2.5 text-center">Price Rating</th>
                          <th className="py-2.5 text-center">Complaint Rate</th>
                          <th className="py-2.5 text-right">Reliability Index</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierList.map((sup) => (
                          <tr key={sup.id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                            <td className="py-3">
                              <div className="font-bold text-slate-100">{sup.name}</div>
                              <div className="text-[10px] text-slate-500">{sup.location} • GSTIN {sup.gstin}</div>
                            </td>
                            <td className="py-3 text-center font-mono">{sup.delivery_time_score}/5</td>
                            <td className="py-3 text-center font-mono">{sup.quality_score}/5</td>
                            <td className="py-3 text-center font-mono">{sup.price_score}/5</td>
                            <td className="py-3 text-center text-rose-400 font-semibold">{sup.complaint_rate}%</td>
                            <td className="py-3 text-right">
                              <span className="text-emerald-400 font-extrabold">{sup.reliability_score}/5</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vendor Contract Clause terms warning */}
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs">
                    <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={14} />
                      AI Contract Compliance
                    </h4>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Our NLP contract analyzer read the active framework agreement of <b>Gujarat Alkalies</b>. 
                      Detected penalty clause: 1.5% discount deduction per day of transit lag past 10 days. 
                      Standard logistics terms conform to Incoterms FOB Hazira Port.
                    </p>
                  </div>
                </div>

                {/* Right Smart Recommendation Trigger */}
                <div className="glass-card p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Smart PO Recommendation</h3>
                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold text-[9px] uppercase">AI PO</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1.5">Analyze Stock Reorder SKU</label>
                      <select 
                        value={selectedSkuPo}
                        onChange={(e) => { setSelectedSkuPo(e.target.value); fetchPoRecommendation(e.target.value); }}
                        className="w-full glass-input p-2.5 rounded-lg text-xs"
                      >
                        {inventoryList.map(i => <option key={i.id} value={i.sku}>{i.name} ({i.sku})</option>)}
                      </select>
                    </div>

                    {poLoading ? (
                      <div className="py-16 text-center text-slate-500 text-xs">Computing optimal supplier pricing models...</div>
                    ) : poRecommendation ? (
                      <div className="space-y-5 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-[10px] text-indigo-400 block font-bold">REQUISITION SKU</span>
                          <span className="text-slate-100 font-bold text-sm">{poRecommendation.product_name}</span>
                        </div>

                        <div className="space-y-2 border-t border-slate-800 pt-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Best Vendor:</span>
                            <span className="font-bold text-slate-200">{poRecommendation.recommended_vendor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Recommended Qty:</span>
                            <span className="font-extrabold text-indigo-400">{poRecommendation.recommended_qty} Units</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Estimated Price:</span>
                            <span className="font-extrabold text-slate-200">₹{poRecommendation.estimated_unit_price} / unit</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Purchase Value:</span>
                            <span className="font-extrabold text-indigo-400">₹{poRecommendation.total_estimated_po_value.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Market Price Trend:</span>
                            <span className="font-bold text-amber-400">{poRecommendation.price_trend}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Urgency:</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                              poRecommendation.purchase_urgency === "CRITICAL" ? "bg-red-500/25 text-rose-400" : "bg-amber-500/25 text-amber-400"
                            }`}>{poRecommendation.purchase_urgency}</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 leading-relaxed">
                          <b>AI Rationale:</b> {poRecommendation.ai_rationale}
                        </div>

                        <button 
                          onClick={() => alert(`Purchase Order of ₹${poRecommendation.total_estimated_po_value.toLocaleString()} generated and synced to Zoho Books.`)}
                          className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                          Generate PO & Sync Zoho
                        </button>
                      </div>
                    ) : null}
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* TAB 4: GST & INVOICE INTELLIGENCE */}
          {activeTab === 'invoice' && (
            <div className="space-y-8">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">GST & Invoice Intelligence</h2>
                  <p className="text-sm text-slate-400">Detects duplicate invoices, wrong HSN classifications, MSME 45-day compound interest risks, and validates tax computations.</p>
                </div>
              </div>

              {/* Upload simulation card & Tracker split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Upload Scanner */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-1 space-y-6">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">AI Invoice OCR Scanner</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1.5">Select Mock Invoice File</label>
                      <select 
                        value={selectedOcrMockFile}
                        onChange={(e) => setSelectedOcrMockFile(e.target.value)}
                        className="w-full glass-input p-2.5 rounded-lg text-xs"
                      >
                        <option value="balaji_polymers.pdf">balaji_polymers_resin_inv.pdf (MSME Verified)</option>
                        <option value="acme_industrial_dup.pdf">acme_distributors_AID-5591_DUPLICATE.pdf (Duplicate Fraud Warning)</option>
                      </select>
                    </div>

                    <div className="border border-dashed border-slate-700 p-8 rounded-xl text-center bg-slate-950 cursor-pointer hover:border-indigo-500/50 transition">
                      <FileCheck className="mx-auto text-slate-400 mb-2" size={24} />
                      <p className="text-xs font-semibold text-slate-300">File Ready: {selectedOcrMockFile}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">PaddleOCR model ready to parse raw text</span>
                    </div>

                    <button 
                      onClick={handleOcrTrigger}
                      disabled={ocrLoading}
                      className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                      {ocrLoading ? <RefreshCw className="animate-spin" size={14} /> : <Cpu size={14} />}
                      Run AI OCR Analyzer
                    </button>
                  </div>

                  {/* GSTIN Verifier */}
                  <div className="border-t border-slate-800 pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300">Real-time GSTIN Portal Verify</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter 15-char GSTIN..."
                        value={gstinVerify}
                        onChange={(e) => setGstinVerify(e.target.value)}
                        className="flex-1 glass-input p-2 rounded-lg text-xs"
                      />
                      <button 
                        onClick={handleGstinVerify}
                        className="bg-indigo-600 text-white px-3 rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
                      >
                        Verify
                      </button>
                    </div>

                    {gstinResult && (
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] space-y-1 text-slate-400">
                        <div className="flex justify-between"><span className="font-bold text-slate-200">Legal Name:</span> <span>{gstinResult.legal_name}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-slate-200">Jurisdiction:</span> <span>{gstinResult.state_jurisdiction}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-slate-200">Filing Mode:</span> <span>{gstinResult.filing_frequency}</span></div>
                        <div className="flex justify-between"><span className="font-bold text-slate-200">Status:</span> <span className="text-emerald-400 font-bold">Active</span></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center / Right OCR Result details & MSME 45-day Table */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* OCR AI analysis result block */}
                  {ocrResult && (
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-l-indigo-500 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs uppercase font-bold text-indigo-400 tracking-wider">AI OCR Extraction & Validation Report</h3>
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] ${
                          ocrResult.risk_category.includes("FRAUD") ? "bg-red-500/20 text-rose-400 animate-pulse" : "bg-emerald-500/20 text-emerald-400"
                        }`}>{ocrResult.risk_category}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase font-semibold">Invoice No</span>
                          <span className="font-bold">{ocrResult.invoice_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase font-semibold">Vendor</span>
                          <span className="font-bold">{ocrResult.partner_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase font-semibold">Total Amount</span>
                          <span className="font-extrabold text-indigo-400">₹{ocrResult.total_amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block">AI REASONING LOG:</span>
                        <ul className="list-disc list-inside text-[10px] text-slate-300 space-y-1">
                          {ocrResult.reasons.map((r: string, idx: number) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* MSME Tracker Compliance Table */}
                  <div className="glass-card p-6 rounded-2xl space-y-4">
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                      <span>MSME Section 43B(h) payment audit</span>
                      <span className="text-rose-400 font-bold font-mono text-[10px]">45-DAY COMPLIANCE RULE</span>
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                            <th className="py-2">Vendor Name</th>
                            <th className="py-2 text-right">Invoice Value</th>
                            <th className="py-2 text-center">Days Unpaid</th>
                            <th className="py-2 text-center">Remaining Days</th>
                            <th className="py-2 text-right">Compounded Interest Liability</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceList.map((inv) => {
                            const remaining = 45 - inv.days_outstanding;
                            const isMsme = inv.partner_type.includes("MSME");
                            
                            // Estimate compound interest if remaining is negative
                            let interest = 0;
                            if (isMsme && remaining < 0) {
                              interest = Math.round((inv.total_amount * 0.18 / 365) * Math.abs(remaining));
                            }

                            return (
                              <tr key={inv.id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                                <td className="py-3">
                                  <div className="font-bold text-slate-100">{inv.partner_name}</div>
                                  <div className="text-[9px] text-slate-500">Invoice #{inv.invoice_number} • {inv.partner_type}</div>
                                </td>
                                <td className="py-3 text-right font-extrabold text-slate-200">₹{inv.total_amount.toLocaleString()}</td>
                                <td className="py-3 text-center font-mono">{inv.days_outstanding}</td>
                                <td className="py-3 text-center font-mono">
                                  {isMsme ? (
                                    remaining <= 0 ? (
                                      <span className="text-rose-400 font-bold">EXPIRED</span>
                                    ) : (
                                      <span className={`${remaining < 10 ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>{remaining} Days</span>
                                    )
                                  ) : (
                                    <span className="text-slate-500">N/A (Regular)</span>
                                  )}
                                </td>
                                <td className="py-3 text-right font-bold text-rose-400">
                                  {interest > 0 ? `₹${interest.toLocaleString()}` : "₹0.00"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* TAB 5: AI CFO COPILOT */}
          {activeTab === 'copilot' && (
            <div className="space-y-8">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">AI CFO Copilot</h2>
                  <p className="text-sm text-slate-400">An intelligent agent conversant in corporate financials, supply chain bottlenecks, and tax liabilities with native voice generation.</p>
                </div>
              </div>

              {/* Chat portal */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Presets */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-1 space-y-4 h-fit">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">CFO Query Presets</h3>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setChatQuery("How much stock should I buy?")}
                      className="text-left text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition"
                    >
                      "How much stock should I buy?"
                    </button>
                    <button 
                      onClick={() => setChatQuery("Which customer pays late?")}
                      className="text-left text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition"
                    >
                      "Which customer pays late?"
                    </button>
                    <button 
                      onClick={() => setChatQuery("Which supplier is best?")}
                      className="text-left text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition"
                    >
                      "Which supplier is best?"
                    </button>
                    <button 
                      onClick={() => setChatQuery("Expected profit next month?")}
                      className="text-left text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition"
                    >
                      "Expected profit next month?"
                    </button>
                    <button 
                      onClick={() => setChatQuery("Which products are dead stock?")}
                      className="text-left text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition"
                    >
                      "Which products are dead stock?"
                    </button>
                  </div>

                  {/* Language Settings */}
                  <div className="border-t border-slate-800 pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Languages size={14} className="text-indigo-400" />
                      Voice Accent Language
                    </h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setVoiceLang('English')}
                        className={`flex-1 text-xs py-1.5 rounded-lg border font-bold ${voiceLang === 'English' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => setVoiceLang('Hindi')}
                        className={`flex-1 text-xs py-1.5 rounded-lg border font-bold ${voiceLang === 'Hindi' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                      >
                        Hindi
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Chat Dialog */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-3 flex flex-col h-[550px]">
                  
                  {/* Chat logs */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 text-xs max-w-xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold ${
                          msg.role === 'cfo' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {msg.role === 'cfo' ? <Cpu size={14} /> : 'ME'}
                        </div>

                        <div className={`p-4 rounded-2xl border ${
                          msg.role === 'cfo' ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-indigo-600 text-white border-indigo-500'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{msg.time}</span>
                            {msg.audio_url && (
                              <button 
                                onClick={() => playCfoVoice(msg.audio_url)}
                                className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 text-indigo-400 px-2.5 py-1 rounded-full font-bold hover:bg-slate-900 transition"
                              >
                                <Volume2 size={10} className={playingAudio === msg.audio_url ? "animate-bounce" : ""} />
                                {playingAudio === msg.audio_url ? "Playing..." : "Hear CFO Tip"}
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-3 text-xs text-slate-400 items-center">
                        <RefreshCw className="animate-spin text-indigo-400" size={14} />
                        CFO is analyzing business cashbooks...
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="border-t border-slate-800 pt-4 flex gap-2">
                    <input 
                      type="text"
                      placeholder="Ask AI CFO Copilot... e.g. Which customer pays late?"
                      value={chatQuery}
                      onChange={(e) => setChatQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                      className="flex-1 glass-input p-3 rounded-xl text-xs"
                    />
                    <button 
                      onClick={handleChatSend}
                      className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* TAB 6: IMPORT EXPORT & SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-8">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Import Export & Shipping Intelligence</h2>
                  <p className="text-sm text-slate-400">HS Code lookup compliance, 3D container optimizer layout, freight comparison matrices, and export profit calculators.</p>
                </div>
              </div>

              {/* Submodule Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. HS Code AI lookup */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">HS Code AI Compliance Resolver</h3>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Enter raw item name..."
                      value={hsCodeInput}
                      onChange={(e) => setHsCodeInput(e.target.value)}
                      className="flex-1 glass-input p-2 rounded-lg text-xs"
                    />
                    <button onClick={runHsLookup} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition">
                      Resolve HSN
                    </button>
                  </div>

                  {hsResult && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
                      <div className="flex justify-between pb-2 border-b border-slate-800/60">
                        <span className="text-indigo-400 font-bold font-mono">HS CODE: {hsResult.hs_code}</span>
                        <span className="text-slate-400">GST: {hsResult.gst} • Import Duty: {hsResult.import_duty}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Restricted Clearance Status</span>
                        <p className="font-semibold text-slate-300">{hsResult.restricted}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Mandatory Export Certificates</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {hsResult.certs.map((c: string, idx: number) => (
                            <span key={idx} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold text-indigo-300">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Label & Packaging Rules</span>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{hsResult.labels}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Container Optimizer Heuristic */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">3D Cargo Container Packing Optimizer</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Vessel Container</label>
                      <select 
                        value={containerSpec}
                        onChange={(e) => { setContainerSpec(e.target.value); runContainerOptimization(); }}
                        className="w-full glass-input p-2 rounded-lg text-xs"
                      >
                        <option value="20FT">20 Foot Standard Container (Max 33 CBM)</option>
                        <option value="40FT">40 Foot Standard Container (Max 67 CBM)</option>
                        <option value="40HC">40 Foot High Cube (Max 76 CBM)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Estimated Loadings</label>
                      <input type="text" className="w-full glass-input p-2 rounded-lg text-xs" value="2 Items classes" disabled />
                    </div>
                  </div>

                  {containerOptimization && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-500 block font-semibold">Packed Volume</span>
                          <span className="font-extrabold text-indigo-400">{containerOptimization.total_volume_packed} CBM</span>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-500 block font-semibold">Vol Utilization</span>
                          <span className="font-extrabold text-emerald-400">{containerOptimization.vol_utilization}%</span>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-500 block font-semibold">Pallets Estimated</span>
                          <span className="font-extrabold text-indigo-400">{containerOptimization.pallets_estimated} Pallets</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
                        <b>Optimizer Tip:</b> {containerOptimization.recommendation}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Export Profit Margin Calculator */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Export Profit Calculator</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contract FOB Value (INR)</label>
                      <input 
                        type="number" 
                        value={fobInr} 
                        onChange={(e) => { setFobInr(Number(e.target.value)); }}
                        className="w-full glass-input p-2 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Ocean Freight Quote (USD)</label>
                      <input 
                        type="number" 
                        value={oceanFreightUsd} 
                        onChange={(e) => { setOceanFreightUsd(Number(e.target.value)); }}
                        className="w-full glass-input p-2 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <button onClick={runExportProfitCalculator} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition">
                    Compute Deal ROI
                  </button>

                  {exportProfitResult && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
                      <div className="grid grid-cols-3 gap-2 border-b border-slate-800/60 pb-2">
                        <div>
                          <span className="text-[9px] text-slate-500 block font-semibold">Estimated COGS</span>
                          <span className="font-bold text-slate-300">₹{exportProfitResult.cogs.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block font-semibold">Government Rebate</span>
                          <span className="font-bold text-emerald-400">₹{exportProfitResult.incentives.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block font-semibold">Ocean Logistics</span>
                          <span className="font-bold text-slate-300">₹{exportProfitResult.freight_inr.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-300">Net Estimated Profit:</span>
                        <span className="font-extrabold text-indigo-400 text-sm">₹{exportProfitResult.net_profit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>True Margin %: <b className="text-emerald-400 font-extrabold">{exportProfitResult.margin_percent}%</b></span>
                        <span>Break-Even Volume: <b className="text-indigo-400 font-extrabold">{exportProfitResult.break_even_units} Units</b></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Global Shipping Compare & Tracking */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Freight Carrier Multi-channel comparison</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Origin Port</label>
                      <input type="text" className="w-full glass-input p-2 rounded-lg text-xs" value={shippingOrigin} onChange={(e) => setOrigin(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Destination Port</label>
                      <input type="text" className="w-full glass-input p-2 rounded-lg text-xs" value={shippingDestination} onChange={(e) => setDestination(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-indigo-300 block">Ocean Carrier (Mearsk/MSC)</span>
                        <span className="text-[10px] text-slate-400">Transit: 28 Days • Customs clearance needed</span>
                      </div>
                      <span className="font-extrabold text-emerald-400">₹1,80,000 (Best Value)</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-indigo-300 block">Air Cargo (Singapore Airlines)</span>
                        <span className="text-[10px] text-slate-400">Transit: 4 Days • Quick CDSCO verify</span>
                      </div>
                      <span className="font-extrabold text-slate-300">₹5,40,000</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-indigo-300 block">Express Courier (FedEx/DHL)</span>
                        <span className="text-[10px] text-slate-400">Transit: 2 Days • Door-to-door clear</span>
                      </div>
                      <span className="font-extrabold text-slate-300">₹7,80,000</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* TAB 7: SUPER ADMIN & SECURITY */}
          {activeTab === 'admin' && (
            <div className="space-y-8">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Super Admin & Security Panel</h2>
                  <p className="text-sm text-slate-400">Enterprise security RBAC policy rules, central audit trail monitoring, and multi-branch database configurations.</p>
                </div>
              </div>

              {/* RBAC details & Mock Audit table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Security settings */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-1 space-y-4 text-xs">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Access Control Policies</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-200 block">Central Audit Logging</span>
                        <span className="text-[10px] text-slate-400">Mandatory logging of ledger exports</span>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">ACTIVE</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-200 block">Row-Level Security (RLS)</span>
                        <span className="text-[10px] text-slate-400">Branch-specific document filtering</span>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">ACTIVE</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-200 block">256-Bit SSL Database TLS</span>
                        <span className="text-[10px] text-slate-400">Postgres connection strict encryption</span>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">ENCRYPTED</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-300">Authorized Branch Networks</h4>
                    <ul className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>Hazira Formulations Hub, Gujarat</li>
                      <li>Baddi API formulation complex, HP</li>
                      <li>Coimbatore Cotton Spinning mill, TN</li>
                      <li>Bhiwandi Master Logistics warehouse, MH</li>
                      <li>Kandla Import Handling Yard, Gujarat</li>
                    </ul>
                  </div>
                </div>

                {/* Audit Logs list */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Platform Security Audit Log</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2">Timestamp</th>
                          <th className="py-2">User Email</th>
                          <th className="py-2">Security Level</th>
                          <th className="py-2">Action / Table mutated</th>
                          <th className="py-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                          <td className="py-3 font-mono text-[10px] text-slate-500">2026-08-01 12:35:10</td>
                          <td className="py-3 font-bold">jayesh.doshi@adityapoly.in</td>
                          <td className="py-3 text-rose-400 font-bold">HIGH RISK</td>
                          <td className="py-3">OCR Invoice Audit check: Flagged Suspected Duplicate split</td>
                          <td className="py-3 text-right text-emerald-400 font-semibold">RESOLVED</td>
                        </tr>
                        <tr className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                          <td className="py-3 font-mono text-[10px] text-slate-500">2026-08-01 12:12:45</td>
                          <td className="py-3 font-bold">jayesh.doshi@adityapoly.in</td>
                          <td className="py-3 text-indigo-400 font-semibold">STANDARD</td>
                          <td className="py-3">Triggered 3D Container Pack Optimizer Heuristic layout</td>
                          <td className="py-3 text-right text-emerald-400 font-semibold">SUCCESS</td>
                        </tr>
                        <tr className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                          <td className="py-3 font-mono text-[10px] text-slate-500">2026-08-01 11:58:30</td>
                          <td className="py-3 font-bold">jayesh.doshi@adityapoly.in</td>
                          <td className="py-3 text-indigo-400 font-semibold">STANDARD</td>
                          <td className="py-3">Re-ranked supplier directories for Chemical sector</td>
                          <td className="py-3 text-right text-emerald-400 font-semibold">SUCCESS</td>
                        </tr>
                        <tr className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                          <td className="py-3 font-mono text-[10px] text-slate-500">2026-08-01 10:44:11</td>
                          <td className="py-3 font-bold">sys.sync.tally@internal-api</td>
                          <td className="py-3 text-slate-400">BACKGROUND</td>
                          <td className="py-3">Tally Prime XML synchronization complete. 45 ledger items verified</td>
                          <td className="py-3 text-right text-emerald-400 font-semibold">SUCCESS</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
