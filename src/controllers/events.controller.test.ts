import { type Request, type Response } from 'express';
import { type EventsRepo } from '../repositories/events.repo';
import { EventsController } from './events.controller';

describe('Given a instance of the class EventsController', () => {
  const repo = {
    create: jest.fn(),
  } as unknown as EventsRepo;

  const req = {} as unknown as Request;
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new EventsController(repo);

  test('Then it should be instance of the class', () => {
    expect(controller).toBeInstanceOf(EventsController);
  });

  describe('When we use the method create', () => {
    test('Then it should call repo.create', async () => {
      const event = {
        title: 'title',
        creatorId: 'test',
        sport: 'football',
        date: '01-01-2020',
      };
      const validateEvent = {
        ...event,
        description: '',
      };
      req.body = { ...event, payload: { id: 'test' } };
      (repo.create as jest.Mock).mockResolvedValue(event);
      await controller.create(req, res, next);
      expect(repo.create).toHaveBeenCalledWith(validateEvent);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(event);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
