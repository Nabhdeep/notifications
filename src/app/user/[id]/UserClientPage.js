'use client';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

export default function UserClientPage({ userId }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/notifications/summary?recipientId=${userId}`);
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };
    fetchSummary();
  }, [userId]);

  
  useEffect(() => {
    if(userId){
      const socketConnection = io('http://0.0.0.0:4000');
      socketConnection.emit('join', userId);
      socketConnection.on('notification:summary', ({ unreadCount }) => {
        setUnreadCount(unreadCount);
      });

      return () => {
        socketConnection.disconnect(); 
      };
    }
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?recipientId=${userId}`);
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(0); 
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    const toggled = !show;
    setShow(toggled);
    if (toggled) fetchNotifications();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>User Page: {userId}</h1>

      <button onClick={handleBellClick} style={{ fontSize: 24 }}>
        🔔 {unreadCount > 0 ? `(${unreadCount})` : ''}
      </button>

      {show && (
        <ul style={{ background: 'black', padding: 10, marginTop: 10 }}>
          {loading ? (
            <li>Loading notifications...</li>
          ) : notifications.length === 0 ? (
            <li>No new notifications.</li>
          ) : (
            notifications.map((notif, i) => (
              <li key={i}>
                {notif.message} — {new Date(notif.createdAt).toLocaleString()}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
