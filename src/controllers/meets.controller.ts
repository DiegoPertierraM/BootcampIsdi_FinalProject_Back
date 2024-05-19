import createDebug from 'debug';
import { BaseController } from './base.controller.js';
import { type Meet, type MeetCreateDto } from '../entities/meet.js';
import {
  meetCreateDtoSchema,
  meetUpdateDtoSchema,
} from '../entities/meet.schema.js';
import { type MeetRepo } from '../repositories/type.repo.js';
import { type Request, type Response, type NextFunction } from 'express';
import { type Payload } from '../services/auth.services.js';
const debug = createDebug('TFD:events:controller');

export class MeetsController extends BaseController<Meet, MeetCreateDto> {
  constructor(protected readonly repo: MeetRepo<Meet, MeetCreateDto>) {
    super(repo, meetCreateDtoSchema, meetUpdateDtoSchema);
    debug('Instantiated meet controller');
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req;
      console.log(query);

      let results;
      if (query && typeof query.title === 'string') {
        results = await this.repo.searchByTitle(query.title);
      } else {
        results = await this.repo.readAll();
      }

      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
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

  async searchByTitle(req: Request, res: Response, next: NextFunction) {
    console.log('searching');
    console.log(req.query);
    try {
      const title = req.query.title as string | undefined;
      console.log(title);

      if (title === undefined) {
        return res.status(400).json({ error: 'Title parameter is missing' });
      }

      const meets = await this.repo.searchByTitle(title);
      res.json(meets);
    } catch (error) {
      next(error);
    }
  }
}
