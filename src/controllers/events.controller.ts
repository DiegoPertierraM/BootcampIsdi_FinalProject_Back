import createDebug from 'debug';
import { BaseController } from './base.controller.js';
import { type Event, type EventCreateDto } from '../entities/event.js';
import {
  eventCreateDtoSchema,
  eventUpdateDtoSchema,
} from '../entities/event.schema.js';
import { type Repo } from '../repositories/type.repo.js';
import { type Request, type Response, type NextFunction } from 'express';
import { type Payload } from '../services/auth.services.js';
const debug = createDebug('TFD:events:controller');

export class EventsController extends BaseController<Event, EventCreateDto> {
  constructor(protected readonly repo: Repo<Event, EventCreateDto>) {
    super(repo, eventCreateDtoSchema, eventUpdateDtoSchema);
    debug('Instantiated event controller');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    debug('Creating event');
    req.body.creatorId = (req.body.payload as Payload).id;

    const { payload, ...rest } = req.body as EventCreateDto & {
      payload: Payload;
    };
    req.body = rest;

    await super.create(req, res, next);
  }
}
