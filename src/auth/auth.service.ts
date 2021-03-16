import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { User } from 'src/interfaces/user.interface';
import { UserService } from 'src/modules/user/user.service';
import { encript } from 'src/utils/encription';
import { JwtService } from '@nestjs/jwt';
var svgCaptcha = require('svg-captcha')
const logger = new Logger('auth.service');

@Injectable()
export class AuthService {
  private response: IResponse;
  private pointer: number = 0
  private captchas = {}
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
          return (this.response = { code: 0, msg: { userid: dbUser._id } });
        } else {
          return (this.response = { code: 4, msg: '用户名密码错误' });
        }
      })
      .catch((err) => {
        console.log(err);
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
    return await this.validateUser(user)
      .then(async (res: IResponse) => {
        if (res.code !== 0) {
          this.response = res;
          throw this.response;
        }
        const userid = res.msg.userid;
        this.response = {
          code: 0,
          msg: {
            token: await this.createToken(user),
            userid,
          },
        };
        return this.response;
      })
      .catch((err) => {
        return err;
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
   * 用户修改密码
   * @param {User} user
   * @return {*}
   * @memberof AuthService
   */
  public async alter(user: User) {
    return this.userService.findOneByPhone(user.phone).then(async () => {
      return await this.userModel
        .findOneAndUpdate({ phone: user.phone }, user, {}, () => {
          logger.log(`用户${user.phone}修改密码成功`);
        })
        .then(() => {
          return (this.response = {
            code: 0,
            msg: '密码修改成功',
          });
        });
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


  /**
   * 创建验证码
   * @param id 
   * @returns 
   */
  public async createCaptcha(id:string){
    if(id !== '-1'){
      delete this.captchas[id]
      console.log(`删除了id为${id}的记录`)
    }
    const c = svgCaptcha.create()
    this.captchas[this.pointer] = c.text
    this.response  = {
      code:0,
      msg:{
        id:this.pointer++,
        img:c.data
      }
    }
    return this.response
  }

  public async verification(captcha:string,id:string){
    console.log(captcha,id)
    console.log(this.captchas[id])
    if(this.captchas[id].toLocaleLowerCase() === captcha.toLocaleLowerCase()) {
      this.response = {code:0,msg:'验证通过'}
      return this.response
    }else{
      this.response = {code:5,msg:'验证码错误'}
      return this.response
    }
  }
}
