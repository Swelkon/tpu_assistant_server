import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
require('dotenv/config')

export const mongooseConfig: MongooseModuleAsyncOptions = {
  useFactory: () => ({
    uri: process.env.DB_CONNECTION,
  }),
};
