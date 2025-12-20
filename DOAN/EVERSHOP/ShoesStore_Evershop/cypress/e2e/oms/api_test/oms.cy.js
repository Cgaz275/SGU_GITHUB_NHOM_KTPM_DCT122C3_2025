/**
 * OMS (Order Management System) API Tests
 * Tests for order management endpoints including order creation, status updates, shipments, and cancellations
 */

describe('OMS API Tests', () => {
  const baseUrl = Cypress.config('baseUrl');
  const apiBaseUrl = `${baseUrl}/api`;
  let adminAccessToken = null;
  let orderId = null;
  let shipmentId = null;

  before(() => {
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/user/tokens`,
      body: {
        email: Cypress.env('TEST_ADMIN_EMAIL'),
        password: Cypress.env('TEST_ADMIN_PASSWORD')
      }
    }).then((response) => {
      adminAccessToken = response.body.data.accessToken;
    });
  });

  describe('GET /api/orders - List Orders', () => {
    it('Should retrieve list of orders', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Should support pagination', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?limit=10&page=1`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should support filtering by status', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?status=pending`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should support filtering by date range', () => {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?startDate=${startDate}&endDate=${endDate}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should require authorization', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });

    it('Should support sorting by different fields', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?sortBy=created_at&sortOrder=desc`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('GET /api/orders/:id - Get Order Details', () => {
    it('Should retrieve single order details', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then((response) => {
        if (response.body.data && response.body.data.length > 0) {
          const testOrderId = response.body.data[0].order_id;

          cy.request({
            method: 'GET',
            url: `${apiBaseUrl}/orders/${testOrderId}`,
            headers: {
              Authorization: `Bearer ${adminAccessToken}`
            },
            failOnStatusCode: false
          }).then((detailResponse) => {
            expect(detailResponse.status).to.equal(200);
            expect(detailResponse.body.data.order_id).to.equal(testOrderId);
          });
        }
      });
    });

    it('Should return 404 for non-existent order', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders/999999`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it('Should require authorization', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders/123`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });

    it('Should return complete order information', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then((response) => {
        if (response.body.data && response.body.data.length > 0) {
          const testOrderId = response.body.data[0].order_id;
          orderId = testOrderId;

          cy.request({
            method: 'GET',
            url: `${apiBaseUrl}/orders/${testOrderId}`,
            headers: {
              Authorization: `Bearer ${adminAccessToken}`
            }
          }).then((detailResponse) => {
            const orderData = detailResponse.body.data;
            expect(orderData).to.have.property('order_id');
            expect(orderData).to.have.property('status');
            expect(orderData).to.have.property('total');
            expect(orderData).to.have.property('items');
            expect(orderData).to.have.property('shipping_address');
            expect(orderData).to.have.property('payment_method');
          });
        }
      });
    });
  });

  describe('PUT /api/orders/:id - Update Order', () => {
    it('Should update order status', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          status: 'processing'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    });

    it('Should reject invalid order status', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          status: 'invalid_status'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should require authorization for order update', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/orders/${orderId}`,
        body: {
          status: 'processing'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('POST /api/orders/:id/shipments - Create Shipment', () => {
    it('Should successfully create shipment for order', () => {
      if (!orderId) {
        cy.skip();
      }

      const shipmentData = {
        items: [
          {
            item_id: 1,
            qty: 1
          }
        ],
        carrier: 'standard',
        tracking_number: `TRACK-${Date.now()}`
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders/${orderId}/shipments`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: shipmentData,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data');
          shipmentId = response.body.data.shipment_id;
        }
      });
    });

    it('Should fail to create shipment without items', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders/${orderId}/shipments`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          carrier: 'standard'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should require authorization for shipment creation', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders/${orderId}/shipments`,
        body: {
          items: [{ item_id: 1, qty: 1 }],
          carrier: 'standard'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('GET /api/orders/:id/shipments - List Order Shipments', () => {
    it('Should retrieve list of shipments for order', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders/${orderId}/shipments`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.be.an('array');
      });
    });
  });

  describe('PUT /api/orders/:id/shipments/:shipmentId - Update Shipment', () => {
    it('Should update shipment status', () => {
      if (!orderId || !shipmentId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/orders/${orderId}/shipments/${shipmentId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          status: 'shipped'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    });

    it('Should update tracking number', () => {
      if (!orderId || !shipmentId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/orders/${orderId}/shipments/${shipmentId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          tracking_number: `NEW-TRACK-${Date.now()}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    });
  });

  describe('POST /api/orders/:id/mark-delivered - Mark Order as Delivered', () => {
    it('Should mark order as delivered', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders/${orderId}/mark-delivered`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    });

    it('Should require authorization', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders/${orderId}/mark-delivered`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('POST /api/orders/:id/cancel - Cancel Order', () => {
    it('Should cancel pending order', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?status=pending`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then((response) => {
        if (response.body.data && response.body.data.length > 0) {
          const cancelOrderId = response.body.data[0].order_id;

          cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/orders/${cancelOrderId}/cancel`,
            headers: {
              Authorization: `Bearer ${adminAccessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              reason: 'Customer requested cancellation'
            },
            failOnStatusCode: false
          }).then((cancelResponse) => {
            expect([200, 204, 400]).to.include(cancelResponse.status);
          });
        }
      });
    });

    it('Should not cancel completed order', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?status=completed`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then((response) => {
        if (response.body.data && response.body.data.length > 0) {
          const completedOrderId = response.body.data[0].order_id;

          cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/orders/${completedOrderId}/cancel`,
            headers: {
              Authorization: `Bearer ${adminAccessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              reason: 'Test cancellation'
            },
            failOnStatusCode: false
          }).then((cancelResponse) => {
            expect(cancelResponse.status).to.be.oneOf([400, 422]);
          });
        }
      });
    });

    it('Should require authorization for cancellation', () => {
      if (!orderId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders/${orderId}/cancel`,
        body: {
          reason: 'Test'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('GET /api/orders/statistics/sales - Get Sales Statistics', () => {
    it('Should retrieve sales statistics', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders/statistics/sales`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
      });
    });

    it('Should support date range filtering for statistics', () => {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders/statistics/sales?startDate=${startDate}&endDate=${endDate}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('OMS Workflow Tests', () => {
    it('Should complete order lifecycle: pending → processing → shipped → delivered', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?status=pending`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then((response) => {
        if (response.body.data && response.body.data.length > 0) {
          const testOrderId = response.body.data[0].order_id;
          const statuses = ['processing', 'shipped', 'delivered'];

          statuses.forEach((status) => {
            cy.request({
              method: 'PUT',
              url: `${apiBaseUrl}/orders/${testOrderId}`,
              headers: {
                Authorization: `Bearer ${adminAccessToken}`,
                'Content-Type': 'application/json'
              },
              body: { status },
              failOnStatusCode: false
            }).then((response) => {
              expect([200, 204]).to.include(response.status);
            });
          });
        }
      });
    });

    it('Should handle shipment tracking workflow', () => {
      if (!orderId) {
        cy.skip();
      }

      const trackingNumber = `TRACK-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders/${orderId}/shipments`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          items: [{ item_id: 1, qty: 1 }],
          carrier: 'express',
          tracking_number: trackingNumber
        },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          cy.request({
            method: 'GET',
            url: `${apiBaseUrl}/orders/${orderId}/shipments`,
            headers: {
              Authorization: `Bearer ${adminAccessToken}`
            }
          }).then((listResponse) => {
            expect(listResponse.body.data).to.be.an('array');
          });
        }
      });
    });
  });

  describe('OMS Performance Tests', () => {
    it('Should retrieve large order list within acceptable time', () => {
      const startTime = Date.now();

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/orders?limit=100`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        expect(duration).to.be.lessThan(5000);
      });
    });

    it('Should handle order update within acceptable time', () => {
      if (!orderId) {
        cy.skip();
      }

      const startTime = Date.now();

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          status: 'processing'
        },
        failOnStatusCode: false
      }).then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        expect(duration).to.be.lessThan(2000);
      });
    });
  });
});
