import { db } from "@/lib/db";

interface NotificationPayload {
  userId: string;
  event: "WIRE_INITIATED" | "SECURITY_ALERT" | "DEPOSIT_RECEIVED";
  title: string;
  message: string;
}

export async function dispatchNotification({ userId, event, title, message }: NotificationPayload) {
  try {
    await db.notification.create({
      data: {
        userId,
        title,
        message,
        isRead: false,
      },
    });

    console.log(`[Notification Dispatched] Event: ${event} for User: ${userId}`);
  } catch (error) {
    console.error("Error dispatching notification:", error);
  }
}