"use client";

import { useState } from "react";
import { Bell, Package, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export function NotificationPanel() {
    const { notifications, unreadCount, markAsRead, loading } = useNotifications();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleNotificationClick = async (id: number, isRead: boolean) => {
        if (!isRead) {
            await markAsRead(id);
        }
    };

    const handleViewAll = () => {
        setOpen(false);
        router.push("/dashboard/owner/notifications");
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "low_stock":
                return <Package className="h-4 w-4 text-amber-600" />;
            case "expiring_soon":
                return <Clock className="h-4 w-4 text-orange-600" />;
            case "expired":
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            case "subscription_expiring":
                return <Bell className="h-4 w-4 text-blue-600" />;
            default:
                return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "low_stock":
                return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10";
            case "expiring_soon":
                return "border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/10";
            case "expired":
                return "border-l-red-500 bg-red-50/50 dark:bg-red-950/10";
            case "subscription_expiring":
                return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10";
            default:
                return "border-l-gray-500";
        }
    };

    // Show only recent 5 notifications in panel
    const recentNotifications = notifications.slice(0, 5);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 px-1 text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col">
                <SheetHeader className="p-4 pb-3 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg">Notifications</SheetTitle>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    {loading ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                            <p className="text-sm font-medium">No notifications</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                You're all caught up!
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {recentNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 border-l-4 transition-colors cursor-pointer hover:bg-muted/30",
                                        getNotificationColor(notification.type),
                                        !notification.is_read && "bg-blue-50/30 dark:bg-blue-950/20"
                                    )}
                                    onClick={() =>
                                        handleNotificationClick(notification.id, notification.is_read)
                                    }
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-semibold text-sm">
                                                    {notification.title}
                                                </h4>
                                                {!notification.is_read && (
                                                    <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {notification.body}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-2">
                                                {formatDistanceToNow(new Date(notification.created_at), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="p-3 border-t bg-muted/20">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleViewAll}
                        >
                            View All Notifications
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
