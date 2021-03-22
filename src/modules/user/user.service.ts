import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'nestjs-redis';
import { IResponse } from 'src/interfaces/response.interface';
import { IUserProject, User } from 'src/interfaces/user.interface';
import * as Redis from 'ioredis';
@Injectable()
export class UserService {
  private response: IResponse;
  private redis: Redis.Redis;
  constructor(
    @InjectModel('USER_MODEL') private readonly userModel: Model<User>,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient('management');
  }

  /**
   *
   * 根据手机号查用户
   * @private
   * @param {string} phone
   * @return {*}
   * @memberof UserService
   */
  public async findOneByPhone(phone: string) {
    return await this.userModel.find({
      phone,
    });
  }

  public async findOneById(userid: string) {
    try {
      const data = await this.userModel.findById(userid)
      this.response = { code: 0, msg: { msg: '查询成功', data } }
    } catch (error) {
      this.response = { code: 7, msg: { msg: '查询失败' } }
    } finally {
      return this.response
    }
  }

  public async hello() {
    //  return await this.redis.set('management', 'hello world');
    return {
      code: 0,
      msg: 'hello world',
    };
  }

  public async addUserProject(projectId, userid) {
    const user: User = await this.userModel.findById(userid)

    const userPorject: IUserProject = {
      projectId,
      identity: '项目经理'
    }

    user.projects.push(userPorject)
    await this.userModel.findByIdAndUpdate(userid, user)
  }
}
