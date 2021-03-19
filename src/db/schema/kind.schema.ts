import { SchemaFactory } from '@nestjs/mongoose';
import { Kind } from 'src/interfaces/kind.interface';

export const KindSchema = SchemaFactory.createForClass(Kind);
