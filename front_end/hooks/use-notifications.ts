"use client";

import { useState, useEffect } from "react";

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    // Mock unread count - replace with actual API call
    setUnreadCount(2);
  }, []);

  return { unreadCount };
}