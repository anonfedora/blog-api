import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Types} from "mongoose";
import * as mongoose from "mongoose";
export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;
    
    @Prop({ type: String, required: true })
    message: string;
    
    @Prop({ type: Boolean, default: false })
    isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
