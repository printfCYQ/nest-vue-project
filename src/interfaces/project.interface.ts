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

}
