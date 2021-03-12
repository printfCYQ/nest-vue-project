import { SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/interfaces/user.interface';

export const UserSchema = SchemaFactory.createForClass(User);
