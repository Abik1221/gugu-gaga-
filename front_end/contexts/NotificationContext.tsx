"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { NotificationsAPI, Notification } from "@/utils/api";

interface NotificationContextValue {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    refreshNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const refreshNotifications = async () => {
        if (!user?.tenant_id) return;
        setLoading(true);
        try {
            const data = await NotificationsAPI.list(user.tenant_id);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);

            // Update PWA badge
            if ('setAppBadge' in navigator) {
                const count = data.filter(n => !n.is_read).length;
                if (count > 0) {
                    (navigator as any).setAppBadge(count);
                } else {
                    (navigator as any).clearAppBadge();
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        if (!user?.tenant_id) return;
        try {
            await NotificationsAPI.markRead(user.tenant_id, id);
            await refreshNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    useEffect(() => {
        refreshNotifications();
        // Poll every 30 seconds
        const interval = setInterval(refreshNotifications, 30000);
        return () => clearInterval(interval);
    }, [user?.tenant_id]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                refreshNotifications,
                markAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
}
