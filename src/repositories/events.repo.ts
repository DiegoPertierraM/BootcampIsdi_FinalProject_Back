import { type PrismaClient } from '@prisma/client';
import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { type EventCreateDto } from '../entities/event.js';
const debug = createDebug('TFD:events:repository');

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

export class EventsRepo {
  constructor(private readonly prisma: PrismaClient) {
    debug('Instantiated events repository');
  }

  async readAll() {
    return this.prisma.event.findMany({
      select,
    });
  }

  async readById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select,
    });
    if (!event) {
      throw new HttpError(404, 'Not Found', `Event ${id} not found`);
    }

    return event;
  }

  async create(data: EventCreateDto) {
    const { date, description, ...rest } = data;
    const newEvent = this.prisma.event.create({
      data: {
        description: data.description ?? '',
        date: new Date(date),
        ...rest,
      },
      select,
    });
    return newEvent;
  }

  async update(id: string, data: Partial<EventCreateDto>) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select,
    });
    if (!event) {
      throw new HttpError(404, 'Not Found', `Event ${id} not found`);
    }

    return this.prisma.event.update({
      where: { id },
      data,
      select,
    });
  }

  async delete(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select,
    });
    if (!event) {
      throw new HttpError(404, 'Not Found', `Event ${id} not found`);
    }

    return this.prisma.event.delete({
      where: { id },
      select,
    });
  }
}
