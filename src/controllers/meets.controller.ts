import createDebug from 'debug';
import { BaseController } from './base.controller.js';
import { type Meet, type MeetCreateDto } from '../entities/meet.js';
import {
  meetCreateDtoSchema,
  meetUpdateDtoSchema,
} from '../entities/meet.schema.js';
import { type Repo } from '../repositories/type.repo.js';
import { type Request, type Response, type NextFunction } from 'express';
import { type Payload } from '../services/auth.services.js';
const debug = createDebug('TFD:events:controller');

export class MeetsController extends BaseController<Meet, MeetCreateDto> {
  constructor(protected readonly repo: Repo<Meet, MeetCreateDto>) {
    super(repo, meetCreateDtoSchema, meetUpdateDtoSchema);
    debug('Instantiated meet controller');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    debug('Creating meet');
    req.body.creatorId = (req.body.payload as Payload).id;

    const { payload, ...rest } = req.body as MeetCreateDto & {
      payload: Payload;
    };
    req.body = rest;

    await super.create(req, res, next);
  }
}
