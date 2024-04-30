import { type UsersController } from '../controllers/users.controller';
import { UsersRouter } from './users.router';

describe('Given an instance of the class UsersRouter', () => {
  const controller = {
    getAll: jest.fn(),
  } as unknown as UsersController;
  const router = new UsersRouter(controller);

  it('should be instance of the class', () => {
    expect(router).toBeInstanceOf(UsersRouter);
  });
});
