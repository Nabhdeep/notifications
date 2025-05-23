import { notifQueue } from "@/lib/queue";



export async function POST(req) {
  const { recipientId, likerName } = await req.json();

  if (!recipientId || !likerName) {
    return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
  }

  await notifQueue.add('sendNotification', { recipientId, likerName });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}













// export async function POST(req) {
//   await dbConnect();
//   const { recipientId, likerName } = await req.json();

//   if (!recipientId || !likerName) {
//     return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
//   }

//   const message = `${likerName} liked your post!`;
//   const newNotification = await Notification.create({ recipientId, message });

//   await redis.incr(`notifications:unread:${recipientId}`);

//   return new Response(JSON.stringify(newNotification), { status: 201 });
// }


