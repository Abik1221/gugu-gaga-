from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from app.db.session import SessionLocal, Base, get_engine
from app.models.user import User
from app.models.user_tenant import UserTenant
from app.models.medicine import Medicine, InventoryItem
from app.models.sales import Sale, SaleItem
from app.core.security import hash_password
from app.core.roles import Role
from app.models.affiliate import AffiliateProfile, AffiliateReferral


DEMO_TENANT = "demo-tenant"


def ensure_schema():
    engine = get_engine()
    Base.metadata.create_all(bind=engine)


def seed_demo():
    ensure_schema()
    db: Session = SessionLocal()
    try:
        # Owner user
        owner = db.query(User).filter(User.email == "owner@example.com").first()
        if not owner:
            owner = User(
                email="owner@example.com",
                phone="+251911000000",
                role=Role.pharmacy_owner.value,
                tenant_id=DEMO_TENANT,
                password_hash=hash_password("password"),
                is_active=True,
                is_approved=True,
            )
            db.add(owner)
            db.commit()
            db.refresh(owner)
            db.add(UserTenant(user_id=owner.id, tenant_id=DEMO_TENANT))
            db.commit()

        # Cashier user
        cashier = db.query(User).filter(User.email == "cashier@example.com").first()
        if not cashier:
            cashier = User(
                email="cashier@example.com",
                phone="+251911000001",
                role=Role.cashier.value,
                tenant_id=DEMO_TENANT,
                password_hash=hash_password("password"),
                is_active=True,
                is_approved=True,
            )
            db.add(cashier)
            db.commit()
            db.refresh(cashier)
            db.add(UserTenant(user_id=cashier.id, tenant_id=DEMO_TENANT))
            db.commit()

        # Medicines
        meds = [
            ("Paracetamol 500mg", "PARA500", "Analgesic", "ACME"),
            ("Ibuprofen 200mg", "IBU200", "NSAID", "ACME"),
            ("Amoxicillin 500mg", "AMOX500", "Antibiotic", "ACME"),
        ]
        med_objs: list[Medicine] = []
        for name, sku, cat, man in meds:
            m = (
                db.query(Medicine)
                .filter(Medicine.tenant_id == DEMO_TENANT, Medicine.name == name)
                .first()
            )
            if not m:
                m = Medicine(
                    tenant_id=DEMO_TENANT,
                    name=name,
                    sku=sku,
                    category=cat,
                    manufacturer=man,
                )
                db.add(m)
                db.commit()
                db.refresh(m)
            med_objs.append(m)

        # Inventory
        for m in med_objs:
            inv = (
                db.query(InventoryItem)
                .filter(InventoryItem.tenant_id == DEMO_TENANT, InventoryItem.medicine_id == m.id)
                .first()
            )
            if not inv:
                inv = InventoryItem(
                    tenant_id=DEMO_TENANT,
                    medicine_id=m.id,
                    branch="main",
                    quantity=100,
                    reorder_level=10,
                    sell_price=20.0,
                )
                db.add(inv)
                db.commit()

        # One sale with lines for cashier dashboard
        has_sale = db.query(Sale).filter(Sale.tenant_id == DEMO_TENANT).first()
        if not has_sale:
            sale = Sale(
                tenant_id=DEMO_TENANT,
                cashier_user_id=cashier.id if cashier else None,
                branch="main",
                total_amount=0.0,
            )
            db.add(sale)
            db.commit()
            db.refresh(sale)
            total = 0.0
            for m in med_objs[:2]:
                item = SaleItem(
                    sale_id=sale.id,
                    medicine_id=m.id,
                    quantity=3,
                    unit_price=20.0,
                    line_total=60.0,
                )
                total += 60.0
                db.add(item)
            sale.total_amount = total
            db.add(sale)
            db.commit()

        # Affiliate user and profile
        affiliate = db.query(User).filter(User.email == "affiliate@example.com").first()
        if not affiliate:
            affiliate = User(
                email="affiliate@example.com",
                phone="+251911000002",
                role=Role.affiliate.value,
                tenant_id=None,
                password_hash=hash_password("password"),
                is_active=True,
                is_approved=True,
            )
            db.add(affiliate)
            db.commit()
            db.refresh(affiliate)
            prof = AffiliateProfile(
                user_id=affiliate.id,
                code=f"AFF{affiliate.id:06d}",
                full_name="Demo Affiliate",
                bank_name="Demo Bank",
                bank_account_name="Demo Affiliate",
                bank_account_number="000111222333",
                iban=None,
            )
            db.add(prof)
            db.commit()

        # Link referral to demo tenant
        ref = (
            db.query(AffiliateReferral)
            .filter(AffiliateReferral.referred_tenant_id == DEMO_TENANT)
            .first()
        )
        if not ref and affiliate:
            ref = AffiliateReferral(
                affiliate_user_id=affiliate.id,
                referred_tenant_id=DEMO_TENANT,
                code=f"AFF{affiliate.id:06d}",
            )
            db.add(ref)
            db.commit()

        print("Seed complete: demo tenant=", DEMO_TENANT)
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo()
