import { Schema, Document } from "mongoose";

export interface Notification extends Document {
    userId: string;
    message: string;
    createdAt: Date;
    isRead: boolean;
}

export const NotificationSchema = new Schema<Notification>({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});