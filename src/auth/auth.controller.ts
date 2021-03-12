import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/interfaces/user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  public async userLogin(@Body() userDto: User) {
    return await this.authService.login(userDto);
  }

  @Post('regist')
  @ApiOperation({
    summary: '用户注册',
  })
  async registUser(@Body() userDto: User) {
    return await this.authService.regist(userDto);
  }
}
