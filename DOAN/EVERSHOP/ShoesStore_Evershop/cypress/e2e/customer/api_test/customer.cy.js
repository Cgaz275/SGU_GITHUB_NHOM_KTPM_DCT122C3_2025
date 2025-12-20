/**
 * Customer API Tests
 * Tests for customer endpoints including registration, login, address management, and password updates
 */

describe('Customer API Tests', () => {
  const baseUrl = Cypress.config('baseUrl');
  const apiBaseUrl = `${baseUrl}/api`;
  let customerId = null;
  let customerAccessToken = null;
  let customerRefreshToken = null;
  let customerEmail = `test_customer_${Date.now()}@example.com`;
  let customerPassword = 'TestPassword123!';
  let addressId = null;

  describe('POST /api/customers - Create Customer (Register)', () => {
    it('Should successfully register a new customer', () => {
      const customerData = {
        email: customerEmail,
        password: customerPassword,
        first_name: 'Test',
        last_name: 'Customer',
        phone: '0912345678'
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers`,
        body: customerData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('customer_id');
        customerId = response.body.data.customer_id;
      });
    });

    it('Should fail to register with invalid email format', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers`,
        body: {
          email: 'not-an-email',
          password: customerPassword,
          first_name: 'Test',
          last_name: 'User'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should fail to register with weak password', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers`,
        body: {
          email: `weak_${Date.now()}@test.com`,
          password: '123',
          first_name: 'Test'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should reject duplicate email registration', () => {
      const email = `duplicate_${Date.now()}@test.com`;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers`,
        body: {
          email,
          password: customerPassword,
          first_name: 'First'
        }
      });

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers`,
        body: {
          email,
          password: customerPassword,
          first_name: 'Second'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.exist;
      });
    });

    it('Should fail to register without required fields', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers`,
        body: {
          email: `missing_${Date.now()}@test.com`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('POST /api/customers/tokens - Customer Login', () => {
    it('Should successfully login customer and receive tokens', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/tokens`,
        body: {
          email: customerEmail,
          password: customerPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('accessToken');
        expect(response.body.data).to.have.property('refreshToken');
        customerAccessToken = response.body.data.accessToken;
        customerRefreshToken = response.body.data.refreshToken;
      });
    });

    it('Should fail login with invalid email', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/tokens`,
        body: {
          email: 'nonexistent@test.com',
          password: customerPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(500);
      });
    });

    it('Should fail login with incorrect password', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/tokens`,
        body: {
          email: customerEmail,
          password: 'WrongPassword123!'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(500);
      });
    });

    it('Should fail login without email', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/tokens`,
        body: {
          password: customerPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should fail login without password', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/tokens`,
        body: {
          email: customerEmail
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('POST /api/customers/token/refresh - Refresh Customer Token', () => {
    it('Should successfully refresh customer token', () => {
      if (!customerRefreshToken) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/token/refresh`,
        body: {
          refreshToken: customerRefreshToken
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('accessToken');
      });
    });

    it('Should fail to refresh with invalid token', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/token/refresh`,
        body: {
          refreshToken: 'invalid_token'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });

    it('Should fail to refresh without token', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/token/refresh`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  describe('GET /api/customers/:id - Get Customer Details', () => {
    it('Should retrieve customer details with valid token', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/customers/${customerId}`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data.email).to.equal(customerEmail);
      });
    });

    it('Should fail to get customer without authorization', () => {
      if (!customerId) {
        cy.skip();
      }

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/customers/${customerId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });

    it('Should return 404 for non-existent customer', () => {
      if (!customerAccessToken) {
        cy.skip();
      }

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/customers/999999`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('PUT /api/customers/:id - Update Customer', () => {
    it('Should successfully update customer information', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/customers/${customerId}`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          first_name: 'UpdatedFirst',
          last_name: 'UpdatedLast',
          phone: '0987654321'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.first_name).to.equal('UpdatedFirst');
      });
    });

    it('Should fail to update without authorization', () => {
      if (!customerId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/customers/${customerId}`,
        body: {
          first_name: 'Hacker'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('POST /api/customers/:id/addresses - Add Customer Address', () => {
    it('Should successfully add customer address', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      const addressData = {
        first_name: 'John',
        last_name: 'Doe',
        phone: '0912345678',
        address_1: '123 Main Street',
        city: 'Ho Chi Minh',
        province: 'HCMC',
        country: 'Vietnam',
        postcode: '700000',
        is_default: 1
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/${customerId}/addresses`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: addressData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        addressId = response.body.data.address_id;
      });
    });

    it('Should fail to add address without required fields', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/${customerId}/addresses`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          first_name: 'John'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should fail to add address without authorization', () => {
      if (!customerId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/${customerId}/addresses`,
        body: {
          first_name: 'John',
          address_1: '123 Main St',
          city: 'City'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('GET /api/customers/:id/addresses - List Customer Addresses', () => {
    it('Should retrieve list of customer addresses', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/customers/${customerId}/addresses`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      });
    });
  });

  describe('PUT /api/customers/:id/addresses/:addressId - Update Customer Address', () => {
    it('Should successfully update customer address', () => {
      if (!customerAccessToken || !customerId || !addressId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/customers/${customerId}/addresses/${addressId}`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          address_1: '456 New Street'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should return 404 for non-existent address', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/customers/${customerId}/addresses/999999`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          address_1: '456 New Street'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('DELETE /api/customers/:id/addresses/:addressId - Delete Customer Address', () => {
    it('Should successfully delete customer address', () => {
      if (!customerAccessToken || !customerId || !addressId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/customers/${customerId}/addresses/${addressId}`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
    });

    it('Should fail to delete address without authorization', () => {
      if (!customerId || !addressId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/customers/${customerId}/addresses/${addressId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('POST /api/customers/:id/password - Update Customer Password', () => {
    it('Should successfully update customer password', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      const newPassword = 'NewPassword123!';

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/${customerId}/password`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          currentPassword: customerPassword,
          newPassword: newPassword,
          confirmPassword: newPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        customerPassword = newPassword;
      });
    });

    it('Should fail to change password with incorrect current password', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/${customerId}/password`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewPassword456!',
          confirmPassword: 'NewPassword456!'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401]);
      });
    });

    it('Should fail to change password with non-matching passwords', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/${customerId}/password`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          currentPassword: customerPassword,
          newPassword: 'NewPassword456!',
          confirmPassword: 'DifferentPassword!'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('POST /api/customers/password-reset - Reset Password', () => {
    it('Should successfully request password reset', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/password-reset`,
        body: {
          email: customerEmail
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.include('reset');
      });
    });

    it('Should handle non-existent email gracefully', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/password-reset`,
        body: {
          email: 'nonexistent@test.com'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 404]);
      });
    });
  });

  describe('DELETE /api/customers/:id - Delete Customer', () => {
    it('Should successfully delete customer account', () => {
      if (!customerAccessToken || !customerId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/customers/${customerId}`,
        headers: {
          Authorization: `Bearer ${customerAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
    });

    it('Should fail to delete without authorization', () => {
      if (!customerId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/customers/${customerId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('Customer Authentication Flow Tests', () => {
    it('Should complete full customer registration and login flow', () => {
      const testEmail = `flow_${Date.now()}@test.com`;
      const testPassword = 'FlowTest123!';
      let newCustomerId = null;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers`,
        body: {
          email: testEmail,
          password: testPassword,
          first_name: 'Flow',
          last_name: 'Test'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        newCustomerId = response.body.data.customer_id;
      });

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/customers/tokens`,
        body: {
          email: testEmail,
          password: testPassword
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.property('accessToken');
      });
    });
  });
});
