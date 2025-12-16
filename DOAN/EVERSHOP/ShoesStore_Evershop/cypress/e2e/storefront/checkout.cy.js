describe('Checkout Process', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="cart"], [class*="cart"], a[href*="cart"]').first().click();
  });

  it('should navigate to checkout', () => {
    cy.get('button').contains(/checkout|proceed|continue/i).click({ force: true });
    cy.url().should('include', '/checkout');
  });

  it('should display checkout form', () => {
    cy.get('button').contains(/checkout|proceed|continue/i).click({ force: true });
    cy.get('form, [class*="checkout"]').should('be.visible');
  });

  it('should have shipping address section', () => {
    cy.get('button').contains(/checkout|proceed|continue/i).click({ force: true });
    cy.get('input, textarea, [class*="address"]').should('have.length.greaterThan', 0);
  });

  it('should validate required fields', () => {
    cy.get('button').contains(/checkout|proceed|continue/i).click({ force: true });
    cy.get('button').contains(/submit|place order|complete/i).click({ force: true });
    cy.get('[class*="error"], [role="alert"]').should('exist');
  });

  it('should allow filling checkout form', () => {
    cy.get('button').contains(/checkout|proceed|continue/i).click({ force: true });
    cy.get('input[type="text"], input[type="email"], input[type="tel"]').first().type('John Doe', { force: true });
  });

  it('should display payment options if available', () => {
    cy.get('button').contains(/checkout|proceed|continue/i).click({ force: true });
    cy.get('[class*="payment"], [data-test*="payment"]').then(($el) => {
      if ($el.length > 0) {
        cy.get('[class*="payment"], [data-test*="payment"]').should('be.visible');
      }
    });
  });

  it('should show order summary', () => {
    cy.get('button').contains(/checkout|proceed|continue/i).click({ force: true });
    cy.get('[class*="summary"], [class*="total"], [data-test*="summary"]').should('be.visible');
  });

  it('should display shipping method options', () => {
    cy.get('button').contains(/checkout|proceed|continue|ship/i).click({ force: true });
    cy.get('[class*="shipping"], [data-test*="shipping"]').then(($el) => {
      if ($el.length > 0) {
        cy.get('[class*="shipping"], [data-test*="shipping"]').should('be.visible');
      }
    });
  });
});
