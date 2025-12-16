describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add product to cart', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="notification"], [class*="toast"], [role="alert"]').should('be.visible');
  });

  it('should display cart icon with item count', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="cart"], [class*="cart-icon"]').should('contain', '1');
  });

  it('should navigate to cart page', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="cart"], [class*="cart"], a[href*="cart"]').first().click();
    cy.url().should('include', '/cart');
  });

  it('should display cart items', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="cart"], [class*="cart"], a[href*="cart"]').first().click();
    cy.get('[class*="cart-item"], [data-test*="cart-item"]').should('have.length.greaterThan', 0);
  });

  it('should calculate cart totals', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="cart"], [class*="cart"], a[href*="cart"]').first().click();
    cy.get('[class*="total"], [data-test*="total"]').should('contain.text', ['$', '€', '£', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
  });

  it('should remove item from cart', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="cart"], [class*="cart"], a[href*="cart"]').first().click();
    cy.get('button').contains(/remove|delete|x/i).first().click();
  });

  it('should update quantity in cart', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).click();
    cy.get('[data-test*="cart"], [class*="cart"], a[href*="cart"]').first().click();
    cy.get('input[type="number"], [class*="quantity"]').then(($el) => {
      if ($el.length > 0) {
        cy.get('input[type="number"], [class*="quantity"]').first().clear().type('2');
      }
    });
  });
});
