import { type Request, type Response } from 'express';
import { type MeetsRepo } from '../repositories/meets.repo';
import { MeetsController } from './meets.controller';

describe('Given a instance of the class MeetsController', () => {
  const repo = {
    create: jest.fn(),
  } as unknown as MeetsRepo;

  const req = {} as unknown as Request;
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new MeetsController(repo);

  test('Then it should be instance of the class', () => {
    expect(controller).toBeInstanceOf(MeetsController);
  });

  describe('When we use the method create', () => {
    test('Then it should call repo.create', async () => {
      const meet = {
        title: 'title',
        creatorId: 'test',
        sport: 'football',
        date: '01-01-2020',
      };
      const validateEvent = {
        ...meet,
        description: '',
      };
      req.body = { ...meet, payload: { id: 'test' } };
      (repo.create as jest.Mock).mockResolvedValue(meet);
      await controller.create(req, res, next);
      expect(repo.create).toHaveBeenCalledWith(validateEvent);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(meet);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
