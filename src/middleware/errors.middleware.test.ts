import { type Request, type Response } from 'express';
import { ErrorsMiddleware, HttpError } from './errors.middleware';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const req = {} as unknown as Request;
const res = {
  json: jest.fn(),
  status: jest.fn(),
} as unknown as Response;
const next = jest.fn();

describe('Given a instance of the class ErrorsMiddleware', () => {
  const middleware = new ErrorsMiddleware();
  test('Then it should be instance of the class', () => {
    expect(middleware).toBeInstanceOf(ErrorsMiddleware);
  });
  describe('When we use the method handle with a HttpError', () => {
    test('Then it should call res.status 404', () => {
      const error = new HttpError(404, 'Not Found', 'Article not found');
      middleware.handle(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
    });
  });
  describe('When we use the method handle with a PrismaClientKnownRequestError', () => {
    test('Then it should call res.status 404', () => {
      const error = new PrismaClientKnownRequestError('error', {
        code: 'P2025',
        clientVersion: '3.0.0',
      });
      middleware.handle(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('When we use the method handle with a Error', () => {
    test('Then it should call res.status with 500', () => {
      const error = new Error('Something went wrong');
      middleware.handle(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
