import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { User } from 'src/interfaces/user.interface';
import { UserService } from 'src/modules/user/user.service';
import { encript } from 'src/utils/encription';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from './jwt.constant';

const logger = new Logger('auth.service');

@Injectable()
export class AuthService {
  private response: IResponse;

  // jwtService = new JwtService({
  //   secret: JWT_CONSTANT.secret,
  //   signOptions: { expiresIn: '1h' },
  // })

  constructor(
    @InjectModel('USER_MODEL') private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   *
   * 用户登录验证方法
   * @private
   * @param {User} user
   * @memberof AuthService
   */
  private async validateUser(user: User) {
    console.log(user)
    const phone: string = user.phone;
    const password: string = user.password;
    return await this.userService
      .findOneByPhone(phone)
      .then((res) => {
        if (res.length === 0) {
          this.response = { code: 3, msg: '用户未注册' };
          throw this.response;
        }
        return res[0];
      })
      .then((dbUser: User) => {
        const pass = encript(password, dbUser.salt);
        if (pass === dbUser.password) {
          return (this.response = { code: 0, msg: '登录成功' });
        } else {
          return (this.response = { code: 4, msg: '用户名密码错误' });
        }
      })
      .catch((err) => {
        return err;
      });
  }

  /**
   *
   * 用户登录
   * @param {User} user
   * @return {*}
   * @memberof AuthService
   */
  public async login(user: User) {
    return await this.validateUser(user).then(() => {
      return this.createToken(user);
    });
  }

  /**
   *
   * 注册方法
   * @param {User} user
   * @return {*}
   * @memberof UserService
   */
  public async regist(user: User) {
    return this.userService
      .findOneByPhone(user.phone)
      .then((res) => {
        if (res.length !== 0) {
          this.response = {
            code: 1,
            msg: '当前手机号已注册',
          };
          throw this.response;
        }
      })
      .then(async () => {
        try {
          const createUser = new this.userModel(user);
          console.log(createUser)
          await createUser.save();
          this.response = {
            code: 0,
            msg: '注册成功',
          };
          return this.response;
        } catch (error) {
          this.response = {
            code: 2,
            msg: '注册失败' + error,
          };
          throw this.response;
        }
      })
      .catch((err) => {
        logger.log(`${user.phone}:${err.msg}`);
        return this.response;
      });
  }

  /**
   *
   * 创建token
   * @private
   * @param {User} user
   * @return {*}
   * @memberof AuthService
   */
  private async createToken(user: User) {
    return await this.jwtService.sign(user);
  }
}
