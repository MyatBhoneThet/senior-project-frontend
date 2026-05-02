import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../utils/apiPaths';
import { UserContext } from './UserContext';
import { getStoredToken } from '../utils/authSession';

export const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  const { user } = useContext(UserContext) || {};
  const userId = user?.id || user?._id || null;
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({ unreadNotifications: 0, unreadMessages: 0 });
  const [latestNotification, setLatestNotification] = useState(null);

  const refreshUnreadCounts = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.DEBTS.UNREAD_COUNTS);
      setUnreadCounts({
        unreadNotifications: Number(data?.data?.unreadNotifications || 0),
        unreadMessages: Number(data?.data?.unreadMessages || 0),
      });
    } catch {
      // ignore: surface can still work without counts
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token || !userId) {
      socketRef.current?.disconnect?.();
      socketRef.current = null;
      setConnected(false);
      setUnreadCounts({ unreadNotifications: 0, unreadMessages: 0 });
      return;
    }

    const socket = io(BASE_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      refreshUnreadCounts();
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('notification:new', (notification) => {
      setLatestNotification(notification || null);
      setUnreadCounts((prev) => ({
        ...prev,
        unreadNotifications: prev.unreadNotifications + 1,
      }));
    });

    socket.on('conversation:update', () => {
      refreshUnreadCounts();
    });

    socket.on('chat:message', () => {
      refreshUnreadCounts();
    });

    socket.on('debt:updated', () => {
      refreshUnreadCounts();
    });

    return () => {
      socket.off();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [userId, refreshUnreadCounts]);

  const value = useMemo(() => ({
    socket: socketRef.current,
    connected,
    unreadCounts,
    latestNotification,
    refreshUnreadCounts,
  }), [connected, unreadCounts, latestNotification, refreshUnreadCounts]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
