import { type User } from './user';

export type Meet = {
  id: string;
  title: string;
  creator: Partial<User>;
  description: string;
  sport: Sport;
  date: Date;
  location: string;
  image: string;
  attendees: Array<Partial<User>>;
  comments?: Comment[];
};

export type MeetCreateDto = {
  title: string;
  creatorId: string;
  description?: string;
  sport: Sport;
  date: Date;
  location: string;
  image: string;
};

export type MeetUpdateDto = Partial<MeetCreateDto>;

export type Sport =
  | 'football'
  | 'basketball'
  | 'volleyball'
  | 'tennis'
  | 'rugby'
  | 'karate'
  | 'yoga'
  | 'running'
  | 'exercise';
