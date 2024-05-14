import { type PrismaClient } from '@prisma/client';
import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { type MeetCreateDto } from '../entities/meet.js';
const debug = createDebug('TFD:meets:repository');

const select = {
  id: true,
  title: true,
  description: true,
  sport: true,
  date: true,
  location: true,
  image: true,
  creator: {
    select: {
      username: true,
      email: true,
      birthDate: true,
      role: true,
    },
  },
  attendees: {
    select: {
      username: true,
      email: true,
      birthDate: true,
      role: true,
    },
  },
};

export class MeetsRepo {
  constructor(private readonly prisma: PrismaClient) {
    debug('Instantiated meets repository');
  }

  async readAll() {
    return this.prisma.meet.findMany({
      select,
    });
  }

  async readById(id: string) {
    const meet = await this.prisma.meet.findUnique({
      where: { id },
      select,
    });
    if (!meet) {
      throw new HttpError(404, 'Not Found', `meet ${id} not found`);
    }

    return meet;
  }

  async create(data: MeetCreateDto) {
    const { date, description, ...rest } = data;
    const newMeet = this.prisma.meet.create({
      data: {
        description: data.description ?? '',
        date: new Date(date),
        ...rest,
      },
      select,
    });
    return newMeet;
  }

  async update(id: string, data: Partial<MeetCreateDto>) {
    const meet = await this.prisma.meet.findUnique({
      where: { id },
      select,
    });
    if (!meet) {
      throw new HttpError(404, 'Not Found', `meet ${id} not found`);
    }

    return this.prisma.meet.update({
      where: { id },
      data,
      select,
    });
  }

  async delete(id: string) {
    const meet = await this.prisma.meet.findUnique({
      where: { id },
      select,
    });
    if (!meet) {
      throw new HttpError(404, 'Not Found', `meet ${id} not found`);
    }

    return this.prisma.meet.delete({
      where: { id },
      select,
    });
  }
}
