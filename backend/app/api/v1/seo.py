from fastapi import APIRouter
from fastapi.responses import Response
from datetime import datetime

router = APIRouter()

@router.get("/sitemap.xml", response_class=Response)
def get_sitemap():
    """
    MesobAI Sitemap - AI in Ethiopia pharmacy management system
    Mesob technology for Ethiopian businesses and healthcare AI solutions
    """
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    
    <!-- MesobAI API Documentation -->
    <url>
        <loc>https://api.mesobai.com/docs</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- MesobAI ReDoc Documentation -->
    <url>
        <loc>https://api.mesobai.com/redoc</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- MesobAI OpenAPI Schema -->
    <url>
        <loc>https://api.mesobai.com/openapi.json</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- MesobAI Health Check -->
    <url>
        <loc>https://api.mesobai.com/health</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>
    
</urlset>"""
    
    return Response(content=sitemap_xml, media_type="application/xml")

@router.get("/robots.txt", response_class=Response)
def get_robots():
    """
    MesobAI Robots.txt - SEO configuration for AI in Ethiopia
    """
    robots_content = """User-agent: *
Allow: /
Allow: /docs
Allow: /redoc
Allow: /openapi.json
Allow: /health

# MesobAI - AI in Ethiopia
# AI-powered pharmacy management system
# Mesob technology for Ethiopian businesses
# AI in business solutions for healthcare

Sitemap: https://api.mesobai.com/sitemap.xml

# Block sensitive endpoints
Disallow: /api/v1/auth/
Disallow: /api/v1/admin/
Disallow: /api/v1/billing/"""
    
    return Response(content=robots_content, media_type="text/plain")

@router.get("/seo-meta")
def get_seo_meta():
    """
    MesobAI SEO Metadata - AI in Ethiopia business solutions
    """
    return {
        "title": "MesobAI - AI-Powered Pharmacy Management System for Ethiopia",
        "description": "MesobAI: Revolutionary AI in business solution for Ethiopian pharmacies. Advanced mesob technology platform offering AI-powered pharmacy management, inventory control, and business intelligence for Ethiopia's healthcare sector.",
        "keywords": [
            "MesobAI", "mesob", "AI in Ethiopia", "AI in business", 
            "Ethiopian pharmacy management", "healthcare AI Ethiopia",
            "pharmacy software Ethiopia", "AI business solutions",
            "mesob technology", "Ethiopian healthcare technology",
            "AI inventory management", "pharmacy AI system",
            "business intelligence Ethiopia", "healthcare automation"
        ],
        "author": "MesobAI Team",
        "robots": "index, follow",
        "canonical": "https://api.mesobai.com",
        "og": {
            "title": "MesobAI - AI in Ethiopia for Pharmacy Management",
            "description": "Revolutionary mesob AI technology for Ethiopian businesses. Advanced pharmacy management with AI-powered insights.",
            "type": "website",
            "url": "https://api.mesobai.com",
            "site_name": "MesobAI"
        },
        "twitter": {
            "card": "summary_large_image",
            "title": "MesobAI - AI in Ethiopia Business Solutions",
            "description": "Mesob AI technology revolutionizing Ethiopian pharmacy management and healthcare business intelligence."
        }
    }