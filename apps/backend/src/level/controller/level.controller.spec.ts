import { Test, TestingModule } from '@nestjs/testing';
import { LevelService } from '../service/level.service';
import { LevelController } from './level.controller';

describe('LevelController', () => {
  let controller: LevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelController],
      providers: [{ provide: LevelService, useValue: { findAll: jest.fn() } }],
    }).compile();

    controller = module.get<LevelController>(LevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
