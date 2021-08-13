import { Controller, Get, Post, UploadedFile, UseInterceptors,UploadedFiles,Body } from '@nestjs/common';
import { FileInterceptor,FilesInterceptor  } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import multer = require('multer');

@Controller()
@ApiTags('app 总模块')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: '测试接口',
  })
  getHello(): string {
    return this.appService.getHello();
  }


  // 保存文件--随机名称
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile('file') file) {
    // 云储存
    // return file
    console.log(file)
    // 本地存储
    return {
      url: `http://localhost:3000/uploads/${file.filename}`,
    };
  }


  // 保存文件原始名
  @Post('upload1')
  @UseInterceptors(FileInterceptor('file', {
      storage: multer.diskStorage({
          destination: (req, file, cb) => {
              cb(null, 'E:/CYQ/nest-vue-project/uploads/');
          },
          filename: (req, file, cb) => {
              cb(null, file.originalname);
          },
      }),
  }))
  async uploade(@UploadedFile() file) {
    console.log('123',file)
    file.url = `http://localhost:3000/uploads/${file.filename}`
    return file;
  }



  getToday() {
    const Dates = new Date();
    //年份
    const Year: number = Dates.getFullYear();
    //月份下标是0-11
    const Months: any =
      Dates.getMonth() + 1 < 10
        ? '0' + (Dates.getMonth() + 1)
        : Dates.getMonth() + 1;
    //具体的天数
    const Day: any =
      Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    //返回数据格式
    return Year + '-' + Months + '-' + Day;
  }

}
