import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Auth } from './auth.services';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
describe('Given the "static" class Auth', () => {
  describe('When we use the static method hash', () => {
    test('Then it should call hash from bcrypt', async () => {
      await Auth.hash('test');
      expect(hash).toHaveBeenCalled();
    });
  });

  describe('When we use the static method compare', () => {
    test('Then it should call compare from bcrypt', async () => {
      await Auth.compare('test', 'test');
      expect(compare).toHaveBeenCalled();
    });
  });

  describe('When we use the static method signJwt', () => {
    test('Then it should call sign from jwt', () => {
      Auth.secret = 'test secret';
      Auth.signJwt({ id: 'test', role: 'test' });
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe('When we use the static method signJwt', () => {
    describe('And there are not secret in process.env', () => {
      test('Then it should call sign from jwt', () => {
        Auth.secret = '';
        const result = () => Auth.signJwt({ id: 'test', role: 'test' });
        expect(result).toThrow();
      });
    });
  });

  describe('When we use the static method verifyJwt', () => {
    test('Then it should call verify from jwt', () => {
      Auth.secret = 'test secret';
      Auth.verifyJwt('test');
      expect(jwt.verify).toHaveBeenCalled();
    });
  });

  describe('When we use the static method verifyJwt', () => {
    describe('And there are not secret in process.env', () => {
      test('Then it should call verify from jwt', () => {
        Auth.secret = '';
        const result = () => Auth.verifyJwt('test');
        expect(result).toThrow();
      });
    });
  });
});
