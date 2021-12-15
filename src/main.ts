import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule} from "@nestjs/swagger";
import {UsersModule} from "./users/users.module";
import {RaspModule} from "./rasp/rasp.module";
import {QuestionsModule} from "./questions/questions.module";
import {ChannelPostsModule} from "./channels/channel.posts.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // var whitelist = ['https://t.me', 'https://www.website.com', 'http://85.143.78.60'];
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

  const config = new DocumentBuilder()
      .setTitle('Телеграм чат-бот Ассистент ТПУ')
      .setDescription('Серверная часть телеграм-бота')
      .setVersion('1.0')
      .addTag('users')
      .build();
  const options: SwaggerDocumentOptions = {
    include: [UsersModule, RaspModule, QuestionsModule, ChannelPostsModule],
    deepScanRoutes: true
  }
  const document = SwaggerModule.createDocument(app, config, options);


  SwaggerModule.setup('swagger', app, document);


  await app.listen(process.env.PORT || 3000);
}
bootstrap();
