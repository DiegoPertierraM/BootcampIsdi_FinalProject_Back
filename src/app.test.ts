import { type PrismaClient } from '@prisma/client';
import { createApp, startApp } from './app';

describe('Given the function createApp', () => {
  it('should be called and return app', () => {
    const app = createApp();
    expect(app).toBeDefined();
  });
});

describe('Given the function startApp', () => {
  it('should be called and return app', () => {
    const app = createApp();
    jest.spyOn(app, 'use');
    const prisma = {} as unknown as PrismaClient;
    startApp(app, prisma);
    expect(app.use).toHaveBeenCalled();
  });
});
