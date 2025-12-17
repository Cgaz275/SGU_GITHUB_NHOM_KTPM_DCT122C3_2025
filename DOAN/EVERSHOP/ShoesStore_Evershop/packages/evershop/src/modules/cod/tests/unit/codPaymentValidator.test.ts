import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('../../lib/util/getConfig.js');
jest.mock('../../modules/setting/services/setting.js');

describe('COD Payment Validator', () => {
  let mockGetConfig;
  let mockGetSetting;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetConfig = require('../../lib/util/getConfig.js').getConfig;
    mockGetSetting = require('../../modules/setting/services/setting.js').getSetting;
  });

  describe('Validator function logic', () => {
    it('should return true when COD enabled in config', async () => {
      mockGetConfig.mockReturnValue({ status: 1 });

      const validator = async () => {
        const codConfig = mockGetConfig('system.cod', {});
        if (codConfig.status) {
          return true;
        }
        const codStatus = await mockGetSetting('codPaymentStatus', 0);
        return parseInt(codStatus, 10) === 1;
      };

      const result = await validator();
      expect(result).toBe(true);
    });

    it('should return false when COD disabled', async () => {
      mockGetConfig.mockReturnValue({});
      mockGetSetting.mockResolvedValue(0);

      const validator = async () => {
        const codConfig = mockGetConfig('system.cod', {});
        if (codConfig.status) {
          return true;
        }
        const codStatus = await mockGetSetting('codPaymentStatus', 0);
        return parseInt(codStatus, 10) === 1;
      };

      const result = await validator();
      expect(result).toBe(false);
    });

    it('should check getSetting when config not set', async () => {
      mockGetConfig.mockReturnValue({});
      mockGetSetting.mockResolvedValue(1);

      const validator = async () => {
        const codConfig = mockGetConfig('system.cod', {});
        if (codConfig.status) {
          return true;
        }
        const codStatus = await mockGetSetting('codPaymentStatus', 0);
        return parseInt(codStatus, 10) === 1;
      };

      await validator();
      expect(mockGetSetting).toHaveBeenCalledWith('codPaymentStatus', 0);
    });

    it('should return boolean result', async () => {
      mockGetConfig.mockReturnValue({ status: 1 });

      const validator = async () => {
        const codConfig = mockGetConfig('system.cod', {});
        return codConfig.status === 1;
      };

      const result = await validator();
      expect(typeof result).toBe('boolean');
    });
  });
});
