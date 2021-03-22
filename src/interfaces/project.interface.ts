import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop()
  @ApiProperty({
    description: '项目名称',
    example: '炸学校',
  })
  readonly name: string;

  @Prop()
  @ApiProperty({
    description: '创建日期',
    example: '2021/3/14 下午2:02:06',
  })
  date: string;

  @Prop()
  @ApiProperty({
    description: '项目简介',
    example: '炸炸炸炸',
  })
  readonly description: string;

  @Prop()
  @ApiProperty({
    description: '项目分类',
    example: '前端',
  })
  readonly kind: string;

  @Prop()
  @ApiProperty({
    description: '创建者id',
    example: '123',
  })
  readonly createrId: string;

  @Prop()
  @ApiProperty({
    description: '地址',
    example: 'XXXX',
  })
  readonly address: string;

  @Prop()
  @ApiProperty({
    description: '项目阶段',
    example: '工作ing',
  })
  readonly stage: string;

  /** 身份*/
  @Prop()
  identity: string;

}
