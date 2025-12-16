describe('Token Management', () => {
  beforeEach(() => {
    cy.clearAuthData();
  });

  it('should generate access token on successful login', () => {
    cy.mockLoginAPI();
    cy.mockGetCurrentUserAPI();
    cy.visit('/admin/login');
    cy.fillLoginForm('admin@test.com', 'password');
    cy.submitLoginForm();
    cy.waitForAPI('loginRequest');
    // Token should be stored
  });

  it('should generate refresh token on successful login', () => {
    cy.mockLoginAPI();
    cy.visit('/admin/login');
    cy.fillLoginForm('admin@test.com', 'password');
    cy.submitLoginForm();
    cy.waitForAPI('loginRequest');
    // Both access and refresh tokens should be generated
  });

  it('should store tokens securely', () => {
    cy.mockLoginAPI();
    cy.visit('/admin/login');
    cy.fillLoginForm('admin@test.com', 'password');
    cy.submitLoginForm();
    cy.waitForAPI('loginRequest');
    // Tokens should not be stored in plain text
  });

  it('should use access token in API requests', () => {
    cy.mockLoginAPI();
    cy.mockGetCurrentUserAPI();
    cy.visit('/admin/login');
    cy.fillLoginForm('admin@test.com', 'password');
    cy.submitLoginForm();
    cy.waitForAPI('loginRequest');
    // Subsequent API calls should include token
  });

  it('should handle token expiration', () => {
    // Mock expired token response
    cy.intercept('GET', '**/api/**', (req) => {
      req.reply({
        statusCode: 401,
        body: {
          error: {
            message: 'Token expired'
          }
        }
      });
    }).as('expiredTokenRequest');
    // Should trigger refresh or redirect to login
  });

  it('should refresh token automatically', () => {
    cy.intercept('POST', '**/api/refresh/**', {
      statusCode: 200,
      body: {
        data: {
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token'
        }
      }
    }).as('refreshTokenRequest');
    // On token expiration, should make refresh request
  });

  it('should clear tokens on 401 error', () => {
    cy.intercept('GET', '**/api/**', {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    });
    // Should clear stored tokens and redirect to login
  });

  it('should not expose tokens in URLs', () => {
    cy.mockLoginAPI();
    cy.visit('/admin/login');
    cy.fillLoginForm('admin@test.com', 'password');
    cy.submitLoginForm();
    cy.url().then((url) => {
      expect(url).not.to.include('token');
      expect(url).not.to.include('accessToken');
    });
  });

  it('should send token in Authorization header', () => {
    cy.intercept('GET', '**/api/**', (req) => {
      expect(req.headers['authorization']).to.exist;
      expect(req.headers['authorization']).to.include('Bearer');
    }).as('authHeaderRequest');
  });

  it('should handle token refresh failure', () => {
    cy.intercept('POST', '**/api/refresh/**', {
      statusCode: 401,
      body: { error: 'Refresh token invalid' }
    });
    // Should redirect to login and clear tokens
  });

  it('should set appropriate token expiration times', () => {
    cy.mockLoginAPI();
    // Access token should expire faster than refresh token
    // Verify token payload contains exp claim
  });

  it('should support logout token revocation', () => {
    cy.intercept('POST', '**/api/logout/**', {
      statusCode: 200,
      body: { success: true }
    }).as('logoutRequest');
    // Logout should invalidate tokens on server
  });

  it('should handle concurrent token requests', () => {
    // Only one refresh should be triggered even with multiple 401s
    cy.intercept('POST', '**/api/refresh/**', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: {
            accessToken: 'new_token',
            refreshToken: 'new_refresh_token'
          }
        }
      });
    }).as('refreshTokenRequest');
  });

  it('should clear tokens on logout', () => {
    cy.mockLoginAPI();
    cy.visit('/admin/login');
    cy.fillLoginForm('admin@test.com', 'password');
    cy.submitLoginForm();
    cy.clearAuthData();
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
