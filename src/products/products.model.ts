import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose"

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    @Prop({required: true})
    title: string;

    @Prop()
    description: string;

    @Prop({required: true})
    price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// export const ProductSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: String,
//     price: Number
// })


export interface Product {
    id: string,
    title: string,
    description: string,
    price: number
}

// export class Product {
//
//     constructor(
//         public id: string,
//         public title: string,
//         public description: string,
//         public price: number
//     ) { }
//
// }

// export class Product{
//     id: string;
//     title: string;
//     description: string;
//     price: number;
//
//     constructor(id: string, title: string, desc: string, price: number) {
//         this.id = id;
//         this.title = title;
//         this.description = desc;
//         this.price = price;
//     }
// }
