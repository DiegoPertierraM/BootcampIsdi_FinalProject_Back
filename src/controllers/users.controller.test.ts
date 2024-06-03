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
    manageMeet: jest.fn(),
    addFriend: jest.fn(),
    deleteFriend: jest.fn(),
    getFriends: jest.fn(),
    searchByUsername: jest.fn(),
  } as unknown as UsersRepo;

  const req = {} as unknown as Request;
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn();
  const mockUserId = '1';
  const mockMeetId = '2';
  const mockFriendId = '2';

  Auth.hash = jest.fn().mockResolvedValue('hashedPassword');

  const controller = new UsersController(repo);
  test('Then it should be instance of the class', () => {
    expect(controller).toBeInstanceOf(UsersController);
  });

  describe('When we use the method getAll', () => {
    describe('And no username is provided', () => {
      test('Then it should call repo.readAll and res.json with the results', async () => {
        req.query = {};
        const mockUsers = [{ id: '1', username: 'test' }];
        (repo.readAll as jest.Mock).mockResolvedValue(mockUsers);

        await controller.getAll(req, res, next);

        expect(repo.readAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockUsers);
      });
    });

    describe('And a username is provided', () => {
      test('Then it should call repo.searchByUsername and res.json with the results', async () => {
        req.query = { username: 'test' };
        const mockUsers = [{ id: '1', username: 'test' }];
        (repo.searchByUsername as jest.Mock).mockResolvedValue(mockUsers);

        await controller.getAll(req, res, next);

        expect(repo.searchByUsername).toHaveBeenCalledWith('test');
        expect(res.json).toHaveBeenCalledWith(mockUsers);
      });
    });

    describe('And an error is thrown', () => {
      test('Then it should call next with an error', async () => {
        req.query = {};
        (repo.readAll as jest.Mock).mockRejectedValue(
          new Error('Failed to read all users')
        );

        await controller.getAll(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
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
      const date = new Date('01-01-1111');
      const user = {
        id: '1',
        username: 'test',
        password: 'test',
        birthDate: date,
      };
      const finalUser = {
        ...user,
        password: 'hashedPassword',
        avatar: undefined,
      };
      req.params = { id: '1' };
      req.body = { ...user, id: req.params.id };
      (repo.update as jest.Mock).mockResolvedValue(finalUser);
      await controller.update(req, res, next);
      expect(Auth.hash).toHaveBeenCalledWith('test');
      expect(repo.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(finalUser);
    });
  });

  describe('When we use the method manageMeet', () => {
    test('Then it should call repo.manageMeet with correct parameters', async () => {
      const req = {
        params: { userId: mockUserId, meetId: mockMeetId },
        method: 'post',
        url: '/users/clw6935px0000i5tn5f2wf44m/saved-meets/clw6a0nhi0002i5tn3b6zv58',
      } as unknown as Request<{ userId: string; meetId: string }>;

      (repo.manageMeet as jest.Mock).mockResolvedValueOnce({});

      await controller.manageMeet(req, res, next);

      expect(repo.manageMeet).toHaveBeenCalledWith(
        mockUserId,
        mockMeetId,
        'post',
        'savedMeets'
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Then it should call next with an error if an error occurs', async () => {
      const req = {
        params: { userId: mockUserId, meetId: mockMeetId },
        method: 'post',
        url: '/users/clw6935px0000i5tn5f2wf44m/example-meets/clw6a0nhi0002i5tn3b6zv58',
      } as unknown as Request<{
        userId: string;
        meetId: string;
      }>;

      (repo.manageMeet as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to manage meet')
      );

      await controller.manageMeet(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to manage meet',
        })
      );
    });
  });

  describe('When we use the method addFriend', () => {
    test('Then it should call repo.addFriend with correct parameters', async () => {
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      const req = {
        params: { userId: mockUserId, friendId: mockFriendId },
      } as unknown as Request<{ userId: string; friendId: string }>;

      (repo.addFriend as jest.Mock).mockResolvedValueOnce({});

      await controller.addFriend(req, res, next);

      expect(repo.addFriend).toHaveBeenCalledWith(mockUserId, mockFriendId);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Then it should call next with an error if an error occurs', async () => {
      const req = {
        params: { userId: mockUserId, friendId: mockFriendId },
      } as unknown as Request<{
        userId: string;
        friendId: string;
      }>;

      (repo.addFriend as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to add friend')
      );

      await controller.addFriend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to add friend',
        })
      );
    });
  });

  describe('When we use the method getFriends', () => {
    test('Then it should call repo.getFriends with correct parameters', async () => {
      const req = { params: { userId: mockUserId } } as unknown as Request<{
        userId: string;
        friendId: string;
      }>;
      const mockFriends = [
        { id: '2', username: 'friend1' },
        { id: '3', username: 'friend2' },
      ];

      (repo.getFriends as jest.Mock).mockResolvedValueOnce(mockFriends);

      await controller.getFriends(req, res, next);

      expect(repo.getFriends).toHaveBeenCalledWith(mockUserId);
      expect(res.json).toHaveBeenCalledWith(mockFriends);
    });

    test('Then it should call next with an error if user is not found', async () => {
      const mockUserId = '1';
      const req = { params: { userId: mockUserId } } as unknown as Request<{
        userId: string;
        friendId: string;
      }>;
      const res = {
        json: jest.fn(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;
      const next = jest.fn();

      (repo.getFriends as jest.Mock).mockResolvedValueOnce(null);

      await controller.getFriends(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `User ${mockUserId} not found`,
        })
      );
    });
  });

  describe('When we use the method deleteFriend', () => {
    test('Then it should call repo.deleteFriend with correct parameters', async () => {
      const req = {
        params: { userId: mockUserId, friendId: mockFriendId },
      } as unknown as Request<{ userId: string; friendId: string }>;

      (repo.deleteFriend as jest.Mock).mockResolvedValueOnce({});

      await controller.deleteFriend(req, res, next);

      expect(repo.deleteFriend).toHaveBeenCalledWith(mockUserId, mockFriendId);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Then it should call next with an error if an error occurs', async () => {
      const req = {
        params: { userId: mockUserId, friendId: mockFriendId },
      } as unknown as Request<{
        userId: string;
        friendId: string;
      }>;

      (repo.deleteFriend as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to delete friend')
      );

      await controller.deleteFriend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to delete friend',
        })
      );
    });
  });

  describe('When we use the method searchByUsername', () => {
    describe('And the username is provided', () => {
      test('Then it should call repo.searchByUsername and res.json with the results', async () => {
        req.query = { username: 'test' };
        const mockUsers = [{ id: '1', username: 'test' }];
        (repo.searchByUsername as jest.Mock).mockResolvedValue(mockUsers);

        await controller.searchByUsername(req, res, next);

        expect(repo.searchByUsername).toHaveBeenCalledWith('test');
        expect(res.json).toHaveBeenCalledWith(mockUsers);
      });
    });

    describe('And the username is not provided', () => {
      test('Then it should respond with status 400 and an error message', async () => {
        req.query = {};

        await controller.searchByUsername(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: 'username parameter is missing',
        });
      });
    });

    describe('And an error is thrown', () => {
      test('Then it should call next with an error', async () => {
        req.query = { username: 'test' };
        (repo.searchByUsername as jest.Mock).mockRejectedValue(
          new Error('Failed to search by username')
        );

        await controller.searchByUsername(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });
});
