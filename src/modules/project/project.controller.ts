import { Body, UseGuards, Controller, Param, Post, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Project } from 'src/interfaces/project.interface';
import { ProjectService } from './project.service';

@Controller('project')
@ApiTags('用户项目管理模块')
@UseGuards(AuthGuard('jwt'))
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
        summary: '查询项目'
    })
    public findProject(@Param('id') projectId: string) {
        return this.projectService.findProject(projectId)
    }

    @Get('findAll')
    @ApiOperation({
        summary: '查询All项目'
    })
    public findAllProject() {
        return this.projectService.findAllProject()
    }
}
