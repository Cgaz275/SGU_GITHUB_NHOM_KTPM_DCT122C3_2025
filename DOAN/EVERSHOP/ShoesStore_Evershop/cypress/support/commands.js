/**
 * Admin Login
 * @param {string} email - Admin email (optional, uses env var if not provided)
 * @param {string} password - Admin password (optional, uses env var if not provided)
 */
Cypress.Commands.add('adminLogin', (email, password) => {
  const testEmail = email || Cypress.env('TEST_ADMIN_EMAIL') || 'alanewiston2@gmail.com';
  const testPassword = password || Cypress.env('TEST_ADMIN_PASSWORD') || 'a12345678';

  cy.visit('/admin/login');
  cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible').type(testEmail);
  cy.get('input[name="password"]').type(testPassword);
  cy.get('button').contains(/sign in|login/i).click();
  cy.url({ timeout: 10000 }).should('not.include', '/login');
});

/**
 * Admin Logout
 */
Cypress.Commands.add('adminLogout', () => {
  cy.visit('/admin');
  cy.get('[class*="avatar"], [data-test*="user"], button[aria-label*="user"], button[aria-label*="profile"]')
    .first()
    .click({ force: true });
  cy.get('a, button').contains(/logout|sign out|exit/i).click({ force: true });
  cy.url({ timeout: 10000 }).should('include', '/admin/login');
});

/**
 * Check if user is logged in
 */
Cypress.Commands.add('isAdminLoggedIn', () => {
  cy.visit('/admin');
  cy.url().then((url) => {
    if (url.includes('/admin/login')) {
      return false;
    }
    return true;
  });
});

/**
 * Check JWT token in localStorage/sessionStorage
 */
Cypress.Commands.add('checkAuthToken', () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token') || win.sessionStorage.getItem('token');
    return !!token;
  });
});

/**
 * Clear auth data
 */
Cypress.Commands.add('clearAuthData', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllCookies();
});

/**
 * Mock API login response
 */
Cypress.Commands.add('mockLoginAPI', () => {
  cy.intercept('POST', '**/api/auth/**', {
    statusCode: 200,
    body: {
      data: {
        accessToken: 'mock_access_token_xyz123',
        refreshToken: 'mock_refresh_token_xyz123'
      }
    }
  }).as('loginRequest');
});

/**
 * Mock API logout response
 */
Cypress.Commands.add('mockLogoutAPI', () => {
  cy.intercept('POST', '**/api/logout/**', {
    statusCode: 200,
    body: {
      success: true
    }
  }).as('logoutRequest');
});

/**
 * Mock getCurrentUser API response
 */
Cypress.Commands.add('mockGetCurrentUserAPI', (user = null) => {
  const defaultUser = {
    admin_user_id: 1,
    email: 'admin@evershop.io',
    name: 'Admin',
    status: 1
  };
  cy.intercept('GET', '**/api/auth/user/**', {
    statusCode: 200,
    body: {
      data: user || defaultUser
    }
  }).as('getCurrentUserRequest');
});

/**
 * Fill admin login form
 */
Cypress.Commands.add('fillLoginForm', (email, password) => {
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
});

/**
 * Submit login form
 */
Cypress.Commands.add('submitLoginForm', () => {
  cy.get('button').contains(/sign in|login/i).click();
});

/**
 * Check login error message
 */
Cypress.Commands.add('checkLoginError', (errorMessage = null) => {
  cy.get('[class*="error"], [class*="alert"], [class*="message"]')
    .should('be.visible')
    .then(($error) => {
      if (errorMessage) {
        cy.wrap($error).should('contain', errorMessage);
      }
    });
});

/**
 * Access protected admin page
 */
Cypress.Commands.add('visitAdminPage', (path = '/admin') => {
  cy.visit(path);
  // If redirected to login, it means not authenticated
  cy.url().then((url) => {
    if (url.includes('/admin/login')) {
      cy.log('Not authenticated, at login page');
    }
  });
});

/**
 * Wait for API interceptor
 */
Cypress.Commands.add('waitForAPI', (alias, options = {}) => {
  cy.wait(`@${alias}`, { timeout: 10000, ...options });
});
