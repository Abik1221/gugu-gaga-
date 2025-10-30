"""Integration service package for external data connectors."""

# Ensure connector implementations are registered on import.
from . import providers  # noqa: F401
