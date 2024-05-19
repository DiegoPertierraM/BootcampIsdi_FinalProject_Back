import { type Request, type Response } from 'express';
import { type MeetsRepo } from '../repositories/meets.repo';
import { MeetsController } from './meets.controller';

describe('Given a instance of the class MeetsController', () => {
  const repo = {
    create: jest.fn(),
    readAll: jest.fn(),
    searchByTitle: jest.fn(),
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

  describe('When we use the method getAll', () => {
    test('Then it should call repo.readAll if no query parameter is provided', async () => {
      const mockMeets = [
        { id: '1', title: 'Meet 1' },
        { id: '2', title: 'Meet 2' },
      ];
      (repo.readAll as jest.Mock).mockResolvedValue(mockMeets);

      await controller.getAll(req, res, next);

      expect(repo.readAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockMeets);
      expect(next).not.toHaveBeenCalled();
    });

    test('Then it should call repo.searchByTitle if title query parameter is provided', async () => {
      const mockTitle = 'test';
      const mockMeets = [{ id: '1', title: 'Test Meet' }];
      req.query = { title: mockTitle };

      (repo.searchByTitle as jest.Mock).mockResolvedValue(mockMeets);

      await controller.getAll(req, res, next);

      expect(repo.searchByTitle).toHaveBeenCalledWith(mockTitle);
      expect(res.json).toHaveBeenCalledWith(mockMeets);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('When we use the method searchByTitle', () => {
    test('Then it should call repo.searchByTitle with the provided title query parameter', async () => {
      const mockTitle = 'test';
      req.query = { title: mockTitle };

      const mockMeets = [{ id: '1', title: 'Test Meet' }];
      (repo.searchByTitle as jest.Mock).mockResolvedValue(mockMeets);

      await controller.searchByTitle(req, res, next);

      expect(repo.searchByTitle).toHaveBeenCalledWith(mockTitle);
      expect(res.json).toHaveBeenCalledWith(mockMeets);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
