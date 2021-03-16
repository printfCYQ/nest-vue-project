import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('alter')
  @ApiOperation({
    summary: '用户修改密码',
  })
  async alterUser(@Body() userDto: User) {
    return await this.authService.alter(userDto);
  }

  @Get('captcha/:id')
  @ApiOperation({
    summary: '获取注册验证码',
  })
  async getCaptcha(@Param("id") id:string){
    return await this.authService.createCaptcha(id);
  }

  @Post('captcha')
  @ApiOperation({
    summary: '验证注册验证码',
  })
  async verify(@Body() captcha:{captcha:string,id:string}){
    return await this.authService.verification(captcha.captcha,captcha.id);

  }
}
