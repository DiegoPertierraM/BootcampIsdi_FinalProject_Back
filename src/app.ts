import { type PrismaClient } from '@prisma/client';
import cors from 'cors';
import createDebug from 'debug';
import express, { type Express } from 'express';
import morgan from 'morgan';
import { UsersRepo } from './repositories/users.repo.js';
import { UsersRouter } from './routers/users.router.js';
import { UsersController } from './controllers/users.controller.js';
import { AuthInterceptor } from './middleware/auth.interceptor.js';
import { FilesInterceptor } from './middleware/files.interceptor.js';
import { ErrorsMiddleware } from './middleware/errors.middleware.js';
import { MeetsRepo } from './repositories/meets.repo.js';
import { MeetsController } from './controllers/meets.controller.js';
import { MeetsRouter } from './routers/meets.router.js';

const debug = createDebug('TFD:app');
export const createApp = () => {
  debug('Creating app');
  return express();
};

export const startApp = (app: Express, prisma: PrismaClient) => {
  debug('Starting app');
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors());

  const authInterceptor = new AuthInterceptor();
  const filesInterceptor = new FilesInterceptor();

  const meetsRepo = new MeetsRepo(prisma);
  const meetsController = new MeetsController(meetsRepo);
  const meetsRouter = new MeetsRouter(
    meetsController,
    authInterceptor,
    filesInterceptor,
    meetsRepo
  );
  app.use('/meets', meetsRouter.router);

  const usersRepo = new UsersRepo(prisma);
  const usersController = new UsersController(usersRepo);
  const usersRouter = new UsersRouter(
    usersController,
    authInterceptor,
    filesInterceptor
  );
  app.use('/users', usersRouter.router);

  const errorsMiddleware = new ErrorsMiddleware();
  app.use(errorsMiddleware.handle.bind(errorsMiddleware));
};
