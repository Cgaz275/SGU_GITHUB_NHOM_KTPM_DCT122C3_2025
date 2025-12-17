import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { deleteFile } from '../../services/deleteFile';

jest.mock('fs');
jest.mock('../../../lib/util/getConfig');
jest.mock('../../../lib/util/registry');
jest.mock('../../../lib/helpers');

describe('deleteFile Service', () => {
  let fsMock;
  let mockGetValueSync;

  beforeEach(() => {
    jest.clearAllMocks();

    fsMock = require('fs');
    fsMock.existsSync = jest.fn();
    fsMock.lstatSync = jest.fn();
    fsMock.unlinkSync = jest.fn();

    mockGetValueSync = jest.fn((key, defaultValue) => defaultValue);
    require('../../../lib/util/registry').getValueSync = mockGetValueSync;
  });

  describe('Delete existing file', () => {
    it('should successfully delete an existing file', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('products/image.jpg');

      expect(fsMock.unlinkSync).toHaveBeenCalled();
    });

    it('should not throw error when file is deleted', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await expect(deleteFile('products/image.jpg')).resolves.toBeUndefined();
    });

    it('should accept various file types', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      const files = ['image.jpg', 'document.pdf', 'data.json'];

      for (const file of files) {
        await deleteFile(`media/${file}`);
      }

      expect(fsMock.unlinkSync).toHaveBeenCalledTimes(3);
    });
  });

  describe('Delete non-existent file', () => {
    it('should throw error for non-existent file', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await expect(deleteFile('products/nonexistent.jpg')).rejects.toThrow(
        'Requested path does not exist'
      );
    });

    it('should not call unlinkSync if file does not exist', async () => {
      fsMock.existsSync.mockReturnValue(false);

      try {
        await deleteFile('products/nonexistent.jpg');
      } catch {
        // Expected
      }

      expect(fsMock.unlinkSync).not.toHaveBeenCalled();
    });
  });

  describe('Delete directory path', () => {
    it('should throw error when trying to delete a directory', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => true
      });

      await expect(deleteFile('products/images')).rejects.toThrow(
        'Requested path is not a file'
      );
    });

    it('should not call unlinkSync when target is directory', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => true
      });

      try {
        await deleteFile('products/images');
      } catch {
        // Expected
      }

      expect(fsMock.unlinkSync).not.toHaveBeenCalled();
    });
  });

  describe('Path validation', () => {
    it('should check file existence before deletion', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('products/image.jpg');

      expect(fsMock.existsSync).toHaveBeenCalled();
    });

    it('should use lstatSync to verify file type', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('products/image.jpg');

      expect(fsMock.lstatSync).toHaveBeenCalled();
    });

    it('should handle nested paths', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('products/2024/january/image.jpg');

      expect(fsMock.unlinkSync).toHaveBeenCalled();
    });
  });

  describe('File type verification', () => {
    it('should call isDirectory on file stats', async () => {
      const mockStats = {
        isDirectory: jest.fn().mockReturnValue(false)
      };
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue(mockStats);

      await deleteFile('products/image.jpg');

      expect(mockStats.isDirectory).toHaveBeenCalled();
    });

    it('should validate file before unlinking', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('products/image.jpg');

      expect(fsMock.lstatSync).toHaveBeenCalledBefore(fsMock.unlinkSync);
    });
  });

  describe('Multiple file deletion', () => {
    it('should delete multiple files in sequence', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      const files = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

      for (const file of files) {
        await deleteFile(`products/${file}`);
      }

      expect(fsMock.unlinkSync).toHaveBeenCalledTimes(3);
    });

    it('should handle deletion errors gracefully', async () => {
      fsMock.existsSync.mockReturnValueOnce(true);
      fsMock.lstatSync.mockReturnValueOnce({
        isDirectory: () => false
      });
      fsMock.unlinkSync.mockImplementationOnce(() => {
        throw new Error('Permission denied');
      });

      await expect(deleteFile('products/protected.jpg')).rejects.toThrow();
    });
  });

  describe('Error message accuracy', () => {
    it('should provide accurate error message for missing file', async () => {
      fsMock.existsSync.mockReturnValue(false);

      try {
        await deleteFile('products/missing.jpg');
      } catch (error) {
        expect(error.message).toBe('Requested path does not exist');
      }
    });

    it('should provide accurate error message for directory', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => true
      });

      try {
        await deleteFile('products/folder');
      } catch (error) {
        expect(error.message).toBe('Requested path is not a file');
      }
    });
  });
});
