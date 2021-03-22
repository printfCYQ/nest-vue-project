import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export interface IUserProject {
  projectId: string,
  identity: string
}

@Schema()
export class User extends Document {
  @Prop()
  @ApiProperty({
    description: '用户手机号',
    example: '15811111111',
  })
  readonly phone: string;

  @Prop()
  @ApiProperty({
    description: '用户密码',
    example: '123456',
  })
  readonly password: string;

  @Prop()
  readonly projects?: Array<IUserProject>;

  @Prop()
  readonly salt?: string;
}
