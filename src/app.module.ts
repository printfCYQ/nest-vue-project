import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { Log4jsModule } from '@nestx-log4js/core';
import { AuthModule } from './auth/auth.module';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
import { ProjectModule } from './modules/project/project.module';
import { KindModule } from './modules/kind/kind.module';

const options: RedisModuleOptions = {
  port: 6379,
  name: 'management',
  host: '127.0.0.1',
};

@Module({
  imports: [
    DbModule,
    UserModule,
    Log4jsModule.forRoot(),
    AuthModule,
    RedisModule.register(options),
    ProjectModule,
    KindModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
