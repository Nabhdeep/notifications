// workers/notificationWorker.js
import { Worker } from 'bullmq';
import dbConnect from "../lib/dbConnect.js";
import Notification from '../model/Notification.js';
import redis from '../lib/redis.js';


export const worker = new Worker('notifications', async job => {
  const { recipientId, likerName } = job.data;
  await dbConnect();

  const message = `${likerName} liked your post!`;
  await Notification.create({ recipientId, message });
  await redis.incr(`notifications:unread:${recipientId}`);
}, {
  connection: redis
});

console.log('Notification worker running...');


