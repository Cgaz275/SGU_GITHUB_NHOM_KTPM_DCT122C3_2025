describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load homepage successfully', () => {
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('body').should('exist');
  });

  it('should display header with navigation', () => {
    cy.get('header').should('be.visible');
  });

  it('should display logo', () => {
    cy.get('img[alt*="logo"], a[href="/"]').should('be.visible');
  });

  it('should have functioning navigation menu', () => {
    cy.get('nav').should('be.visible');
  });

  it('should display product listings if available', () => {
    cy.get('[data-test*="product"], .product, [class*="product"]').should('have.length.greaterThan', 0);
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.get('header').should('be.visible');
    cy.viewport('macbook-15');
  });

  it('should have accessible contact or support link', () => {
    cy.get('footer').should('be.visible');
  });

  it('should scroll smoothly', () => {
    cy.scrollTo(0, 300);
    cy.window().its('scrollY').should('be.greaterThan', 0);
  });
});
