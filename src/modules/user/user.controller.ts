import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('用户模块')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private userSerive: UserService) { }

  @Get('hello')
  hello() {
    return this.userSerive.hello();
  }

  @Post('findUserById/:id')
  @ApiOperation({
    summary: '查询用户'
  })
  findOneById(@Param("id") userid: string) {
    return this.userSerive.findOneById(userid);
  }
}
