### 文件上传

#### nestjs

- main.ts

```
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Log4jsLogger } from '@nestx-log4js/core';
import { AppModule } from './app.module';

const listenPort = 3000;

const logger = new Logger('main.ts');

/**
 *主方法
 */
const bootstrap = async () => {
  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  /**
   * Swagger
   */
  const config = new DocumentBuilder()
    .setTitle('项目管理平台11')
    .setDescription('cyq-项目管理平台-接口文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addTag('Apis')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   * Log4
   */
  app.useLogger(app.get(Log4jsLogger));

  /**允许跨域 */
  app.enableCors()

  // 静态文件托管
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  await app.listen(listenPort);
};
bootstrap().then(() => {
  logger.log(`http://localhost:${listenPort}`);
  logger.log(`http://localhost:${listenPort}/api`);
});

```

- app.module.ts

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Log4jsModule } from '@nestx-log4js/core';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    Log4jsModule.forRoot(),
    MulterModule.register({
      // 本地存储
      dest: 'uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

- app.controller.ts

```
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('app 总模块')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile('file') file) {
    // 云储存
    // return file
    console.log(file)
    // 本地存储
    return {
      url: `http://localhost:3000/uploads/${file.filename}`,
    };
  }
}

```

#### vue-elementUI

```
<el-upload
    class="avatar-uploader"
    action="http://localhost:3000/upload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
>
    <img
    v-if="ruleForm.imageUrl"
    :src="ruleForm.imageUrl"
    class="avatar"
    />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>


handleAvatarSuccess(res, file) {
    console.log(res, file);
    this.ruleForm.imageUrl = res.url;
},
beforeAvatarUpload(file) {
    console.log(file);
},
```
