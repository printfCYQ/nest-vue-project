import { Module } from '@nestjs/common';
import { KindController } from './kind.controller';
import { KindService } from './kind.service';

@Module({
  controllers: [KindController],
  providers: [KindService]
})
export class KindModule {}
