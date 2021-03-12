import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { User } from 'src/interfaces/user.interface';

const logger = new Logger('user.service');

@Injectable()
export class UserService {
  private response: IResponse;
  constructor(
    @InjectModel('USER_MODEL') private readonly userModel: Model<User>,
  ) {}



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
}
