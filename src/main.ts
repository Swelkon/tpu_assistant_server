import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  var whitelist = ['https://t.me', 'https://www.website.com'];
  // app.enableCors({
  //   // origin: "https://t.me/tpu_assistant_bot",
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       console.log("allowed cors for:", origin)
  //       callback(null, true)
  //     } else {
  //       console.log("blocked cors for:", origin)
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   },
  //   allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  //   methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
  //   // credentials: true,
  // });
  await app.listen(3000);
}
bootstrap();
