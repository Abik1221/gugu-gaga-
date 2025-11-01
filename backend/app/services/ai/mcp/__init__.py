"""Minimal MCP integration scaffolding for the in-product analytics agent.

This package provides an in-process abstraction that aligns with the Model Context
Protocol (MCP) surface so we can plug in a compliant runtime later without
rewriting the rest of the agent stack.
"""

from .client import PharmacyMCPClient
from .registry import MCPToolRegistry, ToolExecutionError
from .server import PharmacyMCPServer, get_default_server, set_default_server

__all__ = [
    "PharmacyMCPClient",
    "PharmacyMCPServer",
    "MCPToolRegistry",
    "ToolExecutionError",
    "get_default_server",
    "set_default_server",
]
