import redis from "@/lib/redis"
import { Queue } from "bullmq";

export const notifQueue = new Queue('notifications', { connection: redis });

