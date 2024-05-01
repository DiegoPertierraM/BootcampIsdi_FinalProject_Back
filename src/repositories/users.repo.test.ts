import { type PrismaClient } from '@prisma/client';
import { UsersRepo } from './users.repo';
import { HttpError } from '../middleware/errors.middleware';
import { type UserCreateDto } from '../entities/user';

const mockPrisma = {
  user: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({ id: '1' }),
    findFirst: jest.fn().mockResolvedValue({ id: '1' }),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
} as unknown as PrismaClient;

describe('Given an instance of the class UsersRepo', () => {
  const usersRepo = new UsersRepo(mockPrisma);

  it('should be an instance of the class', () => {
    expect(usersRepo).toBeInstanceOf(UsersRepo);
  });

  describe('When we call the method ReadAll', () => {
    it('should call prisma.user.findMany', async () => {
      const result = await usersRepo.readAll();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we call the method ReadById with a valid id', () => {
    it('should call prisma.user.findUnique', async () => {
      const result = await usersRepo.readById('1');
      expect(mockPrisma.user.findUnique).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When we use the method readById with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(usersRepo.readById('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'User 2 not found')
      );
    });
  });

  describe('When we use the method searchForLogin with a valid key', () => {
    test('Then it should call prisma.findFirst', async () => {
      const result = await usersRepo.searchForLogin('email', 'test@sample.com');
      expect(mockPrisma.user.findFirst).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When we use the method searchForLogin with an invalid key', () => {
    test('Then it should throw an error', async () => {
      await expect(
        usersRepo.searchForLogin('invalid' as 'username', 'test')
      ).rejects.toThrow(
        new HttpError(400, 'Bad Request', 'Invalid query parameters')
      );
    });
  });

  describe('When we use the method searchForLogin with an invalid value', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
      await expect(usersRepo.searchForLogin('email', 'test')).rejects.toThrow(
        new HttpError(400, 'Bad Request', 'Invalid email or password')
      );
    });
  });

  describe('When we use the method create', () => {
    test('Then it should call prisma.create', async () => {
      const data = {} as unknown as UserCreateDto;
      const result = await usersRepo.create(data);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with a valid ID', () => {
    test('Then it should call prisma.update', async () => {
      const result = await usersRepo.update('1', {});
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(usersRepo.update('2', {})).rejects.toThrow(
        new HttpError(404, 'Not Found', 'User 2 not found')
      );
    });
  });

  describe('When we use the method delete with a valid ID', () => {
    test('Then it should call prisma.delete', async () => {
      const result = await usersRepo.delete('1');
      expect(mockPrisma.user.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method delete with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(usersRepo.delete('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'User 2 not found')
      );
    });
  });
});
