import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Kind extends Document {
  @Prop()
  @ApiProperty({
    description: '分类名称',
    example: '前端',
  })
  readonly name: string;

}
