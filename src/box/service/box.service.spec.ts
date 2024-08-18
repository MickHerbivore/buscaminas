import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { gameIdMock, gameMock } from '../../game/mocks/game.mocks';
import { Box } from '../entities/box.entity';
import {
  boxesMock,
  boxIdMock,
  boxMock,
  createBoxesDtoMock,
  updateBoxDtoMock,
} from '../mocks/box.mocks';
import { Game } from './../../game/entity/game.entity';
import { BoxService } from './box.service';

describe('BoxService', () => {
  let service: BoxService;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoxService,
        { provide: getRepositoryToken(Box), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BoxService>(BoxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a list of boxes', async () => {
    jest.spyOn(mockRepository, 'save').mockResolvedValue(boxesMock);

    const response = await service.createBoxes(createBoxesDtoMock);

    expect(response).toEqual(boxesMock);
    expect(mockRepository.save).toHaveBeenCalledWith(createBoxesDtoMock);
  });

  it('should be able to find all boxes by grame id', async () => {
    const game: Game = {
      ...gameMock,
    };

    const boxes: Box[] = [boxMock];

    game.boxes = boxes;

    jest.spyOn(mockRepository, 'find').mockResolvedValue(boxes);

    const response = await service.findAllByFrameId(gameIdMock);

    expect(mockRepository.find).toHaveBeenCalled();
    expect(response.length).toEqual(boxes.length);
    expect(response[0].id).toEqual(boxes[0].id);
  });

  it('should be able to update a box', async () => {
    jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(boxMock);

    const response = await service.update(boxIdMock, updateBoxDtoMock);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: boxIdMock });
    expect(response).toEqual(true);
  });
});
