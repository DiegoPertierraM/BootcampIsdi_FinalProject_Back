import { type PrismaClient } from '@prisma/client';
import createDebug from 'debug';
const debug = createDebug('TFD:users:repository');

const select = {
  id: true,
  username: true,
  email: true,
  role: true,
  avatar: true,
  location: true,
  birthDate: true,
  gender: true,
  bio: true,
};

export class UsersRepo {
  constructor(private readonly prisma: PrismaClient) {
    debug('Instantiated users repository');
  }

  async readAll() {
    return this.prisma.user.findMany({
      select,
    });
  }
}
