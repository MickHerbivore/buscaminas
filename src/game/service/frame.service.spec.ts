import { Test, TestingModule } from '@nestjs/testing';
import { boxesMock } from '../../box/mocks/box.mocks';
import { BoxService } from '../../box/service/box.service';
import { createFrameDtoMock } from '../mocks/frame.mocks';
import { FrameService } from '../service/frame.service';

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

  it('should be able to create a frame', async () => {
    jest.spyOn(mockBoxService, 'createBoxes').mockResolvedValue(boxesMock);

    const response = await service.create(createFrameDtoMock);

    expect(response).toEqual(boxesMock);
  });
});
