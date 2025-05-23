import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  recipientId: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
