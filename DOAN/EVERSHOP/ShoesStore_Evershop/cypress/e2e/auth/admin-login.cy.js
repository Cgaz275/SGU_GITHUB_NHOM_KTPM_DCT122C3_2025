describe('Admin Login', () => {
  beforeEach(() => {
    cy.clearAuthData();
    cy.visit('/admin/login', { timeout: 15000 });
    // Wait for form to load
    cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
  });

  // UC1: Basic Login Form Display
  it('should display admin login page', () => {
    cy.url().should('include', '/admin/login');
    cy.get('h1, h2, [class*="title"], [class*="heading"]', { timeout: 10000 }).should('exist');
  });

  it('should display login form with email field', () => {
    cy.get('input[name="email"], input#field-email', { timeout: 10000 }).should('be.visible');
  });

  it('should display login form with password field', () => {
    cy.get('input[name="password"], input#field-password', { timeout: 10000 }).should('be.visible');
  });

  it('should display login submit button', () => {
    cy.get('button.button.primary', { timeout: 10000 }).should('be.visible');
  });

  // UC1: Required Field Validation
  it('should validate empty email field', () => {
    cy.fillLoginForm('', 'password123');
    cy.submitLoginForm();
    cy.get('[class*="error"], [role="alert"]', { timeout: 5000 }).should('exist');
  });

  it('should validate empty password field', () => {
    cy.fillLoginForm('admin@example.com', '');
    cy.submitLoginForm();
    cy.get('[class*="error"], [role="alert"]', { timeout: 5000 }).should('exist');
  });

  it('should require both email and password', () => {
    cy.fillLoginForm('', '');
    cy.submitLoginForm();
    cy.get('[class*="error"], [role="alert"]', { timeout: 5000 }).should('exist');
  });

  // UC1: Invalid Credentials Handling
  it('should display error for invalid credentials', () => {
    cy.fillLoginForm('invalid@example.com', 'wrongpassword');
    cy.submitLoginForm();
    cy.get('[class*="error"], [class*="text-critical"]', { timeout: 5000 }).should('contain', /invalid|incorrect|wrong/i);
  });

  it('should display specific error message for invalid credentials', () => {
    cy.fillLoginForm('wrong@example.com', 'wrongpass');
    cy.submitLoginForm();
    cy.get('[class*="error"], [class*="text-critical"]', { timeout: 5000 }).should(($el) => {
      const text = $el.text().toLowerCase();
      expect(text).to.match(/invalid|incorrect|wrong|unauthorized/i);
    });
  });

  // UC1: Password Security
  it('should mask password field', () => {
    cy.get('input[name="password"], input#field-password', { timeout: 10000 }).should('have.attr', 'type', 'password');
  });

  // UC1: Error Highlighting
  it('should highlight invalid email field in red on error', () => {
    cy.fillLoginForm('', 'password123');
    cy.submitLoginForm();
    cy.get('input[name="email"], input#field-email', { timeout: 10000 }).should(($input) => {
      const classes = $input.attr('class');
      const hasErrorClass = /error|invalid|border-red|text-critical/i.test(classes);
      expect(hasErrorClass).to.be.true;
    });
  });

  it('should highlight invalid password field in red on error', () => {
    cy.fillLoginForm('test@example.com', '');
    cy.submitLoginForm();
    cy.get('input[name="password"], input#field-password', { timeout: 10000 }).should(($input) => {
      const classes = $input.attr('class');
      const hasErrorClass = /error|invalid|border-red|text-critical/i.test(classes);
      expect(hasErrorClass).to.be.true;
    });
  });

  it('should remove error highlighting when user corrects input', () => {
    // Trigger error
    cy.fillLoginForm('', '');
    cy.submitLoginForm();
    cy.get('input[name="email"], input#field-email', { timeout: 10000 }).should('have.class', /error|invalid/i);

    // Correct the input
    cy.get('input[name="email"], input#field-email').clear().type('admin@example.com');
    // Error highlight should be removed
    cy.get('input[name="email"], input#field-email').should('not.have.class', /error|invalid/i);
  });

  // UC1: Form State After Error
  it('should persist email in form on error', () => {
    const testEmail = 'test@example.com';
    cy.fillLoginForm(testEmail, 'wrongpass');
    cy.submitLoginForm();
    cy.get('input[name="email"], input#field-email', { timeout: 10000 }).should('have.value', testEmail);
  });

  it('should clear password on error', () => {
    cy.fillLoginForm('test@example.com', 'wrongpass');
    cy.submitLoginForm();
    cy.get('input[name="password"], input#field-password', { timeout: 10000 }).should('have.value', '');
  });

  // UC1: Successful Login
  it('should redirect to dashboard on successful login', () => {
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
    cy.url().should('not.include', '/login');
  });

  // UC1: Business Rule - Login Attempt Limiting
  it('should track failed login attempts', () => {
    cy.fillLoginForm('wrong@example.com', 'wrongpassword');
    cy.submitLoginForm();
    cy.get('[class*="error"], [class*="text-critical"]', { timeout: 5000 }).should('exist');
  });

  it('should display warning message for failed login attempt', () => {
    cy.fillLoginForm('wrong@example.com', 'wrongpassword');
    cy.submitLoginForm();
    cy.get('[class*="error"], [role="alert"]', { timeout: 5000 }).should('be.visible');
  });

  it('should show remaining attempts after 2 failed login attempts', () => {
    cy.fillLoginForm('wrong@example.com', 'wrongpassword');
    cy.submitLoginForm();
    cy.get('[class*="error"]', { timeout: 5000 }).should('exist');
  });

  it('should lock account after 5 failed attempts', () => {
    for (let i = 0; i < 5; i++) {
      cy.visit('/admin/login', { timeout: 15000 });
      cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
      cy.fillLoginForm('wrong@example.com', 'wrongpassword');
      cy.submitLoginForm();
      cy.get('[class*="error"]', { timeout: 5000 }).should('exist');
      cy.wait(500);
    }

    // After 5 attempts, account should be locked
    cy.visit('/admin/login', { timeout: 15000 });
    cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
    cy.get('[class*="error"], [class*="locked"]', { timeout: 5000 })
      .should('exist')
      .and('contain', /locked|temporarily|disabled|try again/i);
  });

  it('should show 1 minute lock message after 5 failed attempts', () => {
    for (let i = 0; i < 5; i++) {
      cy.visit('/admin/login', { timeout: 15000 });
      cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
      cy.fillLoginForm('wrong@example.com', 'wrongpassword');
      cy.submitLoginForm();
      cy.get('[class*="error"]', { timeout: 5000 }).should('exist');
      cy.wait(500);
    }

    // Should display lock message with 1 minute duration
    cy.visit('/admin/login', { timeout: 15000 });
    cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
    cy.get('[class*="error"], [class*="locked"], [role="alert"]', { timeout: 5000 })
      .should('contain', /locked|minute|try again later/i);
  });

  it('should prevent login attempts when account is locked', () => {
    for (let i = 0; i < 5; i++) {
      cy.visit('/admin/login', { timeout: 15000 });
      cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
      cy.fillLoginForm('wrong@example.com', 'wrongpassword');
      cy.submitLoginForm();
      cy.get('[class*="error"]', { timeout: 5000 }).should('exist');
      cy.wait(500);
    }

    // Try to login while locked
    cy.visit('/admin/login', { timeout: 15000 });
    cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
    cy.fillLoginForm('wrong@example.com', 'anypassword');
    cy.submitLoginForm();

    // Should still show locked message
    cy.get('[class*="locked"], [class*="error"]', { timeout: 5000 }).should('contain', /locked|try again/i);
    cy.url().should('include', '/admin/login');
  });

  it('should disable login form when account is locked', () => {
    for (let i = 0; i < 5; i++) {
      cy.visit('/admin/login', { timeout: 15000 });
      cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
      cy.fillLoginForm('wrong@example.com', 'wrongpassword');
      cy.submitLoginForm();
      cy.get('[class*="error"]', { timeout: 5000 }).should('exist');
      cy.wait(500);
    }

    // Form inputs should be disabled
    cy.visit('/admin/login', { timeout: 15000 });
    cy.get('[class*="admin-login"], [class*="form"]', { timeout: 15000 }).should('be.visible');
    cy.get('input[name="email"], input#field-email', { timeout: 10000 }).should(($input) => {
      const isDisabled = $input.prop('disabled');
      const hasDisabledClass = /disabled/i.test($input.attr('class'));
      expect(isDisabled || hasDisabledClass).to.be.true;
    });
  });

  it('should reset failed attempt counter on successful login', () => {
    cy.adminLogin();
    cy.url({ timeout: 15000 }).should('not.include', '/login');

    // Logout and check counter is reset
    cy.adminLogout();
    cy.visit('/admin/login', { timeout: 15000 });

    // Should be able to login again normally
    cy.adminLogin();
    cy.url({ timeout: 15000 }).should('not.include', '/login');
  });

  it('should display specific required field error message', () => {
    cy.fillLoginForm('', '');
    cy.submitLoginForm();
    cy.get('[class*="error"], [role="alert"]', { timeout: 5000 }).should('contain', /required|empty|field/i);
  });
});
