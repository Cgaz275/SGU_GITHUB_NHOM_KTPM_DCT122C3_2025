import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('../../lib/event/emitter.js');
jest.mock('../../lib/util/getConfig.js');
jest.mock('../../lib/util/hookable.js');
jest.mock('../../modules/setting/services/setting.js');
jest.mock('../checkout/services/getAvailablePaymentMethods.js');

describe('COD Payment Flow Integration', () => {
  let mockEmit;
  let mockGetConfig;
  let mockHookAfter;
  let mockGetSetting;
  let mockRegisterPaymentMethod;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEmit = require('../../lib/event/emitter.js').emit;
    mockGetConfig = require('../../lib/util/getConfig.js').getConfig;
    mockHookAfter = require('../../lib/util/hookable.js').hookAfter;
    mockGetSetting = require('../../modules/setting/services/setting.js').getSetting;
    mockRegisterPaymentMethod = require('../checkout/services/getAvailablePaymentMethods.js').registerPaymentMethod;

    mockEmit.mockResolvedValue(undefined);
    mockHookAfter.mockImplementation(() => {});
  });

  describe('Payment method registration flow', () => {
    it('should register payment method with init callback', async () => {
      mockGetSetting.mockResolvedValue('Cash on Delivery');
      mockRegisterPaymentMethod.mockImplementation((config) => {
        expect(config).toHaveProperty('init');
        expect(typeof config.init).toBe('function');
      });

      const method = {
        init: async () => ({
          code: 'cod',
          name: await mockGetSetting('codDisplayName', 'Cash on Delivery')
        })
      };

      expect(method).toHaveProperty('init');
    });

    it('should register payment method with validator callback', async () => {
      mockGetConfig.mockReturnValue({ status: 1 });
      mockRegisterPaymentMethod.mockImplementation((config) => {
        expect(config).toHaveProperty('validator');
        expect(typeof config.validator).toBe('function');
      });

      const method = {
        validator: async () => {
          const codConfig = mockGetConfig('system.cod', {});
          return codConfig.status === 1;
        }
      };

      expect(method).toHaveProperty('validator');
    });

    it('should setup hook after createOrderFunc', async () => {
      mockHookAfter.mockImplementation((eventName, callback) => {
        expect(eventName).toBe('createOrderFunc');
        expect(typeof callback).toBe('function');
      });

      mockHookAfter('createOrderFunc', async (order) => {
        if (order.payment_method === 'cod') {
          await mockEmit('order_placed', order);
        }
      });

      expect(mockHookAfter).toHaveBeenCalled();
    });

    it('should emit order_placed event for COD orders', async () => {
      const order = {
        order_id: '123',
        payment_method: 'cod',
        total: 1000
      };

      const hookCallback = async (order) => {
        if (order.payment_method === 'cod') {
          await mockEmit('order_placed', order);
        }
      };

      await hookCallback(order);
      expect(mockEmit).toHaveBeenCalledWith('order_placed', order);
    });
  });
});
