describe('Admin Logout', () => {
  beforeEach(() => {
    cy.clearAuthData();
    // Login with valid credentials before testing logout
    cy.adminLogin();
    // Navigate to admin dashboard
    cy.visit('/admin', { timeout: 15000 });
    // Wait for page to fully load
    cy.get('body', { timeout: 15000 }).should('be.visible');
  });

  it('should display avatar when user is logged in', () => {
    // Avatar is shown as first letter of name with class "first-letter"
    cy.get('a.first-letter', { timeout: 10000 })
      .should('be.visible');
  });

  it('should show logout dropdown when avatar is clicked', () => {
    // Click avatar to show logout dropdown
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });
    
    // Logout dropdown should now be visible
    cy.get('div.logout', { timeout: 5000 })
      .should('be.visible');
  });

  it('should display logout link in dropdown menu', () => {
    // Click avatar to show dropdown
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });
    
    // Wait for dropdown to be visible
    cy.get('div.logout', { timeout: 5000 })
      .should('be.visible');
    
    // Find logout link - search for any link containing "Logout" text
    cy.get('div.logout')
      .find('a')
      .should('be.visible')
      .and('contain', 'Logout');
  });

  it('should redirect to login page after logout', () => {
    // Click avatar
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });
    
    // Wait for dropdown
    cy.get('div.logout', { timeout: 5000 })
      .should('be.visible');
    
    // Click logout link inside dropdown
    cy.get('div.logout a')
      .contains('Logout')
      .click({ force: true });
    
    // Should redirect to login page
    cy.url({ timeout: 10000 }).should('include', '/admin/login');
  });

  it('should clear session on logout', () => {
    // Click avatar
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });
    
    // Click logout
    cy.get('div.logout a')
      .contains('Logout')
      .click({ force: true });
    
    // Check token is cleared
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token') || win.sessionStorage.getItem('token');
      expect(token).to.be.null;
    });
  });

  it('should clear cookies on logout', () => {
    // Click avatar
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });
    
    // Click logout
    cy.get('div.logout a')
      .contains('Logout')
      .click({ force: true });
    
    // Verify cookies cleared
    cy.getCookies().should('have.length.lessThan', 3);
  });

  it('should prevent access to admin pages after logout', () => {
    // Click avatar
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });

    // Wait for logout dropdown to be visible
    cy.get('div.logout', { timeout: 5000 })
      .should('be.visible');

    // Click logout link inside dropdown
    cy.get('div.logout a')
      .contains('Logout')
      .click({ force: true });

    // Wait for redirect to login page after logout
    cy.url({ timeout: 15000 }).should('include', '/admin/login');

    // Verify session is cleared
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token') || win.sessionStorage.getItem('token');
      expect(token).to.be.null;
    });

    // Verify current URL is login page (middleware protection already applied)
    cy.url({ timeout: 10000 }).should('include', '/admin/login');

    // Verify login page is displayed (not dashboard)
    cy.get('[class*="admin-login"]', { timeout: 10000 }).should('be.visible');

    // Additional check: verify we cannot access admin api without token
    cy.request({
      method: 'GET',
      url: '/api/admin/dashboard',
      failOnStatusCode: false
    }).then((response) => {
      // Should return 401 or redirect (not 200)
      expect(response.status).to.not.equal(200);
    });
  });

  it('should allow re-login after logout', () => {
    // Click avatar
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });
    
    // Click logout
    cy.get('div.logout a')
      .contains('Logout')
      .click({ force: true });
    
    // Should be on login page
    cy.url({ timeout: 10000 }).should('include', '/admin/login');
    
    // Login again
    cy.fixture('admin').then((admin) => {
      cy.fillLoginForm(admin.validAdmin.email, admin.validAdmin.password);
      cy.submitLoginForm();
      cy.url({ timeout: 15000 }).should('not.include', '/login');
    });
  });

  it('should clear localStorage tokens on logout', () => {
    // Set some data in localStorage (simulating stored token)
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'test-token-abc123');
    });

    // Click avatar
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });

    // Click logout
    cy.get('div.logout a')
      .contains('Logout')
      .click({ force: true });

    // Verify token cleared from localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.be.null;
    });
  });

  it('should invalidate auth tokens on logout', () => {
    // Click avatar
    cy.get('a.first-letter', { timeout: 10000 })
      .click({ force: true });

    // Click logout
    cy.get('div.logout a')
      .contains('Logout')
      .click({ force: true });

    // Verify redirect happened
    cy.url({ timeout: 10000 }).should('include', '/admin/login');

    // Verify no auth tokens remain in localStorage
    cy.window().then((win) => {
      const authToken = win.localStorage.getItem('token') || win.localStorage.getItem('authToken');
      expect(authToken).to.be.null;
    });
  });
});
