import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/interfaces/project.interface';
import { IResponse } from 'src/interfaces/response.interface';
import { UserService } from '../user/user.service';

const logger = new Logger('project.service')

@Injectable()
export class ProjectService {
    private response: IResponse;
    constructor(
        @InjectModel('PROJECT_MODEL') private readonly projectModel: Model<Project>,
        private readonly userService: UserService,
    ) { }

    /**
     *
     * 创建项目
     * @param {Project} project
     * @return {*} 
     * @memberof ProjectService
     */
    public async createProject(project: Project) {
        const createProject = new this.projectModel(project)
        try {
            const project = await createProject.save()
            this.userService.addUserProject(project._id, project.createrId)
            this.response = { code: 0, msg: { msg: '项目创建成功', projectId: project._id } }
        } catch (error) {
            logger.warn('项目创建失败' + error);
            this.response = { code: 6, msg: { msg: '项目创建失败' } }
        } finally {
            return this.response
        }
    }

    /**
     *
     * 删除项目
     * @param {string} projectId
     * @return {*} 
     * @memberof ProjectService
     */
    public async deleteProject(projectId: string) {
        try {
            await this.projectModel.findByIdAndDelete(projectId)
            this.response = { code: 0, msg: { msg: '项目删除成功' } }
        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目删除失败' } }
        } finally {
            return this.response
        }
    }

    /**
     *
     * 修改项目
     */
    public async alterProject(projectId: string, project: Project) {
        try {
            await this.projectModel.findByIdAndUpdate(projectId, project)
            this.response = { code: 0, msg: { msg: '项目修改成功' } }
        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目修改失败' } }
        } finally {
            return this.response
        }
    }

    /**
     *
     * 查询项目(byId)
     */
    public async findProject(projectId: string) {
        try {
            const data = await this.projectModel.findById(projectId)
            this.response = { code: 0, msg: { msg: '查询成功', data } }
        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目查询失败' } }
        } finally {
            return this.response
        }
    }

    /**
     *
     * 查询All项目
     */
    public async findProjectAll() {
        try {
            const data = await this.projectModel.find()
            this.response = { code: 0, msg: { msg: '查询成功', data: data } }
        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目查询失败' } }
        } finally {
            return this.response
        }
    }


    /**
     *
     * 按分类查询项目
     */
    public async findProjectByKind(kind: string) {
        try {
            const data = await this.projectModel.find().where({
                kind: kind,
            })
            this.response = { code: 0, msg: { msg: '查询成功', data: data } }
        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目查询失败' } }
        } finally {
            return this.response
        }
    }


    /**
     *
     * 查询所有项目(分页)(分类)
     */
    public async findProjectByKindPage(kind: string = '0', pageObj: any) {
        let total: number = 0;

        if (pageObj) {
            var skip = (pageObj.currentPage - 1) * pageObj.pageSize
            var limit = pageObj.pageSize
        }
        try {
            if (kind === '0') {
                total = (await this.findProjectAll()).msg.data.length
                const data = (await this.projectModel.find().skip(skip).limit(limit).sort({
                    _id: -1,
                })).map(v => {
                    const date: Date = v._id.getTimestamp();
                    v['date'] = date.toLocaleString()
                    return v
                })
                this.response = { code: 0, msg: { msg: '查询成功', data: data, total: total } }
            } else {
                total = (await this.findProjectByKind(kind)).msg.data.length
                const data = (await this.projectModel.find().skip(skip).limit(limit).sort({
                    _id: -1,
                }).where({
                    kind: kind,
                })).map(v => {
                    const date: Date = v._id.getTimestamp();
                    v['date'] = date.toLocaleString()
                    return v
                })
                this.response = { code: 0, msg: { msg: '查询成功', data: data, total: total } }
            }

        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目查询失败' } }
        } finally {
            return this.response
        }
    }

    /**获取当前用户的所有项目 */

    public async getProjectsByUser(userid: string, pageObj: any) {
        var skip = (pageObj.currentPage - 1) * pageObj.pageSize
        var limit = pageObj.pageSize
        let total: number = 0;
        const identities = {}
        let projects: Array<Project>
        try {
            const user = await this.userService.findOneById(userid)
            const projectIds = user.msg.data.projects.map(v => {
                identities[v.projectId] = v.identity
                return v.projectId
            })
            total = (await this.projectModel.find({ _id: { $in: projectIds } })).length
            projects = await this.projectModel.find({ _id: { $in: projectIds } }).skip(skip).limit(limit).sort({
                _id: -1,
            })

        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目查询失败' } }
        }
        projects = projects.map(v => {
            const date: Date = v._id.getTimestamp();
            v['date'] = date.toLocaleString()
            v['identity'] = identities[v._id]
            return v
        })
        this.response = { code: 0, msg: { msg: '查询成功', data: projects, total } }
        return this.response

    }

}
