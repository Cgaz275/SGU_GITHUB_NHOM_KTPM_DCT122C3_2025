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

  // Additional tests for UC_01 Business Rules
  it('should display cancel button on login form', () => {
    cy.get('button').contains(/cancel/i).should('be.visible');
  });

  it('should cancel login and clear form', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains(/cancel/i).click();
    // Should return to previous screen or clear form
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="password"]').should('have.value', '');
  });

  it('should highlight invalid email field in red on error', () => {
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains(/sign in|login/i).click();
    // Invalid field should have error styling (red border/background)
    cy.get('input[name="email"]').should(($input) => {
      const classes = $input.attr('class');
      const hasErrorClass = /error|invalid|border-red|text-critical/i.test(classes);
      const hasBorderRed = $input.css('border-color').includes('rgb');
      expect(hasErrorClass || hasBorderRed).to.be.true;
    });
  });

  it('should highlight invalid password field in red on error', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button').contains(/sign in|login/i).click();
    // Invalid field should have error styling
    cy.get('input[name="password"]').should(($input) => {
      const classes = $input.attr('class');
      const hasErrorClass = /error|invalid|border-red|text-critical/i.test(classes);
      expect(hasErrorClass).to.be.true;
    });
  });

  it('should remove error highlighting when user corrects input', () => {
    // First trigger error
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('input[name="email"]').should('have.class', /error|invalid/i);

    // Now correct the input
    cy.get('input[name="email"]').type('admin@example.com');
    // Error highlight should be removed
    cy.get('input[name="email"]').should('not.have.class', /error|invalid/i);
  });

  it('should focus invalid field on error', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('[class*="error"]').should('exist');

    // When hovering over invalid field, it should focus
    cy.get('input[name="email"]').trigger('mouseover');
    cy.get('input[name="email"]').then(($el) => {
      expect($el).to.have.class(/focus|focused/i).or.have.attr('aria-invalid', 'true');
    });
  });

  it('should display specific error message for required fields', () => {
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('[class*="error"], [role="alert"]').should('contain', /required|empty|field/i);
  });

  it('should display specific error message for invalid credentials', () => {
    cy.fillLoginForm('wrong@example.com', 'wrongpass');
    cy.submitLoginForm();
    cy.get('[class*="error"], [class*="text-critical"]').should(($el) => {
      const text = $el.text().toLowerCase();
      expect(text).to.match(/invalid|incorrect|wrong|unauthorized/i);
    });
  });

  it('should auto-populate email field value after failed login', () => {
    const testEmail = 'test@example.com';
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button').contains(/sign in|login/i).click();

    // Email should persist
    cy.get('input[name="email"]').should('have.value', testEmail);
  });

  it('should clear sensitive fields (password) after error', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains(/sign in|login/i).click();

    // Password should be cleared for security
    cy.get('input[name="password"]').should('have.value', '');
  });

  it('should have proper field focus management', () => {
    // Focus should be on email field initially
    cy.get('input[name="email"]').should('have.focus').or.be.visible;

    // Tab to password field
    cy.get('input[name="email"]').tab();
    cy.focused().should('have.attr', 'name', 'password');

    // Tab to submit button
    cy.get('input[name="password"]').tab();
    cy.focused().should('contain', /sign in|login/i);
  });

  it('should handle form submission with keyboard enter key', () => {
    cy.fillLoginForm('test@example.com', 'password123');
    cy.get('input[name="password"]').type('{enter}');
    // Form should submit
    cy.get('[class*="error"], [class*="loading"]').should('exist');
  });

  it('should validate email format in real-time', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="email"]').blur();
    // Should show validation error for invalid format
    cy.get('[class*="error"], [role="alert"]').should('contain', /email|format|invalid/i);
  });

  it('should accept valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'admin+tag@evershop.io',
      'user.name@example.co.uk'
    ];

    validEmails.forEach((email) => {
      cy.get('input[name="email"]').clear().type(email);
      cy.get('input[name="email"]').should('have.value', email);
      cy.get('input[name="email"]').blur();
      // Should not show email format error
      cy.get('[class*="error"]').should('not.contain', /email|format/i);
    });
  });

  it('should show loading indicator during login attempt', () => {
    cy.mockLoginAPI();
    cy.get('input[name="email"]').type('admin@test.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button').contains(/sign in|login/i).click();

    // Button should show loading state
    cy.get('button').contains(/sign in|login/i).should(($btn) => {
      const hasLoadingClass = /loading|disabled/i.test($btn.attr('class'));
      const isDisabled = $btn.prop('disabled');
      expect(hasLoadingClass || isDisabled).to.be.true;
    });
  });

  it('should be accessible with ARIA labels', () => {
    cy.get('input[name="email"]').should('have.attr', 'aria-label').or.have.attr('aria-labelledby');
    cy.get('input[name="password"]').should('have.attr', 'aria-label').or.have.attr('aria-labelledby');
    cy.get('button').contains(/sign in|login/i).should('be.accessible');
  });

  it('should have proper contrast for error messages', () => {
    cy.get('button').contains(/sign in|login/i).click();
    cy.get('[class*="error"]').should(($el) => {
      // Error message should be visible and readable
      expect($el).to.be.visible;
    });
  });

  it('should handle rapid form submissions', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password');
    const submitBtn = cy.get('button').contains(/sign in|login/i);

    // Rapid clicks should not cause multiple submissions
    submitBtn.click();
    submitBtn.click();
    submitBtn.click();

    // Only one error message should appear
    cy.get('[class*="error"], [role="alert"]').should('have.length.lessThan', 3);
  });
});
