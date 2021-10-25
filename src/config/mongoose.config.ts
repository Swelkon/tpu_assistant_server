import {
  MongooseModuleAsyncOptions,
} from '@nestjs/mongoose';
require('dotenv/config')

export const mongooseConfig: MongooseModuleAsyncOptions = {
  useFactory: () => ({
    uri: process.env.DB_CONNECTION,
  }),
};
