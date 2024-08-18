import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LevelDto } from '../dto/level.dto';
import { Level } from '../entities/level.entity';
import { LevelService } from './level.service';

describe('LevelService', () => {
  let service: LevelService;

  const levelIdMock = '246a339c-f1cb-4fb2-82f4-aec5188ecb1f';
  const levelIdMock2 = '59830e64-cbfb-4f86-88bc-546686da220d';
  const mockRepository = {
    find: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelService,
        { provide: getRepositoryToken(Level), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<LevelService>(LevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to find all levels', async () => {
    const response: LevelDto[] = [
      {
        id: levelIdMock,
        name: 'easy',
        description: 'easy description',
        rowsQuantity: 8,
        columnsQuantity: 8,
        minesQuantity: 16,
      },
      {
        id: levelIdMock2,
        name: 'hard',
        description: ' hard description',
        rowsQuantity: 16,
        columnsQuantity: 16,
        minesQuantity: 40,
      },
    ];

    jest.spyOn(service, 'findAll').mockReturnValue(Promise.resolve(response));

    const levels = await service.findAll();

    expect(levels).toBeDefined();
    expect(levels).toBe(response);
  });

  it('should be able to find a level by id', async () => {
    const level: LevelDto = {
      id: levelIdMock,
      name: 'easy',
      description: 'easy description',
      rowsQuantity: 8,
      columnsQuantity: 8,
      minesQuantity: 16,
    };

    jest.spyOn(service, 'findById').mockReturnValue(Promise.resolve(level));
    const result = await service.findById(levelIdMock);

    expect(result).toBe(level);
    expect(result.id).toBe(levelIdMock);
  });
});
