import { Test, TestingModule } from '@nestjs/testing';
import { KindController } from './kind.controller';

describe('KindController', () => {
  let controller: KindController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KindController],
    }).compile();

    controller = module.get<KindController>(KindController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
