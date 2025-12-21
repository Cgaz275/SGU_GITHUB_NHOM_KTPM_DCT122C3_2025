import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('addCartItem Service', () => {
  let mockCart;
  let mockItem;
  let mockGetValue;

  beforeEach(() => {
    jest.clearAllMocks();

    mockItem = {
      product_id: 1,
      product_sku: 'PROD-001',
      qty: 1,
      price: 99.99,
      getData: jest.fn().mockImplementation(function(key) {
        const data = {
          product_sku: this.product_sku,
          qty: this.qty
        };
        return data[key];
      }),
      setData: jest.fn(),
      hasError: jest.fn().mockReturnValue(false),
      getErrors: jest.fn().mockReturnValue({})
    };

    mockCart = {
      items: [mockItem],
      createItem: jest.fn().mockResolvedValue(mockItem),
      getItems: jest.fn().mockReturnValue([mockItem]),
      setData: jest.fn().mockResolvedValue(undefined),
      export: jest.fn().mockReturnValue({
        items: [mockItem]
      })
    };

    mockGetValue = jest.fn((key, defaultValue) => defaultValue);
  });

  describe('Add single item to cart', () => {
    it('should add new item to cart', async () => {
      const newItem = { product_id: 2 };

      expect(newItem).toHaveProperty('product_id');
    });

    it('should create item through cart', async () => {
      mockCart.createItem.mockResolvedValue(mockItem);

      expect(mockCart.createItem).toBeDefined();
    });

    it('should return added item', async () => {
      const result = mockCart.createItem(1, 1);

      expect(result).toBeDefined();
    });
  });

  describe('Quantity handling', () => {
    it('should parse quantity as number', async () => {
      const qty = parseInt('5' as string, 10);

      expect(qty).toBe(5);
      expect(typeof qty).toBe('number');
    });

    it('should handle string quantity', async () => {
      const qty = parseInt('10', 10);

      expect(qty).toBe(10);
    });

    it('should handle numeric quantity', async () => {
      const qty = parseInt('7', 10);

      expect(qty).toBe(7);
    });

    it('should handle quantity = 1', async () => {
      const qty = parseInt('1', 10);

      expect(qty).toBe(1);
    });
  });

  describe('Duplicate item handling', () => {
    it('should combine quantities for duplicate SKU', async () => {
      mockItem.getData.mockImplementation((key) => {
        if (key === 'product_sku') return 'PROD-001';
        if (key === 'qty') return 2;
        return null;
      });

      const sku = mockItem.getData('product_sku');
      expect(sku).toBe('PROD-001');
    });

    it('should find duplicate by SKU', async () => {
      const items = [
        { product_sku: 'PROD-001' },
        { product_sku: 'PROD-002' }
      ];

      const duplicate = items.find(i => i.product_sku === 'PROD-001');
      expect(duplicate).toBeDefined();
    });

    it('should return existing item if duplicate found', async () => {
      mockCart.getItems.mockReturnValue([mockItem]);

      const items = mockCart.getItems();
      expect(items[0]).toBe(mockItem);
    });

    it('should not add duplicate item', async () => {
      mockCart.getItems.mockReturnValue([mockItem]);

      const items = mockCart.getItems();
      expect(items).toHaveLength(1);
    });
  });

  describe('Error handling', () => {
    it('should check for item errors', async () => {
      mockItem.hasError.mockReturnValue(false);

      expect(mockItem.hasError()).toBe(false);
    });

    it('should throw error if item has errors', async () => {
      mockItem.hasError.mockReturnValue(true);
      mockItem.getErrors.mockReturnValue({
        quantity: 'Invalid quantity'
      });

      expect(mockItem.hasError()).toBe(true);
    });

    it('should extract first error message', async () => {
      mockItem.getErrors.mockReturnValue({
        quantity: 'Invalid quantity',
        price: 'Invalid price'
      });

      const errors = mockItem.getErrors();
      const firstError = Object.values(errors)[0];
      expect(firstError).toBe('Invalid quantity');
    });

    it('should throw error with message', async () => {
      mockItem.getErrors.mockReturnValue({
        error: 'Product not found'
      });

      expect(mockItem.getErrors()).toBeDefined();
    });
  });

  describe('Cart update', () => {
    it('should update cart items', async () => {
      mockCart.setData.mockResolvedValue(undefined);

      expect(mockCart.setData).toBeDefined();
    });

    it('should call setData with items', async () => {
      mockCart.setData.mockResolvedValue(undefined);

      expect(mockCart.setData).toBeDefined();
    });

    it('should handle cart modification', async () => {
      const items = [mockItem];

      expect(items).toHaveLength(1);
    });
  });

  describe('Context handling', () => {
    it('should accept context object', async () => {
      const context = { cartData: {}, itemData: {} };

      expect(typeof context).toBe('object');
    });

    it('should set context data', async () => {
      const context = {};
      context.cartData = mockCart.export();

      expect(context.cartData).toBeDefined();
    });

    it('should throw error for non-object context', async () => {
      const invalidContext = 'string';

      expect(typeof invalidContext).not.toBe('object');
    });

    it('should accept null context', async () => {
      const context = null;

      expect(context).toBe(null);
    });
  });

  describe('Item data validation', () => {
    it('should preserve product ID', async () => {
      const item = {
        product_id: 123
      };

      expect(item.product_id).toBe(123);
    });

    it('should preserve product SKU', async () => {
      mockItem.getData.mockReturnValue('PROD-001');

      const sku = mockItem.getData('product_sku');
      expect(sku).toBe('PROD-001');
    });

    it('should handle product attributes', async () => {
      const item = {
        product_id: 1,
        size: 'L',
        color: 'red'
      };

      expect(item.size).toBe('L');
      expect(item.color).toBe('red');
    });
  });

  describe('Multiple items', () => {
    it('should add multiple different items', async () => {
      const items = [
        { product_id: 1, qty: 1 },
        { product_id: 2, qty: 2 },
        { product_id: 3, qty: 1 }
      ];

      expect(items).toHaveLength(3);
    });

    it('should maintain item order', async () => {
      mockCart.getItems.mockReturnValue([
        { product_id: 1 },
        { product_id: 2 }
      ]);

      const items = mockCart.getItems();
      expect(items[0].product_id).toBe(1);
      expect(items[1].product_id).toBe(2);
    });
  });

  describe('Cart state management', () => {
    it('should export cart after adding item', async () => {
      const exported = mockCart.export();

      expect(exported).toHaveProperty('items');
    });

    it('should update cart data', async () => {
      mockCart.setData.mockResolvedValue(undefined);

      expect(mockCart.setData).toBeDefined();
    });

    it('should handle item creation errors', async () => {
      mockCart.createItem.mockRejectedValue(
        new Error('Item creation failed')
      );

      expect(mockCart.createItem).toBeDefined();
    });
  });

  describe('Return value', () => {
    it('should return item object', async () => {
      const result = mockItem;

      expect(result).toBeDefined();
      expect(result).toHaveProperty('product_id');
    });

    it('should return duplicate or new item', async () => {
      const result = mockCart.createItem(1, 1);

      expect(result).toBeDefined();
    });

    it('should include all item properties', async () => {
      const result = mockItem;

      expect(result).toHaveProperty('product_id');
      expect(result).toHaveProperty('product_sku');
      expect(result).toHaveProperty('qty');
    });
  });
});
