import { SchemaFactory } from '@nestjs/mongoose';
import { Project } from 'src/interfaces/project.interface';

export const ProjectSchema = SchemaFactory.createForClass(Project);
