import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateBoxDto } from '../dto/create-box.dto';
import { Box } from '../entity/box.entity';
import { BoxService } from './box.service';

describe('BoxService', () => {
  let service: BoxService;

  const createBoxDtoMock: CreateBoxDto = {
    row: 0,
    column: 0,
    hasMine: false,
    isFlagged: false,
    isRotated: false,
    minesArroundQuantiy: 0,
  };

  const boxMock: Box = {
    id: 'box-1',
    ...createBoxDtoMock,
    game: null,
  } as Box;

  const mockRepository = {
    create: jest.fn((entities) => entities),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        BoxService,
        { provide: getRepositoryToken(Box), useValue: mockRepository },
      ],
    }).compile();
    service = module.get(BoxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createMany returns managed box instances', () => {
    mockRepository.create.mockReturnValue([boxMock]);
    const result = service.createMany([createBoxDtoMock]);
    expect(mockRepository.create).toHaveBeenCalledWith([createBoxDtoMock]);
    expect(result).toEqual([boxMock]);
  });

  it('findByGameId queries by game id ordered by row/column', async () => {
    mockRepository.find.mockResolvedValue([boxMock]);
    const result = await service.findByGameId('game-1');
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { game: { id: 'game-1' } },
      order: { row: 'ASC', column: 'ASC' },
    });
    expect(result).toEqual([boxMock]);
  });

  it('findByGameIdAndId throws NotFound when missing', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);
    await expect(service.findByGameIdAndId('g', 'b')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('save delegates to the repository', async () => {
    mockRepository.save.mockResolvedValue(boxMock);
    const result = await service.save(boxMock);
    expect(mockRepository.save).toHaveBeenCalledWith(boxMock);
    expect(result).toBe(boxMock);
  });

  it('saveMany is a no-op for an empty list', async () => {
    const result = await service.saveMany([]);
    expect(result).toEqual([]);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
