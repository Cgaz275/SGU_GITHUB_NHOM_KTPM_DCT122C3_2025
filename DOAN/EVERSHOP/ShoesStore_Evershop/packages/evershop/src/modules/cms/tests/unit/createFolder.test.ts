import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createFolder } from '../../services/createFolder';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('../../../lib/util/getConfig');
jest.mock('../../../lib/util/registry');
jest.mock('../../../lib/helpers');

describe('createFolder Service', () => {
  let fsMock;
  let fsPromisesMock;
  let mockGetValueSync;

  beforeEach(() => {
    jest.clearAllMocks();

    fsMock = require('fs');
    fsMock.existsSync = jest.fn();

    fsPromisesMock = require('fs/promises');
    fsPromisesMock.mkdir = jest.fn().mockResolvedValue(undefined);

    mockGetValueSync = jest.fn((key, defaultValue) => defaultValue);
    require('../../../lib/util/registry').getValueSync = mockGetValueSync;
  });

  describe('Create new folder', () => {
    it('should successfully create a new folder', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('products');

      expect(fsPromisesMock.mkdir).toHaveBeenCalled();
      expect(result).toBe('products');
    });

    it('should return the destination path', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('products/images');

      expect(result).toBe('products/images');
    });

    it('should not throw error on successful creation', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await expect(createFolder('products')).resolves.toBe('products');
    });
  });

  describe('Create nested folders', () => {
    it('should create nested directory structure', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('products/images/2024');

      expect(fsPromisesMock.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('products/images/2024'),
        { recursive: true }
      );
    });

    it('should handle deep directory paths', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('a/b/c/d/e');

      expect(result).toBe('a/b/c/d/e');
      expect(fsPromisesMock.mkdir).toHaveBeenCalled();
    });

    it('should create intermediate directories', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('products/2024/january/images');

      expect(fsPromisesMock.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('products/2024/january/images'),
        { recursive: true }
      );
    });
  });

  describe('Folder already exists', () => {
    it('should return path if folder already exists', async () => {
      fsMock.existsSync.mockReturnValue(true);

      const result = await createFolder('products');

      expect(result).toBe('products');
    });

    it('should not call mkdir if folder exists', async () => {
      fsMock.existsSync.mockReturnValue(true);

      await createFolder('products');

      expect(fsPromisesMock.mkdir).not.toHaveBeenCalled();
    });

    it('should handle existing nested folders', async () => {
      fsMock.existsSync.mockReturnValue(true);

      const result = await createFolder('products/images/2024');

      expect(result).toBe('products/images/2024');
    });
  });

  describe('Recursive creation', () => {
    it('should use recursive option in mkdir', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('products/images');

      expect(fsPromisesMock.mkdir).toHaveBeenCalledWith(
        expect.any(String),
        { recursive: true }
      );
    });

    it('should allow mkdir to create parent directories', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('new/parent/child');

      const mockCall = fsPromisesMock.mkdir.mock.calls[0];
      expect(mockCall[1]).toEqual({ recursive: true });
    });
  });

  describe('Path normalization', () => {
    it('should handle paths with multiple separators', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('products//images');

      expect(result).toBe('products//images');
    });

    it('should return input path without modification', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('products/images/2024');

      expect(result).toBe('products/images/2024');
    });

    it('should preserve path case', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('Products/Images');

      expect(result).toBe('Products/Images');
    });
  });

  describe('Handle deep paths', () => {
    it('should handle 5+ level deep folders', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('a/b/c/d/e/f');

      expect(result).toBe('a/b/c/d/e/f');
      expect(fsPromisesMock.mkdir).toHaveBeenCalled();
    });

    it('should handle very deep directory structures', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const path = Array(20).fill('level').join('/');
      const result = await createFolder(path);

      expect(result).toBe(path);
    });
  });

  describe('Empty path handling', () => {
    it('should handle empty path gracefully', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('');

      expect(result).toBeDefined();
    });

    it('should handle root path', async () => {
      fsMock.existsSync.mockReturnValue(true);

      const result = await createFolder('/');

      expect(result).toBe('/');
    });
  });

  describe('Existence checking', () => {
    it('should check folder existence before creation', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('products');

      expect(fsMock.existsSync).toHaveBeenCalled();
    });

    it('should handle varying existence states', async () => {
      fsMock.existsSync
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      await createFolder('products');
      await createFolder('images');
      await createFolder('documents');

      expect(fsMock.existsSync).toHaveBeenCalledTimes(3);
    });
  });
});
