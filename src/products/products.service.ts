import {Injectable, NotFoundException} from "@nestjs/common";
import {Product, ProductDocument} from "./products.model";
import {InjectModel} from "@nestjs/mongoose"
import {Model} from "mongoose";

@Injectable()
export class ProductService {
    private products: Product[] = [];

    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {
    }

    async insertProduct(title: string, desc: string, price: number) {
        const newProduct = new this.productModel({
            title: title,
            description: desc,
            price: price
        });
        const result = await newProduct.save();
        console.log(result)
        return ""
    }

    getProducts() {
        return [...this.products];
    }

    getSingleProduct(productId: string) {
        const product = this.findProduct(productId)[0];
        return {...product};
    }

    updateProduct(productId: string, title: string, desc: string, price: number) {
        const [product, productIndex] = this.findProduct(productId);
        const updatedProduct = {...product};
        if (title) {
            updatedProduct.title = title
        }
        if (desc) {
            updatedProduct.description = desc
        }
        if (price) {
            updatedProduct.price = price
        }
        this.products[productIndex] = updatedProduct
    }

    removeProduct(productId: string) {
        const index = this.findProduct(productId)[1];
        this.products.splice(index, 1)
    }


    private findProduct(id: string): [Product, number] {
        const productIndex = this.products.findIndex((prod) => prod.id === id)
        const product = this.products[productIndex]
        if (!product) {
            throw new NotFoundException('Could not find product')
        }
        return [product, productIndex]
    }

}
