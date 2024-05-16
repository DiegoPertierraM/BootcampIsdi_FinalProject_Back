import { type Prisma, type PrismaClient } from '@prisma/client';
import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import {
  type UserUpdateDto,
  type UserCreateDto,
  type User,
} from '../entities/user.js';
import { type Repo } from './type.repo.js';
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
  friends: {
    select: {
      username: true,
      email: true,
    },
  },
  joinedMeets: {
    select: {
      id: true,
      title: true,
      sport: true,
      date: true,
      location: true,
      image: true,
      attendees: true,
    },
  },
  createdMeets: {
    select: {
      id: true,
      title: true,
      sport: true,
      date: true,
      location: true,
      image: true,
      attendees: true,
    },
  },
  savedMeets: {
    select: {
      id: true,
      title: true,
      sport: true,
      date: true,
      location: true,
      image: true,
      attendees: true,
    },
  },
};

export class UsersRepo implements Repo<User, UserCreateDto> {
  constructor(private readonly prisma: PrismaClient) {
    debug('Instantiated users repository');
  }

  async readAll() {
    return this.prisma.user.findMany({
      select,
    });
  }

  async readById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select,
    });
    if (!user) {
      throw new HttpError(404, 'Not Found', `User ${id} not found`);
    }

    return user;
  }

  async searchForLogin(key: 'email' | 'username', value: string) {
    if (!['email', 'username'].includes(key)) {
      throw new HttpError(404, 'Not Found', 'Invalid query parameters');
    }

    const userData = await this.prisma.user.findFirst({
      where: {
        [key]: value,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!userData) {
      throw new HttpError(404, 'Not Found', `Invalid ${key} or password`);
    }

    return userData;
  }

  async create(data: UserCreateDto) {
    console.log('data', data);
    const { birthDateString, ...rest } = data;
    const newUser = this.prisma.user.create({
      data: {
        role: 'user',
        bio: '',
        birthDate: new Date(birthDateString),
        ...rest,
      },
      select,
    });
    return newUser;
  }

  async update(id: string, data: Partial<UserUpdateDto>) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpError(404, 'Not Found', `User ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select,
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpError(404, 'Not Found', `User ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
      select,
    });
  }

  async manageMeet(
    userId: string,
    meetId: string,
    operation: string,
    meetType: 'savedMeets' | 'joinedMeets'
  ) {
    const data: Prisma.UserUpdateInput = {};
    if (operation === 'POST') {
      data[meetType] = { connect: { id: meetId } };
    } else if (operation === 'DELETE') {
      data[meetType] = { disconnect: { id: meetId } };
    } else {
      throw new Error('Operation unknown');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: { [meetType]: true },
    });
  }

  async addFriend(userId: string, friendId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { friends: { connect: { id: friendId } } },
      include: { friends: true },
    });
  }

  async getFriends(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });

    if (!user) {
      throw new HttpError(404, 'Not Found', `User ${userId} not found`);
    }

    return user.friends as unknown as Partial<User[]>;
  }
}
