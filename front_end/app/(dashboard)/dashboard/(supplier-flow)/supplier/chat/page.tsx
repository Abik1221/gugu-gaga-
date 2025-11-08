"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { Send, Bot, User, Sparkles, TrendingUp, Package, ShoppingCart, BarChart3 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const suggestedQuestions = [
  "What should I do about my low stock items?",
  "How can I improve my supplier relationships?",
  "Give me a strategy to increase revenue this month",
  "What's wrong with my inventory management?",
  "How do I optimize my product mix?",
  "What business risks should I be aware of?",
  "Give me 5 ways to improve my operations",
  "What opportunities am I missing?"
];

export default function SupplierAIChat() {
  const { show } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      content: "👋 **Hello! I'm Mesob AI - Your Business Co-Worker & Advisor**\n\nI don't just show you data - I tell you what to DO with it!\n\n🎯 **How I Help:**\n• Analyze your inventory, suppliers, and sales data\n• Provide specific business recommendations\n• Give you actionable steps to improve performance\n• Act as your 24/7 business consultant\n\n💡 **Ask me things like:**\n• \"What's my inventory status at [specific branch]?\"\n• \"How can I improve my supplier relationships?\"\n• \"What should I do about slow-moving products?\"\n• \"Give me a business strategy for next month\"\n\n**I'll give you the data AND the business advice to act on it!**\n\nWhat business challenge can I help you solve today?",
      sender: "ai",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateAIResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to send message",
        description: err?.message || "Unable to get AI response",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    return "🤖 **AI Business Advisor Response:**\n\nI'm your intelligent business co-worker! Here's what I do:\n\n📊 **Data Analysis + Business Advice**\n• Pull real data from your database (inventory, sales, suppliers)\n• Analyze trends, patterns, and performance metrics\n• Provide specific, actionable business recommendations\n• Give you immediate steps to improve your operations\n\n🎯 **Smart Business Insights:**\n• \"Your Branch A has low stock - here's what to order and when\"\n• \"Supplier X is underperforming - here's how to address it\"\n• \"Revenue is down 15% - here are 5 strategies to recover\"\n• \"These 3 products are expiring - here's your action plan\"\n\n💡 **I'm Like Having a Business Consultant 24/7:**\n• Ask about specific branches, products, or time periods\n• Get data-driven insights with clear next steps\n• Receive strategic advice tailored to your situation\n• Learn optimization strategies for growth\n\n**Try me with specific questions:**\n• \"What's happening with inventory at [branch name]?\"\n• \"How are my suppliers performing this quarter?\"\n• \"What should I do about declining sales?\"\n• \"Which products should I focus on promoting?\"\n\nI'll analyze your data AND tell you exactly what actions to take!";
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
          AI Business Assistant
        </h2>
        <p className="text-gray-600">Get intelligent insights about your supplier business</p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-600" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "ai" && (
                          <Bot className="h-4 w-4 mt-1 text-blue-600" />
                        )}
                        {message.sender === "user" && (
                          <User className="h-4 w-4 mt-1 text-white" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          <div className={`text-xs mt-1 ${
                            message.sender === "user" ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me about your business performance, inventory, customers..."
                    className="text-black"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Questions */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 text-xs"
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href="/dashboard/supplier/orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Manage Orders
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href="/dashboard/supplier/products">
                  <Package className="h-4 w-4 mr-2" />
                  Product Catalog
                </a>
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleSuggestedQuestion("Show my inventory levels and low stock items")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Inventory Status
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleSuggestedQuestion("Generate business overview report")}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Business Overview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}