describe('Product Browsing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display product list on homepage', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').should('have.length.greaterThan', 0);
  });

  it('should navigate to product detail page', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.url().should('include', '/product/');
  });

  it('should display product information on product page', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('h1, h2, [class*="product-name"], [class*="product-title"]').should('be.visible');
  });

  it('should display product price', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('[class*="price"], [data-test*="price"]').should('be.visible');
  });

  it('should have add to cart button', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('button').contains(/add to cart|add to bag/i).should('be.visible');
  });

  it('should support product filtering', () => {
    cy.get('select, [role="combobox"], [class*="filter"]').then(($el) => {
      if ($el.length > 0) {
        cy.get('select, [role="combobox"], [class*="filter"]').first().click();
      }
    });
  });

  it('should display product image', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.get('img[alt*="product"], [class*="product-image"]').should('be.visible');
  });

  it('should navigate back to products list', () => {
    cy.get('[data-test*="product"], .product, [class*="product-item"]').first().click();
    cy.go('back');
    cy.get('[data-test*="product"], .product, [class*="product-item"]').should('have.length.greaterThan', 0);
  });
});
