import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type AuthInterceptor } from '../middleware/auth.interceptor.js';
import { type FilesInterceptor } from '../middleware/files.interceptor.js';
import { type EventsController } from '../controllers/events.controller.js';
import { type EventsRepo } from '../repositories/events.repo.js';

const debug = createDebug('TFD:events:router');

export class EventsRouter {
  router = createRouter();

  constructor(
    readonly controller: EventsController,
    readonly authInterceptor: AuthInterceptor,
    readonly filesInterceptor: FilesInterceptor,
    readonly eventsRepo: EventsRepo
  ) {
    debug('Instantiated events router');

    this.router.get(
      '/',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getAll.bind(controller)
    );
    this.router.get(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getById.bind(controller)
    );
    this.router.post(
      '/',
      authInterceptor.authentication.bind(authInterceptor),
      filesInterceptor.singleFile('image'),
      filesInterceptor.cloudinaryUpload.bind(filesInterceptor),
      controller.create.bind(controller)
    );

    this.router.patch(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      authInterceptor
        .authorization(eventsRepo, 'creator')
        .bind(authInterceptor),
      controller.update.bind(controller)
    );
    this.router.delete(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      authInterceptor
        .authorization(eventsRepo, 'creator')
        .bind(authInterceptor),
      controller.delete.bind(controller)
    );
  }
}
