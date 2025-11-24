"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Send, Bot, User, Sparkles, TrendingUp, Package, ShoppingCart, BarChart3 } from "lucide-react";
import { API_BASE } from "@/utils/api";

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
      content: "Hello! I'm Mesob AI, your business co-founder and advisor.\n\nI analyze your real business data and provide actionable insights to help you grow. Ask me about inventory, suppliers, sales trends, or any business challenge you're facing.\n\nWhat would you like to know about your business today?",
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
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id');
      const userId = localStorage.getItem('user_id');
      
      const res = await fetch(`${API_BASE}/ai/agent/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(tenantId ? { "X-Tenant-ID": tenantId } : {}),
          ...(userId ? { "X-User-ID": userId } : {}),
        },
        body: JSON.stringify({ message: content.trim() }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed with ${res.status}`);
      }
      
      const data = await res.json();
      const reply = data?.response || "Sorry, I couldn't process your request.";
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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