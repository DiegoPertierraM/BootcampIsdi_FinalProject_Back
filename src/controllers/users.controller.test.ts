import { type Request, type Response } from 'express';
import { UsersController } from './users.controller';
import { Auth } from '../services/auth.services';
import { type ObjectSchema } from 'joi';
import { type UserCreateDto } from '../entities/user';
import { type UsersRepo } from '../repositories/users.repo';

jest.mock('../entities/user.schema.js', () => ({
  userCreateDtoSchema: {
    validate: jest.fn().mockReturnValue({ error: null, value: {} }),
  } as unknown as ObjectSchema<UserCreateDto>,
  userUpdateDtoSchema: {
    validate: jest.fn().mockReturnValue({ error: null, value: {} }),
  } as unknown as ObjectSchema<UserCreateDto>,
}));

describe('Given a instance of the class UsersController', () => {
  const repo = {
    readAll: jest.fn(),
    readById: jest.fn(),
    searchForLogin: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as UsersRepo;

  const req = {} as unknown as Request;
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn();

  Auth.hash = jest.fn().mockResolvedValue('hashedPassword');

  const controller = new UsersController(repo);
  test('Then it should be instance of the class', () => {
    expect(controller).toBeInstanceOf(UsersController);
  });

  describe('When we use the method login', () => {
    describe('And body is not valid', () => {
      test('Then it should call next with an error', async () => {
        req.body = {};
        await controller.login(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Email/username and password are required',
          })
        );
      });
    });

    describe('And user is not found', () => {
      test('Then it should call next with an error', async () => {
        req.body = { email: 'test@mail.com', password: 'password' };
        (repo.searchForLogin as jest.Mock).mockResolvedValue(null);
        await controller.login(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Email/username and password invalid',
          })
        );
      });
    });

    describe('And password is invalid', () => {
      test('Then it should call next with an error', async () => {
        const user = { id: '1', password: 'password' };
        req.body = { email: 'test@mail.com', password: 'password' };
        (repo.searchForLogin as jest.Mock).mockResolvedValue(user);
        Auth.compare = jest.fn().mockResolvedValue(false);
        await controller.login(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Email/username and password invalid',
          })
        );
      });
    });

    describe('And all process is ok', () => {
      test('Then it should call repo.searchForLogin and res methods', async () => {
        const user = { id: '1', password: 'password' };
        req.body = { email: 'test@acme.com', password: 'password' };
        (repo.searchForLogin as jest.Mock).mockResolvedValue(user);
        Auth.compare = jest.fn().mockResolvedValue(true);
        Auth.signJwt = jest.fn().mockReturnValue('test');
        await controller.login(req, res, next);
        expect(repo.searchForLogin).toHaveBeenCalledWith(
          'email',
          'test@acme.com'
        );
        expect(Auth.compare).toHaveBeenCalledWith('password', 'password');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'test' });
      });
      test('Then it should call repo.searchForLogin and res methods', async () => {
        const user = { id: '1', password: 'password' };
        req.body = { username: 'test', password: 'password' };
        (repo.searchForLogin as jest.Mock).mockResolvedValue(user);
        Auth.compare = jest.fn().mockResolvedValue(true);
        Auth.signJwt = jest.fn().mockReturnValue('test');
        await controller.login(req, res, next);
        expect(repo.searchForLogin).toHaveBeenCalledWith('username', 'test');
        expect(Auth.compare).toHaveBeenCalledWith('password', 'password');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'test' });
      });
    });

    describe('And an error is thrown', () => {
      test('Then it should call next with an error', async () => {
        req.body = { email: 'sample@mail.com', password: 'password' };
        (repo.searchForLogin as jest.Mock).mockRejectedValue(new Error());
        await controller.login(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('When we use the method create', () => {
    describe('And body is not valid', () => {
      test('Then it should call next with an error', async () => {
        req.body = { username: 'test' };
        await controller.create(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Password is required and must be a string',
          })
        );
      });
    });

    describe('And body is ok', () => {
      test('Then it should call repo.create', async () => {
        const user = { username: 'test', password: 'test' };
        req.body = user;
        req.body.cloudinary = { url: '' };
        req.body.avatar = req.body.cloudinary?.url as string;
        Auth.hash = jest.fn().mockResolvedValue('hashedPassword');
        (repo.create as jest.Mock).mockResolvedValue(user);
        await controller.create(req, res, next);
        expect(Auth.hash).toHaveBeenCalledWith('test');
        expect(repo.create).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);
      });
    });
  });

  describe('When we use the method update', () => {
    test('Then it should call repo.update', async () => {
      Auth.hash = jest.fn().mockResolvedValue('hashedPassword');
      const user = { id: '1', username: 'test', password: 'test' };
      const finalUser = { ...user, password: 'hashedPassword' };
      req.params = { id: '1' };
      req.body = { ...user, id: req.params.id };
      (repo.update as jest.Mock).mockResolvedValue(finalUser);
      await controller.update(req, res, next);
      expect(Auth.hash).toHaveBeenCalledWith('test');
      expect(repo.update).toHaveBeenCalledWith('1', finalUser);
      expect(res.json).toHaveBeenCalledWith(finalUser);
    });
  });
});
