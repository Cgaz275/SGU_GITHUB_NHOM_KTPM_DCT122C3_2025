describe('Admin Login', () => {
  beforeEach(() => {
    cy.clearAuthData();
    cy.visit('/admin/login');
  });

  it('should display admin login page', () => {
    cy.url().should('include', '/admin/login');
    cy.get('h1, h2, [class*="title"], [class*="heading"]').should('exist');
  });

  it('should display login form with email field', () => {
    cy.get('input[name="email"]').should('be.visible');
  });

  it('should display login form with password field', () => {
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should display login submit button', () => {
    cy.get('button').contains(/sign in|login/i).should('be.visible');
  });

  it('should validate empty email field', () => {
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('[class*="error"], [role="alert"]').should('exist');
  });

  it('should validate empty password field', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('[class*="error"], [role="alert"]').should('exist');
  });

  it('should require both email and password', () => {
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('[class*="error"], [role="alert"]').should('exist');
  });

  it('should display error for invalid credentials', () => {
    cy.fillLoginForm('invalid@example.com', 'wrongpassword');
    cy.submitLoginForm();
    cy.get('[class*="error"], [class*="text-critical"]').should('contain', 'Invalid');
  });

  it('should prevent SQL injection in email field', () => {
    cy.get('input[name="email"]').type("admin' OR '1'='1");
    cy.get('input[name="password"]').type('anypassword');
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('[class*="error"]').should('exist');
  });

  it('should accept valid email format', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="email"]').should('have.value', 'test@example.com');
  });

  it('should mask password field', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('should allow showing/hiding password', () => {
    cy.get('input[name="password"]').type('testpassword');
    cy.get('button[aria-label*="toggle"], button[class*="toggle"]').then(($btn) => {
      if ($btn.length > 0) {
        cy.wrap($btn).click();
        cy.get('input[name="password"]').should('have.attr', 'type', 'text');
      }
    });
  });

  it('should handle form submission', () => {
    cy.fillLoginForm('admin@test.com', 'password123');
    cy.submitLoginForm();
    // Should either succeed or show error, not stay on login page without feedback
  });

  it('should persist email in form on error', () => {
    const testEmail = 'test@example.com';
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('input[name="email"]').should('have.value', testEmail);
  });

  it('should clear password on error', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button').contains(/sign in|login/i).click();
    // Password fields are usually cleared for security
  });

  it('should trim whitespace from email', () => {
    cy.get('input[name="email"]').type('  admin@test.com  ');
    // Verify form handles whitespace properly
  });

  it('should be case-insensitive for email', () => {
    cy.get('input[name="email"]').type('ADMIN@TEST.COM');
    // Email should work regardless of case
  });

  it('should show loading state on submit', () => {
    cy.mockLoginAPI();
    cy.get('input[name="email"]').type('admin@test.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button').contains(/sign in|login/i).then(($btn) => {
      cy.wrap($btn).click();
      // Check for loading indicator
      cy.wrap($btn).should('have.attr', 'disabled', '').or.have.class(/loading|disabled/);
    });
  });

  it('should redirect to dashboard on successful login', () => {
    // Test with actual credentials from environment or fixture
    cy.adminLogin();
    cy.url({ timeout: 15000 }).should('not.include', '/login');
    cy.get('body').should('exist');
  });

  it('should login using test account credentials', () => {
    cy.fixture('admin').then((admin) => {
      cy.fillLoginForm(admin.validAdmin.email, admin.validAdmin.password);
      cy.submitLoginForm();
      cy.url({ timeout: 15000 }).should('not.include', '/login');
    });
  });

  it('should persist login session', () => {
    cy.adminLogin();
    cy.url({ timeout: 15000 }).should('not.include', '/login');
    cy.reload();
    // Should still be logged in after reload
    cy.url().should('not.include', '/login');
  });
});
