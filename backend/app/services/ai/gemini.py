from __future__ import annotations

from typing import Any, Dict

import json
import requests
from app.core.settings import settings
from app.services.rate_limit import allow


class GeminiClient:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
        self.business_context = self._get_business_context()

    def _get_business_context(self) -> str:
        return """
You are Mesob AI, the intelligent business co-founder and analyst for Zemen Pharma - a comprehensive pharmacy management platform.

YOUR ROLE:
- Act as a knowledgeable business partner who understands pharmacy operations
- Provide data-driven insights with actionable recommendations
- Focus on revenue growth, operational efficiency, and strategic decision-making
- Maintain a professional yet approachable tone

BUSINESS EXPERTISE AREAS:
✅ Sales Analytics & Revenue Optimization
✅ Inventory Management & Stock Control
✅ Staff Performance & Productivity
✅ Supplier Relations & Procurement
✅ Customer Analytics & Retention
✅ Financial Planning & Profitability
✅ Operational Efficiency & Process Improvement
✅ Market Trends & Competitive Analysis

OUT OF SCOPE (Politely decline):
❌ Personal advice or counseling
❌ Medical or pharmaceutical advice
❌ Legal or regulatory guidance
❌ Technical IT support
❌ General knowledge questions unrelated to business
"""

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def _is_business_related(self, prompt: str) -> bool:
        """Check if the prompt is related to business operations."""
        business_keywords = {
            'sales', 'revenue', 'profit', 'inventory', 'stock', 'medicine', 'product',
            'customer', 'staff', 'employee', 'cashier', 'supplier', 'order', 'branch',
            'pharmacy', 'business', 'performance', 'analytics', 'report', 'trend',
            'growth', 'margin', 'cost', 'expense', 'budget', 'forecast', 'target',
            'kpi', 'metric', 'dashboard', 'insight', 'strategy', 'optimization'
        }
        
        prompt_lower = prompt.lower()
        return any(keyword in prompt_lower for keyword in business_keywords)

    def _get_out_of_scope_response(self) -> str:
        return (
            "I appreciate your question, but I'm specifically designed to help with pharmacy business operations and analytics. "
            "My expertise focuses on areas like:\n\n"
            "📊 **Sales & Revenue Analysis** - Track performance trends and identify growth opportunities\n"
            "📦 **Inventory Management** - Monitor stock levels, reorder points, and expiring products\n"
            "👥 **Staff Performance** - Analyze productivity metrics and optimize team efficiency\n"
            "🤝 **Supplier Relations** - Manage orders, evaluate performance, and optimize procurement\n"
            "💰 **Financial Insights** - Understand profitability, costs, and budget planning\n\n"
            "Please ask me about your pharmacy's business operations, and I'll provide data-driven insights to help you succeed!"
        )

    def _is_greeting_or_casual(self, prompt: str) -> bool:
        """Check if the prompt is a greeting or casual conversation."""
        greeting_keywords = {
            'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
            'how are you', 'what\'s up', 'greetings', 'nice to meet you'
        }
        prompt_lower = prompt.lower().strip()
        return any(keyword in prompt_lower for keyword in greeting_keywords)

    def _get_greeting_response(self, prompt: str) -> str:
        """Generate a professional greeting response."""
        return (
            "Hello! I'm Mesob AI, your intelligent business co-founder for pharmacy operations. "
            "I'm here to help you analyze your business data and provide actionable insights to grow your pharmacy.\n\n"
            "I can help you with:\n"
            "• Sales and revenue analysis\n"
            "• Inventory management and optimization\n"
            "• Staff performance tracking\n"
            "• Supplier relationship management\n"
            "• Financial planning and profitability insights\n\n"
            "What business challenge would you like to tackle today?"
        )

    def ask(self, prompt: str, scope: str, user_id: str | None) -> Dict[str, Any]:
        if not allow(scope=scope, identifier=user_id, limit_per_minute=settings.rate_limit_gemini_per_minute):
            return {"error": "rate_limited"}
        
        # Check if question is business-related
        if not self._is_business_related(prompt):
            return {"answer": self._get_out_of_scope_response(), "model": "business-filter"}
        
        if not self.is_configured():
            return {"answer": f"[Business Analysis Mode] Based on your question about: {prompt[:100]}..., I would analyze your pharmacy data to provide specific insights. Please configure Gemini API for full AI capabilities.", "model": "gemini-stub"}
        
        try:
            # Enhanced prompt with business context
            enhanced_prompt = f"{self.business_context}\n\nUser Question: {prompt}\n\nProvide a comprehensive business analysis with specific recommendations."
            
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{
                    "parts": [{"text": enhanced_prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.2,  # Slightly higher for more creative business insights
                    "maxOutputTokens": 2000,  # Increased for detailed business analysis
                    "topP": 0.9
                },
                "safetySettings": [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
                ]
            }
            
            response = requests.post(
                f"{self.base_url}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=45  # Increased timeout for complex analysis
            )
            
            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and data["candidates"]:
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"answer": content.strip(), "model": "gemini-1.5-flash-business"}
            
            return {"error": f"API error: {response.status_code}", "model": "gemini"}
            
        except Exception as e:
            return {"error": f"Request failed: {str(e)}", "model": "gemini"}

    def generate_business_insights(self, data: Dict[str, Any], intent: str) -> str:
        """Generate AI-powered business insights from data."""
        if not self.is_configured():
            return self._generate_fallback_insights(data, intent)
        
        insight_prompt = f"""
{self.business_context}

DATA ANALYSIS REQUEST:
Intent: {intent}
Data: {json.dumps(data, default=str)[:1500]}  # Limit data size

Provide a comprehensive business analysis including:
1. Key findings from the data
2. Business implications and risks
3. Specific actionable recommendations
4. Strategic next steps

Format your response with clear sections and bullet points for easy reading.
"""
        
        try:
            response = self.ask(insight_prompt, "business_insights", None)
            if "answer" in response:
                return response["answer"]
        except Exception:
            pass
        
        return self._generate_fallback_insights(data, intent)
    
    def _generate_fallback_insights(self, data: Dict[str, Any], intent: str) -> str:
        """Generate basic insights when AI is not available."""
        insights_map = {
            "revenue_analysis": "📈 **Revenue Insights**: Monitor daily trends and identify peak performance periods for strategic planning.",
            "inventory_management": "📦 **Inventory Insights**: Maintain optimal stock levels and implement automated reorder systems.",
            "staff_performance": "👥 **Team Insights**: Recognize top performers and provide targeted training for improvement.",
            "supplier_analysis": "🤝 **Supplier Insights**: Evaluate performance metrics and optimize procurement strategies."
        }
        
        return insights_map.get(intent, "💡 **Strategic Insights**: As your business co-founder, I recommend using this data to make informed decisions and accelerate growth.")
