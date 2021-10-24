import {Controller, Post, Body, Get, Param, Patch, Delete} from "@nestjs/common";
import {ProductService} from "./products.service";

@Controller('/products')
export class ProductsController {
    constructor(private readonly productsService: ProductService) {
    }

    @Post()
    addProduct(
        // @Body() body: {title: string, description: string, price: number},
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number
    ): any {
        const generatedId = this.productsService.insertProduct(prodTitle, prodDesc, prodPrice);
        return {id: generatedId};
    }

    @Get()
    getAllProducts() {
        return this.productsService.getProducts();

    }

    @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.productsService.getSingleProduct(prodId)
    }

    @Patch(':id')
    updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number) {
        this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice)
        return null
    }

    @Delete(':id')
    removeProduct(
        @Param('id') prodId: string
    ) {
        this.productsService.removeProduct(prodId)
        return null
    }
}