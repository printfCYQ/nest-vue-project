import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Kind } from 'src/interfaces/kind.interface';
import { KindService } from './kind.service';


@Controller('kind')
@ApiTags('项目分类管理模块')
export class KindController {
    constructor(
        private readonly kindService: KindService
    ) { }

    @Post('create')
    @ApiOperation({
        summary: '新增分类'
    })
    public addKind(@Body() kind: Kind) {
        return this.kindService.createKind(kind)
    }

    @Get('findAll')
    @ApiOperation({
        summary: '查询All分类'
    })
    public findAllProject() {
        return this.kindService.findAllKind()
    }
}
