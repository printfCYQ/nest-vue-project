import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kind } from 'src/interfaces/kind.interface';
import { IResponse } from 'src/interfaces/response.interface';

const logger = new Logger('kind.service')

@Injectable()
export class KindService {
    private response: IResponse;
    constructor(
        @InjectModel('KIND_MODEL') private readonly kindModel: Model<Kind>
    ) { }

    /**
     *
     * 创建分类
     */
    public async createKind(kind: Kind) {
        const createKind = new this.kindModel(kind)
        try {
            const data = await createKind.save()
            this.response = { code: 0, msg: { msg: '分类创建成功', kindId: data._id } }
        } catch (error) {
            logger.warn('项目创建失败' + error);
            this.response = { code: 6, msg: { msg: '分类创建失败' } }
        } finally {
            return this.response
        }
    }

        /**
     *
     * 查询All分类
     */
         public async findAllKind() {
            try {
                const data = await this.kindModel.find()
                this.response = { code: 0, msg: { msg: '查询成功', data: data } }
            } catch (error) {
                this.response = { code: 7, msg: { msg: '项目分类失败' } }
            } finally {
                return this.response
            }
        }
}
