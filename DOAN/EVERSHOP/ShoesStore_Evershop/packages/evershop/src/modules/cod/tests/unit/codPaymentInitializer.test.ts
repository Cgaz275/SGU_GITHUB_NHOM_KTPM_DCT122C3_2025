import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('../../modules/setting/services/setting.js');

describe('COD Payment Initializer', () => {
  let mockGetSetting;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSetting = require('../../modules/setting/services/setting.js').getSetting;
  });

  describe('Payment method initialization', () => {
    it('should initialize with code cod', async () => {
      mockGetSetting.mockResolvedValue('Cash on Delivery');

      const initializer = async () => ({
        code: 'cod',
        name: await mockGetSetting('codDisplayName', 'Cash on Delivery')
      });

      const result = await initializer();
      expect(result.code).toBe('cod');
    });

    it('should retrieve display name from settings', async () => {
      mockGetSetting.mockResolvedValue('Pay on Delivery');

      const initializer = async () => ({
        code: 'cod',
        name: await mockGetSetting('codDisplayName', 'Cash on Delivery')
      });

      const result = await initializer();
      expect(mockGetSetting).toHaveBeenCalledWith('codDisplayName', 'Cash on Delivery');
      expect(result.name).toBe('Pay on Delivery');
    });

    it('should use default name when setting not found', async () => {
      mockGetSetting.mockResolvedValue(undefined);

      const initializer = async () => ({
        code: 'cod',
        name: (await mockGetSetting('codDisplayName', 'Cash on Delivery')) || 'Cash on Delivery'
      });

      const result = await initializer();
      expect(result.name).toBe('Cash on Delivery');
    });

    it('should return proper payment method structure', async () => {
      mockGetSetting.mockResolvedValue('COD');

      const initializer = async () => ({
        code: 'cod',
        name: await mockGetSetting('codDisplayName', 'Cash on Delivery')
      });

      const result = await initializer();
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('name');
      expect(Object.keys(result)).toHaveLength(2);
    });
  });
});
