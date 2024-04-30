import { type PrismaClient } from '@prisma/client';
import { UsersRepo } from './users.repo';

const mockPrisma = {
  user: {
    findMany: jest.fn().mockResolvedValue({}),
  },
} as unknown as PrismaClient;

describe('Given an instance of the class UsersRepo', () => {
  const usersRepo = new UsersRepo(mockPrisma);

  it('should be an instance of the class', () => {
    expect(usersRepo).toBeInstanceOf(UsersRepo);
  });

  describe('When we call the method ReadAll', () => {
    it('should call prisma.user.findMany', async () => {
      await usersRepo.readAll();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
    });
  });
});
