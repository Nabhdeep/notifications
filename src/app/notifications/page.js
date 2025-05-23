"use client";
import { useState } from "react";

export default function NotificationsPage() {
  const [recipientId, setRecipientId] = useState("");
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await fetch(`/api/notifications?recipientId=${recipientId}`);
    const data = await res.json();
    setNotifications(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Notifications</h1>
      <input
        placeholder="Recipient ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <button onClick={fetchNotifications}>Fetch Notifications</button>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id}>
            {notif.message} — {new Date(notif.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
