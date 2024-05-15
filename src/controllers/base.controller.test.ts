import { type Request, type Response } from 'express';
import { type Repo } from '../repositories/type.repo';
import { BaseController } from './base.controller';
import { type ObjectSchema } from 'joi';
import { HttpError } from '../middleware/errors.middleware.js';

type TestModel = Record<string, unknown>;
type TestCreateDto = Record<string, unknown>;
const testCreateDtoSchema = {
  validate: jest.fn().mockReturnValue({ error: null, value: {} }),
} as unknown as ObjectSchema<TestCreateDto>;
const testUpdateDtoSchema = {
  validate: jest.fn().mockReturnValue({ error: null, value: {} }),
} as unknown as ObjectSchema<TestCreateDto>;

export class TestController extends BaseController<TestModel, TestCreateDto> {
  constructor(protected readonly repo: Repo<TestModel, TestCreateDto>) {
    super(repo, testCreateDtoSchema, testUpdateDtoSchema);
  }
}

describe('Given an instance of the class TestController', () => {
  const repo = {
    readAll: jest.fn(),
    readById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as Repo<TestModel, TestCreateDto>;

  const req = {} as unknown as Request;
  const res = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new TestController(repo);

  it('should be instance of the class', () => {
    expect(controller).toBeInstanceOf(TestController);
  });

  describe('When we call the method getAll', () => {
    it('should call repo.readAll', async () => {
      (repo.readAll as jest.Mock).mockResolvedValue([]);
      await controller.getAll(req, res, next);
      expect(repo.readAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('When we call the method getAll and repo throws an ERROR', () => {
    test('Then it should call repo.readAll and next', async () => {
      const error = new Error('Something went wrong');
      (repo.readAll as jest.Mock).mockRejectedValue(error);
      await controller.getAll(req, res, next);
      expect(repo.readAll).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we call the method getById', () => {
    it('should call repo.readById', async () => {
      (repo.readById as jest.Mock).mockResolvedValue({});
      req.params = { id: '1' };
      await controller.getById(req, res, next);
      expect(repo.readById).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we call the method getById and repo throws an ERROR', () => {
    it('should call repo.readById and next', async () => {
      const error = new Error('Something went wrong');
      (repo.readById as jest.Mock).mockRejectedValue(error);
      req.params = { id: '1' };
      await controller.getById(req, res, next);
      expect(repo.readById).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we use the method create with VALID data', () => {
    test('Then it should call repo.create', async () => {
      const event = { test: 'test' };
      req.body = event;
      (repo.create as jest.Mock).mockResolvedValue(event);
      await controller.create(req, res, next);
      expect(repo.create).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we use the method create with INVALID data', () => {
    test('Then it should call next with a HTTP error', async () => {
      (testCreateDtoSchema.validate as jest.Mock).mockReturnValueOnce({
        error: new Error('error'),
        value: {},
      });
      const event = { title: 'title' };
      req.body = event;
      await controller.create(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'error')
      );
    });

    test('Then it should call next with an error', async () => {
      (testCreateDtoSchema.validate as jest.Mock).mockReturnValueOnce({
        error: null,
        value: {},
      });
      const event = { title: 'title' };
      req.body = event;
      await controller.create(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('When we use the method create and repo throw an ERROR', () => {
    test('Then it should call repo.create and next', async () => {
      const error = new Error('Something went wrong');
      (repo.create as jest.Mock).mockRejectedValueOnce(error);
      const event = { title: 'title', creator: 'autor' };
      req.body = event;
      await controller.create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we use the method update', () => {
    test('Then it should call repo.update', async () => {
      const event = { title: 'title', creatorId: 'test' };
      req.params = { id: '1' };
      req.body = event;
      (repo.update as jest.Mock).mockResolvedValue(event);
      await controller.update(req, res, next);
      expect(repo.update).toHaveBeenCalledWith('1', event);
      expect(res.json).toHaveBeenCalledWith(event);
    });
  });

  describe('When we use the method update with INVALID data', () => {
    test('Then it should call next with an error', async () => {
      (testUpdateDtoSchema.validate as jest.Mock).mockReturnValueOnce({
        error: new Error('error'),
        value: {},
      });
      const event = { creatorId: 34 };
      req.body = event;
      await controller.update(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'error')
      );
    });
  });

  describe('When we use the method update and repo throw an ERROR', () => {
    test('Then it should call repo.update and next', async () => {
      const error = new Error('Something went wrong');
      (repo.update as jest.Mock).mockRejectedValue(error);
      const event = { title: 'title', creatorId: 'test' };
      req.body = event;
      await controller.update(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we use the method delete', () => {
    test('Then it should call repo.delete', async () => {
      req.params = { id: '1' };
      (repo.delete as jest.Mock).mockResolvedValue({});
      await controller.delete(req, res, next);
      expect(repo.delete).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we use the method delete and repo throw an ERROR', () => {
    test('Then it should call repo.delete and next', async () => {
      const error = new Error('Something went wrong');
      (repo.delete as jest.Mock).mockRejectedValue(error);
      req.params = { id: '1' };
      await controller.delete(req, res, next);
      expect(repo.delete).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
