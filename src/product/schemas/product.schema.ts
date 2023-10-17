import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";
import { AbstractDocument } from "../../abstract.schema";
import { Category } from "../../category/schemas/category.schema";
import { IEndpoint } from "../interfaces/endpoint.interface";
import { staticObject } from "../../types";


@Schema({timestamps: true, versionKey: false})
export class Product extends AbstractDocument {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category_id: Category;

    @Prop({unique: [true, 'Duplicate title entered!']})
    title: string

    @Prop()
    description: string;

    @Prop()
    author_id: mongoose.Schema.Types.ObjectId;

    @Prop() 
    price: number;

    @Prop()
    documentation: string;

    @Prop()
    version: string;

    @Prop({default: staticObject.Live})
    status: string

    @Prop({default: false})
    isPublic: boolean;

    @Prop()
    host: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    endpoint: IEndpoint;
}

export const ProductSchema = SchemaFactory.createForClass(Product);