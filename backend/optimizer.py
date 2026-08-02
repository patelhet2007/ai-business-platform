from typing import Dict, Any, List

class ContainerOptimizer:
    """
    3D container loading optimization using knapsack bin-packing concepts.
    Designed for Indian Exporters & Importers shipping with 20FT, 40FT, and 40HC containers.
    """
    
    CONTAINER_SPECS = {
        "20FT": {
            "name": "20 Foot Standard Container",
            "max_volume_cbm": 33.2,
            "max_weight_kg": 28200,
            "max_pallets": 11,
            "daily_freight_cost_avg_usd": 2400
        },
        "40FT": {
            "name": "40 Foot Standard Container",
            "max_volume_cbm": 67.7,
            "max_weight_kg": 26600,
            "max_pallets": 21,
            "daily_freight_cost_avg_usd": 3800
        },
        "40HC": {
            "name": "40 Foot High Cube Container",
            "max_volume_cbm": 76.4,
            "max_weight_kg": 26500,
            "max_pallets": 21,
            "daily_freight_cost_avg_usd": 4200
        }
    }

    @classmethod
    def optimize_packing(
        cls, 
        items: List[Dict[str, Any]], 
        target_container: str = "20FT"
    ) -> Dict[str, Any]:
        """
        Calculates maximum packing efficiency.
        Each item has: 'name', 'carton_qty', 'carton_length_m', 'carton_width_m', 'carton_height_m', 'carton_weight_kg'
        """
        spec = cls.CONTAINER_SPECS.get(target_container, cls.CONTAINER_SPECS["20FT"])
        
        total_volume = 0.0
        total_weight = 0.0
        packed_items = []
        rejected_items = []
        
        for item in items:
            name = item.get("name", "Product")
            qty = int(item.get("carton_qty", 0))
            l = float(item.get("carton_length_m", 0.3))
            w = float(item.get("carton_width_m", 0.3))
            h = float(item.get("carton_height_m", 0.3))
            weight_per_carton = float(item.get("carton_weight_kg", 5.0))
            
            unit_volume = l * w * h
            item_total_volume = unit_volume * qty
            item_total_weight = weight_per_carton * qty
            
            # Check constraints
            available_vol = spec["max_volume_cbm"] - total_volume
            available_weight = spec["max_weight_kg"] - total_weight
            
            if item_total_volume <= available_vol and item_total_weight <= available_weight:
                total_volume += item_total_volume
                total_weight += item_total_weight
                packed_items.append({
                    "name": name,
                    "qty_packed": qty,
                    "volume_cbm": round(item_total_volume, 2),
                    "weight_kg": round(item_total_weight, 2)
                })
            else:
                # Part pack if possible
                vol_fit_qty = int(available_vol // unit_volume) if unit_volume > 0 else 0
                weight_fit_qty = int(available_weight // weight_per_carton) if weight_per_carton > 0 else 0
                fit_qty = min(vol_fit_qty, weight_fit_qty, qty)
                
                if fit_qty > 0:
                    part_vol = unit_volume * fit_qty
                    part_weight = weight_per_carton * fit_qty
                    total_volume += part_vol
                    total_weight += part_weight
                    packed_items.append({
                        "name": name,
                        "qty_packed": fit_qty,
                        "volume_cbm": round(part_vol, 2),
                        "weight_kg": round(part_weight, 2)
                    })
                    
                leftover = qty - fit_qty
                if leftover > 0:
                    rejected_items.append({
                        "name": name,
                        "qty_leftover": leftover,
                        "volume_cbm": round(unit_volume * leftover, 2),
                        "weight_kg": round(weight_per_carton * leftover, 2)
                    })
                    
        # Calculate percentages
        vol_utilization = (total_volume / spec["max_volume_cbm"]) * 100
        weight_utilization = (total_weight / spec["max_weight_kg"]) * 100
        overall_utilization = (vol_utilization + weight_utilization) / 2
        
        # Pallet requirements
        pallets_needed = int(math.ceil(total_volume / 1.5)) # Standard Indian Pallet holds ~1.5 CBM
        pallet_overflow_risk = pallets_needed > spec["max_pallets"]
        
        # Action item
        if overall_utilization > 95:
            recommendation = "Optimal. The container is packed fully. Excellent ROI."
        elif overall_utilization < 60:
            recommendation = "Low utilization. Consider downscaling to a smaller container or bundling with more items to save ocean freight."
        else:
            recommendation = "Standard pack. Try rearranging heavier boxes to bottom layer."
            
        return {
            "container_type": target_container,
            "container_details": spec["name"],
            "max_volume_cbm": spec["max_volume_cbm"],
            "max_weight_kg": spec["max_weight_kg"],
            "total_volume_packed_cbm": round(total_volume, 2),
            "total_weight_packed_kg": round(total_weight, 2),
            "vol_utilization_percent": round(vol_utilization, 1),
            "weight_utilization_percent": round(weight_utilization, 1),
            "overall_utilization_percent": round(overall_utilization, 1),
            "pallets_estimated": min(pallets_needed, spec["max_pallets"]),
            "pallet_overflow_risk": pallet_overflow_risk,
            "packed_items": packed_items,
            "leftover_items": rejected_items,
            "recommendation": recommendation
        }
