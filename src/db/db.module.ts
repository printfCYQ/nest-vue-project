import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KindSchema } from './schema/kind.schema';
import { ProjectSchema } from './schema/project.schema';
import { UserSchema } from './schema/user.schema';

const MONGO_MODELS = MongooseModule.forFeature([
  {
    name: 'USER_MODEL',
    schema: UserSchema,
    collection: 'user',
  },{
    name: 'PROJECT_MODEL',
    schema: ProjectSchema,
    collection: 'project',
  },{
    name: 'KIND_MODEL',
    schema: KindSchema,
    collection: 'kind',
  }
]);

const MONGO_CON = MongooseModule.forRoot(
  'mongodb://localhost:27017/project_manage',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
);

@Global()
@Module({
  imports: [MONGO_CON, MONGO_MODELS],
  exports: [MONGO_MODELS],
})
export class DbModule {}
