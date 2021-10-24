import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {mongooseConfig} from './config/mongoose.config';
import {ProductsModule} from "./products/products.module";
import {UsersModule} from "./users/users.module";

@Module({
    imports: [ProductsModule, MongooseModule.forRootAsync(mongooseConfig), UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
