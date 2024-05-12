import { type Event } from './event';

export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'guest';
  avatar: string;
  location: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'unspecified';
  bio: string;
  events: Array<Partial<Event>>;
  createdEvents: Array<Partial<Event>>;
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
  gender: 'male' | 'female' | 'unspecified';
  bio?: string;
};

export type UserUpdateDto = Partial<UserCreateDto>;
