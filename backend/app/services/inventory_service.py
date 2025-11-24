from sqlalchemy.orm import Session
from app.models.medicine import InventoryItem, InventoryTransaction, Medicine
from app.schemas.inventory import InventoryAdjustment
from fastapi import HTTPException, status
from datetime import datetime

class InventoryService:
    @staticmethod
    def calculate_packet_total(packaging_levels: list) -> int:
        if not packaging_levels:
            return 0
        
        # Logic: 
        # Level 0: Box (qty: 5, contains: 10 of next)
        # Level 1: Strip (qty: auto, contains: 10 of next)
        # Level 2: Tablet (qty: auto, contains: 1)
        # Total = Level 0 qty * Level 0 contains * Level 1 contains ...
        
        # Wait, the structure in plan was:
        # { "name": "Box", "quantity": 5, "contains": 10 }
        # { "name": "Strip", "quantity": 50, "contains": 10 }
        # { "name": "Tablet", "quantity": 500, "contains": 1 }
        # The quantity in subsequent levels is derived.
        # So total = packaging_levels[0].quantity * product(contains for all levels except last?)
        # Actually, if Level 0 contains 10 Level 1s, and Level 1 contains 10 Level 2s.
        # Total Level 2s = Level 0 qty * Level 0 contains * Level 1 contains.
        
        total = packaging_levels[0].quantity
        for level in packaging_levels:
            if level.contains > 0: # Avoid multiplying by 0 if last level has 0 or 1
                 # Actually last level usually has contains=1 or 0 (meaning base unit)
                 # If contains is the number of *next* level items in *this* level item.
                 # Example: Box contains 10 Strips. Strip contains 10 Tablets. Tablet contains 1 (itself? or 0).
                 # If Tablet contains 1, then total = 5 * 10 * 10 * 1 = 500.
                 # If Tablet contains 0 or null, we stop.
                 pass
        
        # Let's assume 'contains' means how many of the *next* level unit are in *this* unit.
        # For the last level, 'contains' might be 1 (base unit).
        
        current_qty = packaging_levels[0].quantity
        for level in packaging_levels:
             if level.contains and level.contains > 0:
                 current_qty *= level.contains
                 
        # Wait, if I have 5 Boxes, and each Box has 10 Strips.
        # Level 0: Box, qty=5, contains=10.
        # Level 1: Strip, qty=50, contains=10.
        # Level 2: Tablet, qty=500, contains=1.
        
        # The calculation should be:
        # Total = Level 0 Qty
        # For each level i (from 0 to n-1):
        #   Total *= Level[i].contains
        
        total = packaging_levels[0].quantity
        for i in range(len(packaging_levels)):
            # If it's the last level, contains might be 1 or irrelevant for multiplication if it represents base unit.
            # But if we define contains as "items of next level", then for the last level it should be 1 or we stop.
            if i < len(packaging_levels) - 1:
                total *= packaging_levels[i].contains
            elif packaging_levels[i].contains > 1:
                 # If last level also says it contains X of something else (maybe implicit base unit?)
                 total *= packaging_levels[i].contains
                 
        return total

    @staticmethod
    def log_transaction(
        db: Session,
        item_id: int,
        transaction_type: str,
        quantity_change: int,
        quantity_before: int,
        quantity_after: int,
        reason: str | None,
        user_id: int,
    ):
        transaction = InventoryTransaction(
            inventory_item_id=item_id,
            transaction_type=transaction_type,
            quantity_change=quantity_change,
            quantity_before=quantity_before,
            quantity_after=quantity_after,
            reason=reason,
            created_by=user_id,
        )
        db.add(transaction)
        
    @staticmethod
    def adjust_inventory(
        db: Session,
        item_id: int,
        adjustment: InventoryAdjustment,
        user_id: int,
        tenant_id: str
    ) -> InventoryItem:
        item = db.query(InventoryItem).filter(
            InventoryItem.id == item_id, 
            InventoryItem.tenant_id == tenant_id
        ).first()
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
            
        old_quantity = item.quantity
        new_quantity = old_quantity
        
        if adjustment.mode == 'add':
            new_quantity += adjustment.quantity
        elif adjustment.mode == 'remove':
            if adjustment.quantity > old_quantity:
                raise HTTPException(status_code=400, detail="Cannot remove more than available quantity")
            new_quantity -= adjustment.quantity
        elif adjustment.mode == 'replace':
            new_quantity = adjustment.quantity
            
        if new_quantity < 0:
             raise HTTPException(status_code=400, detail="Resulting quantity cannot be negative")
             
        item.quantity = new_quantity
        item.last_updated_by = user_id
        item.last_update_reason = adjustment.reason
        
        InventoryService.log_transaction(
            db, item.id, adjustment.mode, 
            new_quantity - old_quantity, old_quantity, new_quantity, 
            adjustment.reason, user_id
        )
        
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
