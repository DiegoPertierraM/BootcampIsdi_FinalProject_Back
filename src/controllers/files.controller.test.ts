import { type NextFunction, type Request, type Response } from 'express';
import { FilesController } from './files.controller';

describe('Given a instance of the class FilesController', () => {
  const req = {
    file: {},
    body: {
      cloudinary: {},
    },
  } as unknown as Request;
  const res = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();
  const controller = new FilesController();
  test('Then it should be instance of the class', () => {
    expect(controller).toBeInstanceOf(FilesController);
  });
  describe('When we use the method fileHandler', () => {
    describe('And file is not valid', () => {
      test('Then it should call next with an error', () => {
        req.file = undefined;
        controller.fileHandler(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'No file uploaded',
          })
        );
      });
    });
    describe('And file is valid', () => {
      test('Then it should call res.json', () => {
        req.file = {} as unknown as Express.Multer.File;
        controller.fileHandler(req, res, next);
        expect(res.json).toHaveBeenCalled();
      });
    });
  });
});
