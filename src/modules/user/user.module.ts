import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashPasswordMiddleware } from 'src/middlewares/hash-password.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes('user');
  }
}
