import Joi from 'joi';

export type User = {
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'guest';
  avatar: string;
  location: string;
  birthDate: Date;
  gender: string;
  bio: string;
  events?: Event[];
  friends?: User[];
  comments?: Comment[];
};

export type UserCreateDto = {
  username: string;
  email: string;
  password: string;
  avatar: string;
  location: string;
  birthDateString: string;
  gender: string;
  bio?: string;
};

export type UserUpdateDto = Partial<UserCreateDto>;
