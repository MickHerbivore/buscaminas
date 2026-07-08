import { Test, TestingModule } from '@nestjs/testing';
import { FrameService } from '../service/frame.service';
import { BoxService } from './box.service';

describe('FrameService', () => {
  let service: FrameService;
  const mockBoxService = {
    createBoxes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrameService,
        { provide: BoxService, useValue: mockBoxService },
      ],
    }).compile();

    service = module.get<FrameService>(FrameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
