import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/interfaces/project.interface';
import { IResponse } from 'src/interfaces/response.interface';

const logger = new Logger('project.service')

@Injectable()
export class ProjectService {
    private response: IResponse;
    constructor(
        @InjectModel('PROJECT_MODEL') private readonly projectModel: Model<Project>
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
            const data = await createProject.save()
            this.response = { code: 0, msg: { msg: '项目创建成功', projectId: data._id } }
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
     * 查询项目
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
    public async findAllProject() {
        try {
            const data = await this.projectModel.find()
            this.response = { code: 0, msg: { msg: '查询成功', data: data } }
        } catch (error) {
            this.response = { code: 7, msg: { msg: '项目查询失败' } }
        } finally {
            return this.response
        }
    }
}
