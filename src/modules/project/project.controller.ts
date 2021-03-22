import { Body, UseGuards, Controller, Param, Post, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Project } from 'src/interfaces/project.interface';
import { ProjectService } from './project.service';

@Controller('project')
@ApiTags('用户项目管理模块')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class ProjectController {

    constructor(
        private readonly projectService: ProjectService
    ) { }

    @Post('create')
    @ApiOperation({
        summary: '新增项目'
    })
    public addProject(@Body() project: Project) {
        return this.projectService.createProject(project)
    }

    @Post('delete/:id')
    @ApiOperation({
        summary: '删除项目'
    })
    public removeProject(@Param('id') projectId: string) {
        return this.projectService.deleteProject(projectId)
    }

    @Post('alter/:id')
    @ApiOperation({
        summary: '修改项目'
    })
    public updateProject(@Param('id') projectId: string, @Body() project: Project) {
        return this.projectService.alterProject(projectId, project)
    }

    @Post('find/:id')
    @ApiOperation({
        summary: '查询项目byid'
    })
    public findProject(@Param('id') projectId: string) {
        return this.projectService.findProject(projectId)
    }

    @Get('findAll')
    @ApiOperation({
        summary: '查询All项目'
    })
    public findProjectAll() {
        return this.projectService.findProjectAll()
    }


    @Post('findByKind/:id')
    @ApiOperation({
        summary: '按分类查询'
    })
    public findByKind(@Param('id') kindId: string) {
        return this.projectService.findProjectByKind(kindId)
    }

    @Post('findProjectByKindPage/:id')
    @ApiOperation({
        summary: '按分类查询(分类)(分页)'
    })
    public findByKindPage(@Param('id') kindId: string, @Body() pageObj: any) {
        return this.projectService.findProjectByKindPage(kindId, pageObj)
    }



    @Post('getProjectsByUser/:id')
    @ApiOperation({
        summary: '获取当前用户的所有项目'
    })
    public getProjectsByUser(@Param('id') userid: string, @Body() pageObj: any) {
        return this.projectService.getProjectsByUser(userid, pageObj)
    }
}
