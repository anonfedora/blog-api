import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    userId: { type: String; required: true };
    message: { type: String; required: true };
    isRead: { type: Boolean; default: false };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
