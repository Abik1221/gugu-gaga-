"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Bell, Package, Clock, AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, loading } = useNotifications();

    const handleMarkAsRead = async (id: number, isRead: boolean) => {
        if (!isRead) {
            await markAsRead(id);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "low_stock":
                return <Package className="h-5 w-5 text-amber-600" />;
            case "expiring_soon":
                return <Clock className="h-5 w-5 text-orange-600" />;
            case "expired":
                return <AlertTriangle className="h-5 w-5 text-red-600" />;
            case "subscription_expiring":
                return <Bell className="h-5 w-5 text-blue-600" />;
            default:
                return <Bell className="h-5 w-5 text-gray-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "low_stock":
                return "border-l-amber-500";
            case "expiring_soon":
                return "border-l-orange-500";
            case "expired":
                return "border-l-red-500";
            case "subscription_expiring":
                return "border-l-blue-500";
            default:
                return "border-l-gray-500";
        }
    };

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-sm text-muted-foreground">
                        Stay updated with your business alerts
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-sm">
                        {unreadCount} Unread
                    </Badge>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Loading notifications...</div>
                </div>
            ) : notifications.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                        <p className="text-sm text-muted-foreground">
                            You're all caught up! Check back later for updates.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={cn(
                                "border-l-4 transition-all hover:shadow-md cursor-pointer",
                                getNotificationColor(notification.type),
                                !notification.is_read && "bg-blue-50/50 dark:bg-blue-950/10"
                            )}
                            onClick={() => handleMarkAsRead(notification.id, notification.is_read)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="mt-0.5 flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2 flex-wrap">
                                                {notification.title}
                                                {!notification.is_read && (
                                                    <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
                                                )}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1.5 break-words">
                                                {notification.body}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span>
                                                    {formatDistanceToNow(new Date(notification.created_at), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                                {notification.is_read && (
                                                    <span className="flex items-center gap-1 text-emerald-600">
                                                        <Check className="h-3 w-3" />
                                                        Read
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
