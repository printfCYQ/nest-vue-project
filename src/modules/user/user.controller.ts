import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('用户模块')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('hello')
  hello() {
    return 'hello world';
  }
}
