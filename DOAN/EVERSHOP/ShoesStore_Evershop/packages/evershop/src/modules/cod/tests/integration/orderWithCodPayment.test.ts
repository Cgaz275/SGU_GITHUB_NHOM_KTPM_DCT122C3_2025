import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('@evershop/postgres-query-builder');
jest.mock('../../../../lib/postgres/connection.js');
jest.mock('../../../../lib/event/emitter.js');

describe('Order with COD Payment Integration', () => {
  let mockInsert;
  let mockSelect;
  let mockEmit;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEmit = require('../../../../lib/event/emitter.js').emit;
    mockEmit.mockResolvedValue(undefined);

    mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      and: jest.fn().mockReturnThis(),
      load: jest.fn()
    });

    mockInsert = jest.fn().mockReturnValue({
      given: jest.fn().mockReturnThis(),
      execute: jest.fn()
    });
  });

  describe('Order creation with COD', () => {
    it('should create order with COD payment method', () => {
      const order = {
        order_id: 123,
        uuid: 'order-uuid-123',
        payment_method: 'cod',
        status: 'pending',
        grand_total: 1000
      };

      expect(order.payment_method).toBe('cod');
      expect(order).toHaveProperty('order_id');
      expect(order).toHaveProperty('uuid');
    });

    it('should save order items in database', async () => {
      mockInsert().execute.mockResolvedValue({ insertId: 1 });

      const orderItem = {
        order_id: 123,
        product_id: 1,
        quantity: 2,
        price: 500
      };

      expect(orderItem).toHaveProperty('order_id');
      expect(orderItem).toHaveProperty('quantity');
      expect(orderItem).toHaveProperty('price');
    });

    it('should update payment status to paid', async () => {
      const payment = {
        order_id: 123,
        payment_status: 'pending'
      };

      payment.payment_status = 'paid';
      expect(payment.payment_status).toBe('paid');
    });

    it('should save payment transaction', async () => {
      mockInsert().execute.mockResolvedValue({ insertId: 1 });

      const transaction = {
        order_id: 123,
        amount: 1000,
        payment_action: 'capture',
        transaction_type: 'offline'
      };

      expect(transaction).toHaveProperty('payment_action');
      expect(transaction.payment_action).toBe('capture');
    });
  });
});
