import { Test, TestingModule } from '@nestjs/testing';
import { boxIdMock, updateBoxDtoMock } from '../mocks/box.mocks';
import { BoxService } from '../service/box.service';
import { BoxController } from './box.controller';

describe('BoxController', () => {
  let controller: BoxController;
  const mockBoxService = {
    createBoxes: jest.fn(),
    findAllByGameId: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoxController],
      providers: [{ provide: BoxService, useValue: mockBoxService }],
    }).compile();

    controller = module.get<BoxController>(BoxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should be able to find all boxes by game id', async () => {
  //   jest
  //     .spyOn(mockBoxService, 'findAllByGameId')
  //     .mockResolvedValue(boxesDtoMock);

  //   const response = await controller.findAllByGameId();

  //   expect(mockBoxService.findAllByGameId).toHaveBeenCalledWith(gameIdMock);
  //   expect(response).toEqual(boxesDtoMock);
  // });

  it('should be able to update a box', async () => {
    jest.spyOn(mockBoxService, 'update').mockResolvedValue(true);

    const response = await controller.update(boxIdMock, updateBoxDtoMock);

    expect(mockBoxService.update).toHaveBeenCalledWith(
      boxIdMock,
      updateBoxDtoMock,
    );
    expect(response).toEqual(true);
  });
});
