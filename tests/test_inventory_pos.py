from datetime import date, timedelta

def test_medicine_inventory_pos_flow(client):
    headers = {"X-Tenant-ID": "tenantA"}

    # Create medicine
    r = client.post("/api/v1/medicines", params={"tenant_id": "tenantA"}, data={
        "name": "Paracetamol 500mg",
        "sku": "PARA500",
        "manufacturer": "ACME",
    })
    assert r.status_code == 200, r.text
    med_id = r.json()["id"]

    # Upsert inventory lot with packs
    inv = client.post("/api/v1/inventory/items", params={"tenant_id": "tenantA"}, data={
        "medicine_id": med_id,
        "branch": "Central",
        "pack_size": 10,
        "packs_count": 5,  # 50 units
        "singles_count": 5,  # +5 = 55 units
        "expiry_date": (date.today() + timedelta(days=365)).isoformat(),
        "lot_number": "LOT1",
        "sell_price": 2.5,
        "reorder_level": 10,
    })
    assert inv.status_code == 200, inv.text

    # List inventory and expect pack breakdown
    lst = client.get("/api/v1/inventory/items", params={"tenant_id": "tenantA", "branch": "Central"})
    assert lst.status_code == 200, lst.text
    data = lst.json()
    assert data["total"] >= 1
    item = data["items"][0]
    assert item["quantity"] == 55
    assert item["pack_size"] == 10
    assert item["packs"] == 5
    assert item["singles"] == 5

    # POS sale consumes 12 units via FEFO
    sale = client.post("/api/v1/sales/pos", params={"tenant_id": "tenantA"}, json={
        "branch": "Central",
        "lines": [{"name_or_sku": "PARA500", "quantity_units": 12}]
    })
    assert sale.status_code == 200, sale.text

    # Inventory should be 43 units remaining
    lst2 = client.get("/api/v1/inventory/items", params={"tenant_id": "tenantA", "branch": "Central"})
    assert lst2.status_code == 200
    rem = lst2.json()["items"][0]
    assert rem["quantity"] == 43
