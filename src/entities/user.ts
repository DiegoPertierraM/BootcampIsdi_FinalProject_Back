import { type Meet } from './meet';

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
  joinedMeets: Array<Partial<Meet>>;
  createdMeets: Array<Partial<Meet>>;
  savedMeets: Array<Partial<Meet>>;
  friends?: Array<Partial<User>>;
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
