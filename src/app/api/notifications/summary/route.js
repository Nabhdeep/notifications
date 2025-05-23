import redis from "@/lib/redis";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get("recipientId");

  if (!recipientId) {
    return new Response(JSON.stringify({ error: "Missing recipientId" }), { status: 400 });
  }
  const unreadCount = await redis.get(`notifications:unread:${recipientId}`) || 0;
  return new Response(JSON.stringify({ unreadCount: Number(unreadCount)}), {
    status: 200,
  });
}
