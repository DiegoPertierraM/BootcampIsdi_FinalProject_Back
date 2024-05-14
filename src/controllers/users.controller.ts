import createDebug from 'debug';
import { type NextFunction, type Request, type Response } from 'express';
import { BaseController } from './base.controller.js';
import { type User, type UserCreateDto } from '../entities/user';
import {
  userCreateDtoSchema,
  userUpdateDtoSchema,
} from '../entities/user.schema.js';
import { type WithLoginRepo } from '../repositories/type.repo.js';
import { HttpError } from '../middleware/errors.middleware.js';
import { Auth } from '../services/auth.services.js';
const debug = createDebug('TFD:users:controller');

export class UsersController extends BaseController<User, UserCreateDto> {
  constructor(protected readonly repo: WithLoginRepo<User, UserCreateDto>) {
    super(repo, userCreateDtoSchema, userUpdateDtoSchema);
    debug('Instantiated users controller');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, username, password } = req.body as UserCreateDto;

    if ((!email && !username) || !password) {
      next(
        new HttpError(
          400,
          'Bad Request',
          'Email/username and password are required'
        )
      );
      return;
    }

    const error = new HttpError(
      401,
      'Unauthorized',
      'Email/username and password invalid'
    );

    try {
      const user = await this.repo.searchForLogin(
        email ? 'email' : 'username',
        email || username
      );

      if (!user) {
        next(error);
        return;
      }

      if (!(await Auth.compare(password, user.password!))) {
        next(error);
        return;
      }

      const token = Auth.signJwt({
        id: user.id!,
        role: user.role!,
      });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    if (!req.body.password || typeof req.body.password !== 'string') {
      next(
        new HttpError(
          400,
          'Bad Request',
          'Password is required and must be a string'
        )
      );
      return;
    }

    req.body.password = await Auth.hash(req.body.password as string);

    req.body.avatar = req.body.image as string;
    delete req.body.image;

    await super.create(req, res, next);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    if (req.body.password && typeof req.body.password === 'string') {
      req.body.password = await Auth.hash(req.body.password as string);
    }

    await super.update(req, res, next);
  }

  async saveMeet(
    req: Request<{ userId: string; meetId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { userId, meetId } = req.params;
    try {
      await this.repo.saveMeet(userId, meetId);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async deleteMeet(
    req: Request<{ userId: string; meetId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { userId, meetId } = req.params;
    try {
      await this.repo.deleteMeet(userId, meetId);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async addFriend(
    req: Request<{ userId: string; friendId: string }>,
    res: Response,
    next: NextFunction
  ) {
    console.log(req.params);
    const { userId, friendId } = req.params;

    try {
      await this.repo.addFriend(userId, friendId);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async getFriends(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { userId } = req.params;

    try {
      const friends = await this.repo.getFriends(userId);
      if (!friends) {
        throw new HttpError(404, 'Not Found', `User ${userId} not found`);
      }

      res.json(friends);
    } catch (error) {
      next(error);
    }
  }
}
