import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createFolder } from '../../services/createFolder';
import { deleteFile } from '../../services/deleteFile';
import { uploadFile } from '../../services/uploadFile';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('../../../lib/router/buildUrl');
jest.mock('../../../lib/util/getConfig');
jest.mock('../../../lib/util/registry');
jest.mock('../../../lib/helpers');

describe('Folder Operations Integration', () => {
  let fsMock;
  let fsPromisesMock;
  let mockBuildUrl;
  let mockGetValueSync;

  beforeEach(() => {
    jest.clearAllMocks();

    fsMock = require('fs');
    fsMock.existsSync = jest.fn();
    fsMock.lstatSync = jest.fn();
    fsMock.unlinkSync = jest.fn();

    fsPromisesMock = require('fs/promises');
    fsPromisesMock.mkdir = jest.fn().mockResolvedValue(undefined);
    fsPromisesMock.writeFile = jest.fn().mockResolvedValue(undefined);

    mockBuildUrl = jest.fn((route, params) => `/static/${params.join('/')}`);
    require('../../../lib/router/buildUrl').buildUrl = mockBuildUrl;

    mockGetValueSync = jest.fn((key, defaultValue) => defaultValue);
    require('../../../lib/util/registry').getValueSync = mockGetValueSync;
  });

  describe('Create and delete folder', () => {
    it('should create folder successfully', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('test-folder');

      expect(result).toBe('test-folder');
      expect(fsPromisesMock.mkdir).toHaveBeenCalled();
    });

    it('should delete file in folder', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('test-folder/file.jpg');

      expect(fsMock.unlinkSync).toHaveBeenCalled();
    });

    it('should handle folder lifecycle', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const folderName = 'lifecycle-test';
      await createFolder(folderName);

      expect(fsPromisesMock.mkdir).toHaveBeenCalled();
    });
  });

  describe('Upload to created folder', () => {
    it('should upload file to newly created folder', async () => {
      fsMock.existsSync
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);

      const folder = 'new-product-folder';
      await createFolder(folder);

      const file = {
        filename: 'product.jpg',
        buffer: Buffer.from('image data'),
        mimetype: 'image/jpeg',
        size: 1024
      };

      const result = await uploadFile([file], folder);

      expect(result[0]).toHaveProperty('url');
      expect(fsPromisesMock.writeFile).toHaveBeenCalled();
    });

    it('should create folder and upload multiple files', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const folder = 'product-images';
      await createFolder(folder);

      const files = [
        {
          filename: 'image1.jpg',
          buffer: Buffer.from('data1'),
          mimetype: 'image/jpeg',
          size: 1024
        },
        {
          filename: 'image2.jpg',
          buffer: Buffer.from('data2'),
          mimetype: 'image/jpeg',
          size: 2048
        }
      ];

      const result = await uploadFile(files, folder);

      expect(result).toHaveLength(2);
      expect(fsPromisesMock.writeFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('Nested folder operations', () => {
    it('should create nested directory structure', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const nestedPath = 'parent/child/grandchild';
      const result = await createFolder(nestedPath);

      expect(result).toBe(nestedPath);
      expect(fsPromisesMock.mkdir).toHaveBeenCalled();
    });

    it('should upload files to nested folder', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const nestedPath = 'products/2024/january';
      await createFolder(nestedPath);

      const file = {
        filename: 'product.jpg',
        buffer: Buffer.from('image'),
        mimetype: 'image/jpeg',
        size: 1024
      };

      const result = await uploadFile([file], nestedPath);

      expect(result[0]).toHaveProperty('url');
      expect(result[0].url).toContain('january');
    });

    it('should handle deeply nested paths', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const deepPath = 'a/b/c/d/e/f';
      const result = await createFolder(deepPath);

      expect(result).toBe(deepPath);
    });
  });

  describe('Delete folder with files', () => {
    it('should delete file before folder', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('folder/file.jpg');

      expect(fsMock.unlinkSync).toHaveBeenCalled();
    });

    it('should handle multiple file deletions from folder', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      const files = ['file1.jpg', 'file2.jpg', 'file3.jpg'];

      for (const file of files) {
        await deleteFile(`folder/${file}`);
      }

      expect(fsMock.unlinkSync).toHaveBeenCalledTimes(3);
    });
  });

  describe('Folder path validation', () => {
    it('should validate path during creation', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const path = 'valid/path/structure';
      const result = await createFolder(path);

      expect(result).toBe(path);
    });

    it('should handle path normalization', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const result = await createFolder('products/images');

      expect(result).toBe('products/images');
    });

    it('should preserve path during operations', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const originalPath = 'original/path';
      const result = await createFolder(originalPath);

      expect(result).toBe(originalPath);
    });
  });

  describe('Folder existence check', () => {
    it('should check existence before creating', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('products');

      expect(fsMock.existsSync).toHaveBeenCalled();
    });

    it('should verify file existence before deletion', async () => {
      fsMock.existsSync.mockReturnValue(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      await deleteFile('products/file.jpg');

      expect(fsMock.existsSync).toHaveBeenCalled();
    });

    it('should handle varying existence states', async () => {
      fsMock.existsSync
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      await createFolder('folder1');
      await createFolder('folder2');
      await createFolder('folder3');

      expect(fsMock.existsSync).toHaveBeenCalledTimes(3);
    });
  });

  describe('Create multiple folders', () => {
    it('should create multiple independent folders', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const folders = ['folder1', 'folder2', 'folder3'];

      for (const folder of folders) {
        await createFolder(folder);
      }

      expect(fsPromisesMock.mkdir).toHaveBeenCalledTimes(3);
    });

    it('should create sibling folders', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('products');
      await createFolder('images');
      await createFolder('documents');

      expect(fsPromisesMock.mkdir).toHaveBeenCalledTimes(3);
    });

    it('should create hierarchical folders', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('main');
      await createFolder('main/sub1');
      await createFolder('main/sub2');

      expect(fsPromisesMock.mkdir).toHaveBeenCalledTimes(3);
    });
  });

  describe('Folder isolation', () => {
    it('should keep files in separate folders isolated', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const file1 = {
        filename: 'file.jpg',
        buffer: Buffer.from('data1'),
        mimetype: 'image/jpeg',
        size: 1024
      };

      const file2 = {
        filename: 'file.jpg',
        buffer: Buffer.from('data2'),
        mimetype: 'image/jpeg',
        size: 2048
      };

      await uploadFile([file1], 'folder-a');
      await uploadFile([file2], 'folder-b');

      expect(fsPromisesMock.writeFile).toHaveBeenCalledTimes(2);

      const calls = fsPromisesMock.writeFile.mock.calls;
      expect(calls[0][0]).toContain('folder-a');
      expect(calls[1][0]).toContain('folder-b');
    });

    it('should maintain folder independence', async () => {
      fsMock.existsSync.mockReturnValue(false);

      await createFolder('folderA/subfolder');
      await createFolder('folderB/subfolder');

      expect(fsPromisesMock.mkdir).toHaveBeenCalledTimes(2);

      const calls = fsPromisesMock.mkdir.mock.calls;
      expect(calls[0][0]).toContain('folderA');
      expect(calls[1][0]).toContain('folderB');
    });

    it('should handle same filename in different folders', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const file = {
        filename: 'image.jpg',
        buffer: Buffer.from('data'),
        mimetype: 'image/jpeg',
        size: 1024
      };

      await uploadFile([file], 'folder-1');
      await uploadFile([file], 'folder-2');

      expect(fsPromisesMock.writeFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('Complex folder scenarios', () => {
    it('should handle create, upload, and delete sequence', async () => {
      fsMock.existsSync
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      fsMock.lstatSync.mockReturnValue({
        isDirectory: () => false
      });

      const folder = 'workflow-test';
      await createFolder(folder);

      const file = {
        filename: 'test.jpg',
        buffer: Buffer.from('data'),
        mimetype: 'image/jpeg',
        size: 1024
      };

      await uploadFile([file], folder);
      await deleteFile(`${folder}/test.jpg`);

      expect(fsPromisesMock.mkdir).toHaveBeenCalled();
      expect(fsPromisesMock.writeFile).toHaveBeenCalled();
      expect(fsMock.unlinkSync).toHaveBeenCalled();
    });

    it('should manage multiple files in multiple folders', async () => {
      fsMock.existsSync.mockReturnValue(false);

      const folders = ['products', 'images', 'documents'];
      for (const folder of folders) {
        await createFolder(folder);
      }

      const files = [
        { filename: 'file1.jpg', buffer: Buffer.from('1'), mimetype: 'image/jpeg', size: 100 },
        { filename: 'file2.jpg', buffer: Buffer.from('2'), mimetype: 'image/jpeg', size: 200 }
      ];

      for (const folder of folders) {
        await uploadFile(files, folder);
      }

      expect(fsPromisesMock.mkdir).toHaveBeenCalledTimes(3);
      expect(fsPromisesMock.writeFile).toHaveBeenCalledTimes(6);
    });
  });
});
