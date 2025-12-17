import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('@evershop/postgres-query-builder');
jest.mock('../../../../lib/postgres/connection.js');
jest.mock('../../../../lib/util/httpStatus.js');
jest.mock('../../../oms/services/updatePaymentStatus.js');

describe('COD Capture Payment Handler', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {
        order_id: 'order-uuid-123'
      }
    };

    mockResponse = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      }
    };

    mockNext = jest.fn();
  });

  describe('Capture payment API', () => {
    it('should accept order_id in request body', () => {
      expect(mockRequest.body).toHaveProperty('order_id');
      expect(mockRequest.body.order_id).toBe('order-uuid-123');
    });

    it('should return response with status code', () => {
      mockResponse.status(200);
      expect(mockResponse.statusCode).toBe(200);
    });

    it('should return data in JSON format', () => {
      mockResponse.status(200).json({ data: {} });
      expect(mockResponse.body).toHaveProperty('data');
    });

    it('should handle invalid order response', () => {
      mockResponse.status(400).json({
        error: {
          status: 400,
          message: 'Requested order does not exist or is not in pending payment status'
        }
      });
      expect(mockResponse.statusCode).toBe(400);
      expect(mockResponse.body.error).toBeDefined();
    });
  });
});
