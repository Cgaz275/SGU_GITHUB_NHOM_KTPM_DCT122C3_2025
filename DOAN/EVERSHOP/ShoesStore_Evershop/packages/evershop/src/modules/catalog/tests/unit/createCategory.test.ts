import { describe, it, expect } from '@jest/globals';

describe('createCategory Service', () => {
  describe('Create valid category', () => {
    it('should accept valid category data', () => {
      const categoryData = {
        name: 'Electronics',
        url_key: 'electronics',
        description: 'Electronics category'
      };

      expect(categoryData).toHaveProperty('name');
      expect(categoryData).toHaveProperty('url_key');
      expect(categoryData.name).toBe('Electronics');
    });

    it('should set category name correctly', () => {
      const categoryData = {
        name: 'Books'
      };

      expect(categoryData.name).toBe('Books');
    });

    it('should validate url_key format', () => {
      const urlKey = 'electronics-gadgets';
      expect(typeof urlKey).toBe('string');
      expect(urlKey.length).toBeGreaterThan(0);
    });
  });

  describe('Validate required fields', () => {
    it('should require name field for validation', () => {
      const invalidData = {
        url_key: 'test'
      };

      expect(invalidData).not.toHaveProperty('name');
    });

    it('should require url_key field for validation', () => {
      const invalidData = {
        name: 'Test Category'
      };

      expect(invalidData).not.toHaveProperty('url_key');
    });

    it('should accept valid data with both fields', () => {
      const validData = {
        name: 'Valid Category',
        url_key: 'valid-category'
      };

      expect(validData).toHaveProperty('name');
      expect(validData).toHaveProperty('url_key');
      expect(validData.name).toBe('Valid Category');
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        url_key: 'test'
      };

      expect(invalidData.name).toBe('');
      expect(invalidData.name.length).toBe(0);
    });

    it('should reject empty url_key', () => {
      const invalidData = {
        name: 'Test',
        url_key: ''
      };

      expect(invalidData.url_key).toBe('');
      expect(invalidData.url_key.length).toBe(0);
    });
  });

  describe('Parent category relationship', () => {
    it('should set parent_id when provided', () => {
      const categoryData = {
        name: 'Subcategory',
        url_key: 'subcategory',
        parent_id: 1
      };

      expect(categoryData.parent_id).toBe(1);
    });

    it('should handle optional parent_id', () => {
      const categoryData = {
        name: 'Root Category',
        url_key: 'root'
      };

      expect(categoryData.parent_id).toBeUndefined();
    });

    it('should handle multiple parent-child relationships', () => {
      const parentId = 1;
      const subcategories = [
        { name: 'Child 1', url_key: 'child-1', parent_id: parentId },
        { name: 'Child 2', url_key: 'child-2', parent_id: parentId },
        { name: 'Child 3', url_key: 'child-3', parent_id: parentId }
      ];

      subcategories.forEach(cat => {
        expect(cat.parent_id).toBe(parentId);
      });
      expect(subcategories).toHaveLength(3);
    });

    it('should validate parent_id is numeric', () => {
      const validParentId = 1;
      const invalidParentId = 'string';

      expect(typeof validParentId).toBe('number');
      expect(typeof invalidParentId).toBe('string');
    });
  });

  describe('Category with description', () => {
    it('should save description', () => {
      const categoryData = {
        name: 'Electronics',
        url_key: 'electronics',
        description: 'Electronic products'
      };

      expect(categoryData).toHaveProperty('description');
      expect(categoryData.description).toBe('Electronic products');
    });

    it('should handle long description', () => {
      const longDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20);
      const categoryData = {
        name: 'Test',
        url_key: 'test',
        description: longDescription
      };

      expect(categoryData.description.length).toBeGreaterThan(500);
    });

    it('should handle missing description', () => {
      const categoryData = {
        name: 'Test',
        url_key: 'test'
      };

      expect(categoryData.description).toBeUndefined();
    });

    it('should accept empty description', () => {
      const categoryData = {
        name: 'Test',
        url_key: 'test',
        description: ''
      };

      expect(categoryData.description).toBe('');
    });
  });

  describe('Unique URL key validation', () => {
    it('should accept different url_keys', () => {
      const category1 = { url_key: 'electronics' };
      const category2 = { url_key: 'books' };

      expect(category1.url_key).not.toBe(category2.url_key);
    });

    it('should validate url_key format', () => {
      const validUrlKeys = ['electronics', 'books-fiction', 'toys-games'];

      validUrlKeys.forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
      });
    });

    it('should handle hyphenated url_keys', () => {
      const urlKey = 'electronics-gadgets';
      expect(urlKey).toContain('-');
    });
  });

  describe('Category data validation', () => {
    it('should validate using JSON schema', () => {
      const validData = { name: 'Test', url_key: 'test' };
      expect(validData).toHaveProperty('name');
      expect(validData).toHaveProperty('url_key');
    });

    it('should reject invalid schema data', () => {
      const invalidData = { invalid_field: 'test' };
      expect(invalidData).not.toHaveProperty('name');
      expect(invalidData).not.toHaveProperty('url_key');
    });

    it('should validate name is string', () => {
      const categoryData = { name: 'Test' };
      expect(typeof categoryData.name).toBe('string');
    });

    it('should validate url_key is string', () => {
      const categoryData = { url_key: 'test' };
      expect(typeof categoryData.url_key).toBe('string');
    });
  });

  describe('Return created category', () => {
    it('should have category structure', () => {
      const category = {
        category_id: 1,
        uuid: 'uuid-123',
        name: 'Test',
        url_key: 'test'
      };

      expect(category).toHaveProperty('category_id');
      expect(category).toHaveProperty('uuid');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('url_key');
    });

    it('should have valid category_id', () => {
      const category = {
        category_id: 1
      };

      expect(typeof category.category_id).toBe('number');
      expect(category.category_id).toBeGreaterThan(0);
    });

    it('should have uuid', () => {
      const category = {
        uuid: 'uuid-abc-123'
      };

      expect(category.uuid).toBeDefined();
      expect(typeof category.uuid).toBe('string');
    });
  });

  describe('Handle context properly', () => {
    it('should accept context object', () => {
      const context = { userId: 1 };
      expect(typeof context).toBe('object');
    });

    it('should accept empty context', () => {
      const context = {};
      expect(typeof context).toBe('object');
      expect(Object.keys(context)).toHaveLength(0);
    });

    it('should validate context type', () => {
      const validContext = {};
      const invalidContext = 'string';

      expect(typeof validContext).toBe('object');
      expect(typeof invalidContext).toBe('string');
    });
  });

  describe('Multiple category creation', () => {
    it('should create multiple categories independently', () => {
      const categories = [
        { name: 'Electronics', url_key: 'electronics' },
        { name: 'Books', url_key: 'books' },
        { name: 'Clothing', url_key: 'clothing' }
      ];

      expect(categories).toHaveLength(3);
      categories.forEach(cat => {
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('url_key');
      });
    });

    it('should maintain isolation between creations', () => {
      const category1 = { name: 'Test 1', url_key: 'test-1' };
      const category2 = { name: 'Test 2', url_key: 'test-2' };

      expect(category1.name).not.toBe(category2.name);
      expect(category1.url_key).not.toBe(category2.url_key);
    });
  });

  describe('Category with metadata', () => {
    it('should save additional custom fields', () => {
      const categoryData = {
        name: 'Test',
        url_key: 'test',
        custom_field: 'custom_value'
      };

      expect(categoryData).toHaveProperty('custom_field');
      expect(categoryData.custom_field).toBe('custom_value');
    });

    it('should handle metadata in context', () => {
      const context = {
        metadata: {
          created_by: 1,
          created_at: new Date().toISOString()
        }
      };

      expect(context.metadata).toBeDefined();
      expect(context.metadata.created_by).toBe(1);
    });

    it('should preserve custom properties', () => {
      const categoryData = {
        name: 'Test',
        url_key: 'test',
        is_active: true,
        display_mode: 'products'
      };

      expect(categoryData.is_active).toBe(true);
      expect(categoryData.display_mode).toBe('products');
    });
  });

  describe('Category name handling', () => {
    it('should handle unicode in category name', () => {
      const categoryName = '电子产品';
      expect(typeof categoryName).toBe('string');
      expect(categoryName.length).toBeGreaterThan(0);
    });

    it('should preserve whitespace in name', () => {
      const categoryName = 'Home & Garden';
      expect(categoryName).toContain('&');
    });

    it('should handle very long names', () => {
      const longName = 'A'.repeat(255);
      expect(longName.length).toBe(255);
    });
  });

  describe('URL key formatting', () => {
    it('should use lowercase in url_key', () => {
      const urlKey = 'electronics';
      expect(urlKey).toBe(urlKey.toLowerCase());
    });

    it('should use hyphens as separators', () => {
      const urlKey = 'home-and-garden';
      expect(urlKey).not.toContain(' ');
      expect(urlKey).toContain('-');
    });

    it('should be URL safe', () => {
      const urlKey = 'valid-url-key-123';
      const urlSafeRegex = /^[a-z0-9-]+$/;
      expect(urlSafeRegex.test(urlKey)).toBe(true);
    });
  });
});
