/**
 * Checkout API Tests
 * Tests for checkout endpoints including cart management, shipping, and order creation
 */

describe('Checkout API Tests', () => {
  const baseUrl = Cypress.config('baseUrl');
  const apiBaseUrl = `${baseUrl}/api`;
  let adminAccessToken = null;
  let cartId = null;
  let productId = null;
  let shippingZoneId = null;
  let shippingMethodId = null;

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

    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/products`,
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        sku: `CHECKOUT-${Date.now()}`,
        name: 'Checkout Test Product',
        type: 'simple',
        price: 99.99,
        qty: 100,
        status: 1
      }
    }).then((response) => {
      if (response.status === 200) {
        productId = response.body.data.product_id;
      }
    });
  });

  describe('POST /api/carts - Create Cart', () => {
    it('Should successfully create a new cart', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('cart_id');
        cartId = response.body.data.cart_id;
      });
    });

    it('Should return valid cart object structure', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts`,
        body: {}
      }).then((response) => {
        expect(response.body.data).to.have.property('items');
        expect(response.body.data.items).to.be.an('array');
        expect(response.body.data).to.have.property('total');
        expect(response.body.data).to.have.property('items_count');
      });
    });
  });

  describe('GET /api/carts/:id - Get Cart', () => {
    it('Should retrieve cart details', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/carts/${cartId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.cart_id).to.equal(cartId);
      });
    });

    it('Should return 404 for non-existent cart', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/carts/invalid-cart-id`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('POST /api/carts/:id/items - Add Item to Cart', () => {
    it('Should successfully add item to cart', () => {
      if (!cartId || !productId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/items`,
        body: {
          product_id: productId,
          qty: 2
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.items_count).to.be.greaterThan(0);
      });
    });

    it('Should fail to add item without product_id', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/items`,
        body: {
          qty: 2
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should fail to add item with invalid quantity', () => {
      if (!cartId || !productId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/items`,
        body: {
          product_id: productId,
          qty: -1
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should fail to add item with zero quantity', () => {
      if (!cartId || !productId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/items`,
        body: {
          product_id: productId,
          qty: 0
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should handle exceeding stock quantity', () => {
      if (!cartId || !productId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/items`,
        body: {
          product_id: productId,
          qty: 99999
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422, 200]);
      });
    });
  });

  describe('PUT /api/carts/:id/items/:itemId - Update Cart Item Quantity', () => {
    it('Should successfully update item quantity', () => {
      if (!cartId) {
        cy.skip();
      }

      let itemId = null;

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/carts/${cartId}`
      }).then((response) => {
        if (response.body.data.items && response.body.data.items.length > 0) {
          itemId = response.body.data.items[0].item_id;
        }
      });

      if (itemId) {
        cy.request({
          method: 'PUT',
          url: `${apiBaseUrl}/carts/${cartId}/items/${itemId}`,
          body: {
            qty: 5
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      }
    });

    it('Should fail to update with invalid quantity', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/carts/${cartId}/items/invalid-id`,
        body: {
          qty: -5
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404, 422]);
      });
    });
  });

  describe('DELETE /api/carts/:id/items/:itemId - Remove Item from Cart', () => {
    it('Should successfully remove item from cart', () => {
      if (!cartId) {
        cy.skip();
      }

      let itemId = null;

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/carts/${cartId}`
      }).then((response) => {
        if (response.body.data.items && response.body.data.items.length > 0) {
          itemId = response.body.data.items[0].item_id;
        }
      });

      if (itemId) {
        cy.request({
          method: 'DELETE',
          url: `${apiBaseUrl}/carts/${cartId}/items/${itemId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.be.oneOf([200, 204]);
        });
      }
    });

    it('Should return 404 when removing non-existent item', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/carts/${cartId}/items/invalid-id`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('POST /api/shipping-zones - Create Shipping Zone', () => {
    it('Should successfully create shipping zone', () => {
      const zoneData = {
        name: `Zone ${Date.now()}`,
        provinces: ['*'],
        countries: ['*']
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/shipping-zones`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: zoneData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        shippingZoneId = response.body.data.zone_id;
      });
    });

    it('Should fail to create zone without name', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/shipping-zones`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          provinces: ['*']
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('POST /api/shipping-methods - Create Shipping Method', () => {
    it('Should successfully create shipping method', () => {
      if (!shippingZoneId) {
        cy.skip();
      }

      const methodData = {
        name: `Method ${Date.now()}`,
        type: 'flat_rate',
        cost: 10,
        zone_id: shippingZoneId
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/shipping-methods`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: methodData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        shippingMethodId = response.body.data.method_id;
      });
    });

    it('Should fail to create method with invalid cost', () => {
      if (!shippingZoneId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/shipping-methods`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: `Method ${Date.now()}`,
          type: 'flat_rate',
          cost: 'invalid',
          zone_id: shippingZoneId
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('POST /api/carts/:id/address - Add Cart Address', () => {
    it('Should successfully add address to cart', () => {
      if (!cartId) {
        cy.skip();
      }

      const addressData = {
        first_name: 'John',
        last_name: 'Doe',
        email: `customer_${Date.now()}@test.com`,
        phone: '0912345678',
        address_1: '123 Main Street',
        city: 'Ho Chi Minh',
        province: 'HCMC',
        country: 'Vietnam',
        postcode: '700000'
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/address`,
        body: addressData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should fail to add address without required fields', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/address`,
        body: {
          first_name: 'John'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should reject invalid email address', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/address`,
        body: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'invalid-email',
          address_1: '123 Main St',
          city: 'City'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('POST /api/carts/:id/shipping-method - Add Shipping Method to Cart', () => {
    it('Should successfully add shipping method to cart', () => {
      if (!cartId || !shippingMethodId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/shipping-method`,
        body: {
          method_id: shippingMethodId
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should fail with invalid shipping method', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts/${cartId}/shipping-method`,
        body: {
          method_id: 'invalid-method'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404]);
      });
    });
  });

  describe('POST /api/orders - Create Order from Cart', () => {
    it('Should successfully create order from cart', () => {
      if (!cartId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders`,
        body: {
          cart_id: cartId
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 201]).to.include(response.status);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('order_id');
      });
    });

    it('Should fail to create order with invalid cart', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/orders`,
        body: {
          cart_id: 'invalid-cart'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404]);
      });
    });
  });

  describe('Checkout Flow Integration Tests', () => {
    it('Should complete full checkout flow: create cart → add item → checkout', () => {
      if (!productId) {
        cy.skip();
      }

      let testCartId = null;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts`,
        body: {}
      }).then((response) => {
        expect(response.status).to.equal(200);
        testCartId = response.body.data.cart_id;
      });

      if (testCartId && productId) {
        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/carts/${testCartId}/items`,
          body: {
            product_id: productId,
            qty: 1
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.data.items_count).to.be.greaterThan(0);
        });
      }

      if (testCartId) {
        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/carts/${testCartId}/address`,
          body: {
            first_name: 'Test',
            last_name: 'User',
            email: `test_${Date.now()}@test.com`,
            address_1: '123 Main St',
            city: 'City',
            country: 'Vietnam'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      }
    });

    it('Should handle empty cart gracefully', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts`,
        body: {}
      }).then((response) => {
        const emptyCartId = response.body.data.cart_id;

        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/orders`,
          body: {
            cart_id: emptyCartId
          },
          failOnStatusCode: false
        }).then((orderResponse) => {
          expect([400, 422]).to.include(orderResponse.status);
        });
      });
    });
  });

  describe('Cart Performance Tests', () => {
    it('Should handle adding multiple items efficiently', () => {
      if (!cartId || !productId) {
        cy.skip();
      }

      const startTime = Date.now();

      for (let i = 0; i < 5; i++) {
        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/carts/${cartId}/items`,
          body: {
            product_id: productId,
            qty: 1
          }
        });
      }

      cy.wrap(null).then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        expect(duration).to.be.lessThan(10000);
      });
    });
  });
});
