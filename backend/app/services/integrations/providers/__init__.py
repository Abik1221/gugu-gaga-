"""Integration provider connector registrations."""

# Import provider modules so they register their connectors on import.
from . import google_sheets  # noqa: F401
from . import zoho_books  # noqa: F401
from . import odoo  # noqa: F401
from . import notion  # noqa: F401
