"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Bell, AlertTriangle, Package, CheckCircle } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export default function StaffNotifications() {
  const { show } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock notifications based on backend notification types
      const mockNotifications: Notification[] = [
        {
          id: 1,
          type: "low_stock",
          title: "Low Stock Alert",
          body: "Paracetamol 500mg stock is low (qty=25, reorder_level=50).",
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          type: "low_stock",
          title: "Low Stock Alert", 
          body: "Ibuprofen 200mg stock is low (qty=15, reorder_level=40).",
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          type: "system",
          title: "System Update",
          body: "POS system has been updated with new features.",
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to load notifications",
        description: err?.message || "Unable to fetch notifications",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      // Simulate API call
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      show({
        variant: "success",
        title: "Marked as read",
        description: "Notification marked as read",
      });
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to mark as read",
        description: err?.message || "Unable to update notification",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      show({
        variant: "success",
        title: "All marked as read",
        description: "All notifications marked as read",
      });
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to mark all as read",
        description: err?.message || "Unable to update notifications",
      });
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "system":
        return <Bell className="w-5 h-5 text-blue-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border p-4 ${
                !notification.is_read ? "border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        !notification.is_read ? "text-gray-900" : "text-gray-600"
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        !notification.is_read ? "text-gray-700" : "text-gray-500"
                      }`}>
                        {notification.body}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {!notification.is_read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={loadNotifications} variant="outline">
          Refresh Notifications
        </Button>
      </div>
    </div>
  );
}