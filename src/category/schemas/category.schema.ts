import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AbstractDocument } from "src/abstract.schema";
import { staticObject } from "../../types";

@Schema({timestamps: true, versionKey: false})
export class Category extends AbstractDocument {
    @Prop({unique: [true, 'Duplicate title entered!']})
    title: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    parent: Category;

    @Prop({ default: staticObject.Live})
    status: staticObject;
}

export const CategorySchema = SchemaFactory.createForClass(Category);