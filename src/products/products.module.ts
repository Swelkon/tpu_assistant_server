import {Module} from '@nestjs/common';
import {ProductsController} from './products.controller';
import {ProductService} from './products.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Product, ProductSchema} from './products.model';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}]),
    ],
    controllers: [ProductsController],
    providers: [ProductService],
})
export class ProductsModule {
}
