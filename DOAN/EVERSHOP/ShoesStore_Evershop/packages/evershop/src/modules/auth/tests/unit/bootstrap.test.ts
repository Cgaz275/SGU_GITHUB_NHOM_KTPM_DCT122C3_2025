import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('bootstrap attaches methods to express.request', () => {
    it('should attach all four methods to request object when bootstrap is called', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      expect(mockRequest.loginUserWithEmail).toBeDefined();
      expect(mockRequest.logoutUser).toBeDefined();
      expect(mockRequest.isUserLoggedIn).toBeDefined();
      expect(mockRequest.getCurrentUser).toBeDefined();
    });
  });

  describe('loginUserWithEmail method', () => {
    it('should execute all lines for loginUserWithEmail including session.save', async () => {
      const mockRequest = {};
      const mockSessionSave = jest.fn();

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      const mockLoginUserWithEmail = jest.fn(async function(email: string, password: string) {
        this.session.userID = 123;
        this.locals.user = { email, id: 123 };
      });

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: mockLoginUserWithEmail
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: undefined, save: mockSessionSave },
        locals: { user: undefined }
      };

      await mockRequest.loginUserWithEmail.call(context, 'test@example.com', 'password');

      expect(context.session.userID).toBe(123);
      expect(context.locals.user.email).toBe('test@example.com');
      expect(mockSessionSave).toHaveBeenCalled();
    });

    it('should not call session.save if session is null (covers lines 8-10 null check)', async () => {
      const mockRequest = {};
      const mockSessionSave = jest.fn();

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: null,
        locals: { user: undefined }
      };

      await mockRequest.loginUserWithEmail.call(context, 'test@example.com', 'password');

      expect(mockSessionSave).not.toHaveBeenCalled();
    });

    it('should call session.save with callback (covers lines 8-10 callback path)', async () => {
      const mockRequest = {};
      const mockSessionSave = jest.fn();

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: undefined, save: mockSessionSave },
        locals: { user: undefined }
      };

      const callback = jest.fn();
      await mockRequest.loginUserWithEmail.call(context, 'test@example.com', 'password', callback);

      expect(mockSessionSave).toHaveBeenCalledWith(callback);
    });
  });

  describe('logoutUser method', () => {
    it('should execute all lines for logoutUser including session.save', async () => {
      const mockRequest = {};
      const mockSessionSave = jest.fn();

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn(function() {
          this.session.userID = undefined;
          this.locals.user = undefined;
        })
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: 123, save: mockSessionSave },
        locals: { user: { id: 123 } }
      };

      mockRequest.logoutUser.call(context);

      expect(mockSessionSave).toHaveBeenCalled();
    });

    it('should not call session.save if session is null (covers lines 15-17 null check)', async () => {
      const mockRequest = {};
      const mockSessionSave = jest.fn();

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: null,
        locals: { user: undefined }
      };

      mockRequest.logoutUser.call(context);

      expect(mockSessionSave).not.toHaveBeenCalled();
    });

    it('should call session.save with callback (covers lines 15-17 callback path)', async () => {
      const mockRequest = {};
      const mockSessionSave = jest.fn();

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: 123, save: mockSessionSave },
        locals: { user: { id: 123 } }
      };

      const callback = jest.fn();
      mockRequest.logoutUser.call(context, callback);

      expect(mockSessionSave).toHaveBeenCalledWith(callback);
    });
  });

  describe('isUserLoggedIn method', () => {
    it('should return true when userID is truthy (covers line 22)', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: 123 },
        locals: {}
      };

      const result = mockRequest.isUserLoggedIn.call(context);

      expect(result).toBe(true);
    });

    it('should return false when userID is falsy (covers line 22 falsy values)', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const falsyValues = [undefined, null, 0, '', false];

      falsyValues.forEach((falsyValue) => {
        const context = {
          session: { userID: falsyValue },
          locals: {}
        };

        const result = mockRequest.isUserLoggedIn.call(context);
        expect(result).toBe(false);
      });
    });

    it('should return true for various truthy userID values', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const truthyValues = [1, 123, 'uuid-123', 'admin', true];

      truthyValues.forEach((truthyValue) => {
        const context = {
          session: { userID: truthyValue },
          locals: {}
        };

        const result = mockRequest.isUserLoggedIn.call(context);
        expect(result).toBe(true);
      });
    });
  });

  describe('getCurrentUser method', () => {
    it('should return user object (covers line 26)', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const userData = {
        admin_user_id: 123,
        email: 'admin@test.com',
        status: 1
      };

      const context = {
        session: { userID: 123 },
        locals: { user: userData }
      };

      const result = mockRequest.getCurrentUser.call(context);

      expect(result).toEqual(userData);
    });

    it('should return undefined when user is not set (covers line 26 undefined)', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: 123 },
        locals: { user: undefined }
      };

      const result = mockRequest.getCurrentUser.call(context);

      expect(result).toBeUndefined();
    });

    it('should return null when user is explicitly null', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: 123 },
        locals: { user: null }
      };

      const result = mockRequest.getCurrentUser.call(context);

      expect(result).toBeNull();
    });

    it('should return user with multiple properties', async () => {
      const mockRequest = {};

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn()
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn()
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const userData = {
        admin_user_id: 456,
        email: 'user@example.com',
        status: 1,
        fullName: 'John Doe',
        uuid: 'uuid-123',
        roles: 'admin,editor'
      };

      const context = {
        session: { userID: 456 },
        locals: { user: userData }
      };

      const result = mockRequest.getCurrentUser.call(context);

      expect(result).toEqual(userData);
      expect(result.admin_user_id).toBe(456);
      expect(result.email).toBe('user@example.com');
      expect(result.fullName).toBe('John Doe');
    });
  });

  describe('Complete authentication workflow', () => {
    it('should handle login, check logged in status, and logout', async () => {
      const mockRequest = {};
      const mockSessionSave = jest.fn();

      jest.unstable_mockModule('express', () => ({
        request: mockRequest
      }));

      jest.unstable_mockModule('../../services/loginUserWithEmail.js', () => ({
        loginUserWithEmail: jest.fn(async function(email: string, password: string) {
          this.session.userID = 1;
          this.locals.user = { admin_user_id: 1, email };
        })
      }));

      jest.unstable_mockModule('../../services/logoutUser.js', () => ({
        logoutUser: jest.fn(function() {
          this.session.userID = undefined;
          this.locals.user = undefined;
        })
      }));

      const { default: bootstrap } = await import('../../bootstrap.js');
      bootstrap();

      const context = {
        session: { userID: undefined, save: mockSessionSave },
        locals: { user: undefined }
      };

      expect(mockRequest.isUserLoggedIn.call(context)).toBe(false);

      await mockRequest.loginUserWithEmail.call(context, 'admin@test.com', 'password123');
      expect(mockRequest.isUserLoggedIn.call(context)).toBe(true);
      expect(mockRequest.getCurrentUser.call(context).email).toBe('admin@test.com');

      mockRequest.logoutUser.call(context);
      expect(mockRequest.isUserLoggedIn.call(context)).toBe(false);
      expect(mockRequest.getCurrentUser.call(context)).toBeUndefined();
    });
  });
});
