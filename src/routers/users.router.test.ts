import { type UsersController } from '../controllers/users.controller';
import { type AuthInterceptor } from '../middleware/auth.interceptor';
import { type FilesInterceptor } from '../middleware/files.interceptor';
import { UsersRouter } from './users.router';

describe('Given an instance of the class UsersRouter', () => {
  const controller = {
    login: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    saveMeet: jest.fn(),
    deleteMeet: jest.fn(),
    addFriend: jest.fn(),
    getFriends: jest.fn(),
  } as unknown as UsersController;

  const authInterceptor = {
    authentication: jest.fn(),
  } as unknown as AuthInterceptor;

  const fileInterceptor: FilesInterceptor = {
    singleFile: jest.fn().mockReturnValue(jest.fn()),
    cloudinaryUpload: jest.fn(),
  } as unknown as FilesInterceptor;

  const router = new UsersRouter(controller, authInterceptor, fileInterceptor);

  it('should be instance of the class', () => {
    expect(router).toBeInstanceOf(UsersRouter);
  });
});
