import dbConnect from "@/lib/dbConnect";
import Notification from "@/model/Notification";
import redis from "@/lib/redis"; // optional for resetting unread counter


export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get("recipientId");

  if (!recipientId) {
    return new Response(JSON.stringify({ error: "Missing recipientId" }), { status: 400 });
  }

  let notifications = [];

  try {
 
    notifications = await Notification.find({ recipientId })
      .sort({ createdAt: -1 })
      .limit(10);


    return Response.json(notifications)

  } finally {
    const unreadIds = notifications
      .filter((notif) => !notif.isRead)
      .map((notif) => notif._id);

    if (unreadIds.length > 0) {
      await Notification.updateMany(
        { _id: { $in: unreadIds } },
        { isRead: true }
      );


      await redis.set(`notifications:unread:${recipientId}`, 0);
    }
  }
}
