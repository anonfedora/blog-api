import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ type: String, unique: true })
    name: string;

    @Prop()
    description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
