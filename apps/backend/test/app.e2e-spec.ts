import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { GameController } from '../src/game/controller/game.controller';
import { GameService } from '../src/game/service/game.service';

describe('GameController (e2e)', () => {
  let app: INestApplication;

  // RFC-4122 valid UUID (v4-style) accepted by both ParseUUIDPipe and @IsUUID('all').
  const VALID_ID = '11111111-1111-4111-a111-111111111111';
  const VALID_BOX_ID = '22222222-3333-4444-b555-666666666666';

  const mockGameService = {
    createGame: jest.fn(async (dto: any) => ({ id: 'game-1', status: 'INITIAL', ...dto })),
    getGame: jest.fn(async () => ({ id: 'game-1', status: 'INITIAL' })),
    deleteGame: jest.fn(async () => undefined),
    findBoxes: jest.fn(async () => []),
    reveal: jest.fn(async () => ({ game: { id: 'game-1' }, boxes: [] })),
    flag: jest.fn(async () => ({ game: { id: 'game-1' }, boxes: [] })),
    chord: jest.fn(async () => ({ game: { id: 'game-1' }, boxes: [] })),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: mockGameService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v2');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v2/games creates a game', () => {
    return request(app.getHttpServer())
      .post('/api/v2/games')
      .send({ levelId: '11111111-1111-4111-a111-111111111111' })
      .expect(201);
  });

  it('POST /api/v2/games rejects an invalid levelId', () => {
    return request(app.getHttpServer())
      .post('/api/v2/games')
      .send({ levelId: 'not-a-uuid' })
      .expect(400);
  });

  it('POST /api/v2/games rejects unknown properties', () => {
    return request(app.getHttpServer())
      .post('/api/v2/games')
      .send({
        levelId: '11111111-1111-4111-a111-111111111111',
        extra: 'leak',
      })
      .expect(400);
  });

  it('GET /api/v2/games/:id returns the game', () => {
    return request(app.getHttpServer())
      .get('/api/v2/games/11111111-1111-4111-a111-111111111111')
      .expect(200);
  });

  it('DELETE /api/v2/games/:id returns 204', () => {
    return request(app.getHttpServer())
      .delete('/api/v2/games/11111111-1111-4111-a111-111111111111')
      .expect(204);
  });

  it('PATCH /api/v2/games/:id/reveal requires a boxId', () => {
    return request(app.getHttpServer())
      .patch('/api/v2/games/11111111-1111-4111-a111-111111111111/reveal')
      .send({})
      .expect(400);
  });

  it('PATCH /api/v2/games/:id/flag with valid body returns 200', () => {
    return request(app.getHttpServer())
      .patch('/api/v2/games/11111111-1111-4111-a111-111111111111/flag')
      .send({ boxId: '22222222-3333-4444-b555-666666666666' })
      .expect(200);
  });
});
