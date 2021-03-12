import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('用户模块')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class UserController {

  @Get('hello')
  hello() {
    return 'hello world';
  }
}
