import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWT_CONSTANT } from './jwt.constant';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
    }),
  ],
  providers: [AuthService, UserService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
