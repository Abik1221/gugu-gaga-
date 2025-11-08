from enum import Enum


class Role(str, Enum):
    admin = "admin"
    pharmacy_owner = "pharmacy_owner"
    cashier = "cashier"
    affiliate = "affiliate"
    customer = "customer"
    supplier = "supplier"
