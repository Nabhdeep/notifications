"use client";
import { useState } from "react";

export default function LikePage() {
  const [recipientId, setRecipientId] = useState("");
  const [likerName, setLikerName] = useState("");
  const [response, setResponse] = useState(null);

  const handleLike = async () => {
    const res = await fetch("/api/like", {
      method: "POST",
      body: JSON.stringify({ recipientId, likerName }),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Like a Post</h1>
      <input
        placeholder="Recipient ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <input
        placeholder="Your Name"
        value={likerName}
        onChange={(e) => setLikerName(e.target.value)}
      />
      <button onClick={handleLike}>Like</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
