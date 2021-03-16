import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWT_CONSTANT } from './jwt.constant';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';
import { HashPasswordMiddleware } from 'src/middlewares/hash-password.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HashPasswordMiddleware)
      .forRoutes('auth/regist')
      .apply(HashPasswordMiddleware)
      .forRoutes('auth/alter');
  }
}
