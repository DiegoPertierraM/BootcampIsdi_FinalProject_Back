export type Repo<T, C> = {
  readAll(): Promise<T[]>;
  readById(id: string): Promise<T>;
  create(data: C): Promise<T>;
  update(id: string, data: Partial<C>): Promise<T>;
  delete(id: string): Promise<T>;
};

export type WithLoginRepo<T, C> = Repo<T, C> & {
  searchForLogin(key: 'email' | 'username', value: string): Promise<Partial<T>>;
  manageMeet(
    userId: string,
    meetId: string,
    operation: 'post' | 'delete',
    meetType: 'savedMeets' | 'joinedMeets'
  ): Promise<Partial<T>>;
  addFriend(userId: string, friendId: string): Promise<Partial<T>>;
  getFriends(userId: string): Promise<Partial<T[]>>;
};
