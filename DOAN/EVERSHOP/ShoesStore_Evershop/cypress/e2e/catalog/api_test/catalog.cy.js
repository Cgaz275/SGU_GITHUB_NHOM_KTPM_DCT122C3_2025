/**
 * Catalog API Tests
 * Tests for catalog endpoints including products, categories, collections, and attributes
 */

describe('Catalog API Tests', () => {
  const baseUrl = Cypress.config('baseUrl');
  const apiBaseUrl = `${baseUrl}/api`;
  let adminAccessToken = null;
  let productId = null;
  let categoryId = null;
  let attributeId = null;
  let collectionId = null;

  before(() => {
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/user/tokens`,
      body: {
        email: Cypress.env('TEST_ADMIN_EMAIL'),
        password: Cypress.env('TEST_ADMIN_PASSWORD')
      }
    }).then((response) => {
      adminAccessToken = response.body.data.accessToken;
    });
  });

  describe('POST /api/products - Create Product', () => {
    it('Should successfully create a product with all required fields', () => {
      const productData = {
        sku: `TEST-SKU-${Date.now()}`,
        name: 'Test Product',
        type: 'simple',
        price: 99.99,
        qty: 100,
        manage_stock: 1,
        stock_availability: 1,
        status: 1
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/products`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: productData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('product_id');
        productId = response.body.data.product_id;
      });
    });

    it('Should fail to create product without required fields', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/products`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Incomplete Product'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should reject product with invalid price format', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/products`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          sku: `INVALID-${Date.now()}`,
          name: 'Invalid Price Product',
          price: 'not-a-number',
          qty: 10
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should reject duplicate SKU', () => {
      const sku = `DUPLICATE-${Date.now()}`;
      
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/products`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          sku,
          name: 'First Product',
          price: 50,
          qty: 10
        }
      });

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/products`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          sku,
          name: 'Duplicate Product',
          price: 50,
          qty: 10
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('Should require authorization token', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/products`,
        body: {
          sku: `TEST-${Date.now()}`,
          name: 'Test',
          price: 50
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('GET /api/products - List Products', () => {
    it('Should retrieve list of products', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/products`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Should support pagination with limit parameter', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/products?limit=10`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.length).to.be.lessThanOrEqual(10);
      });
    });

    it('Should support filtering by status', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/products?status=1`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should support sorting by field', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/products?sortBy=price&sortOrder=asc`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('PUT /api/products/:id - Update Product', () => {
    it('Should successfully update product', () => {
      if (!productId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/products/${productId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Updated Product Name',
          price: 149.99
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.name).to.equal('Updated Product Name');
      });
    });

    it('Should return 404 for non-existent product', () => {
      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/products/999999`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Updated Name'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('POST /api/categories - Create Category', () => {
    it('Should successfully create a category', () => {
      const categoryData = {
        name: `Test Category ${Date.now()}`,
        status: 1,
        include_in_nav: 1
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/categories`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: categoryData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        categoryId = response.body.data.category_id;
      });
    });

    it('Should fail to create category without name', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/categories`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          status: 1
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should support parent category', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/categories`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: `Sub Category ${Date.now()}`,
          parent_id: 1,
          status: 1
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('GET /api/categories - List Categories', () => {
    it('Should retrieve list of categories', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/categories`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.be.an('array');
      });
    });
  });

  describe('PUT /api/categories/:id - Update Category', () => {
    it('Should successfully update category', () => {
      if (!categoryId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/categories/${categoryId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Updated Category Name'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('POST /api/attributes - Create Attribute', () => {
    it('Should successfully create an attribute', () => {
      const attributeData = {
        attribute_code: `attr_${Date.now()}`,
        attribute_name: `Test Attribute ${Date.now()}`,
        type: 'select',
        is_required: 1,
        display_on_frontend: 1,
        is_filterable: 1,
        groups: [1]
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/attributes`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: attributeData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        attributeId = response.body.data.attribute_id;
      });
    });

    it('Should fail to create attribute without name', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/attributes`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          attribute_code: `test_${Date.now()}`,
          type: 'select'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should reject duplicate attribute code', () => {
      const code = `dup_${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/attributes`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          attribute_code: code,
          attribute_name: 'First Attribute',
          type: 'select',
          groups: [1]
        }
      });

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/attributes`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          attribute_code: code,
          attribute_name: 'Duplicate Attribute',
          type: 'select',
          groups: [1]
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  describe('GET /api/attributes - List Attributes', () => {
    it('Should retrieve list of attributes', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/attributes`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.be.an('array');
      });
    });
  });

  describe('POST /api/collections - Create Collection', () => {
    it('Should successfully create a collection', () => {
      const collectionData = {
        name: `Test Collection ${Date.now()}`,
        code: `col_${Date.now()}`,
        description: 'Test collection description'
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/collections`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: collectionData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        collectionId = response.body.data.collection_id;
      });
    });

    it('Should fail to create collection without name', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/collections`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          code: `test_${Date.now()}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should reject duplicate collection code', () => {
      const code = `cdup_${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/collections`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'First Collection',
          code
        }
      });

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/collections`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Duplicate Collection',
          code
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  describe('GET /api/collections - List Collections', () => {
    it('Should retrieve list of collections', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/collections`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.be.an('array');
      });
    });
  });

  describe('DELETE /api/products/:id - Delete Product', () => {
    it('Should successfully delete product', () => {
      if (!productId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/products/${productId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
    });

    it('Should return 404 for non-existent product deletion', () => {
      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/products/999999`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('DELETE /api/categories/:id - Delete Category', () => {
    it('Should successfully delete category', () => {
      if (!categoryId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/categories/${categoryId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
    });
  });

  describe('DELETE /api/collections/:id - Delete Collection', () => {
    it('Should successfully delete collection', () => {
      if (!collectionId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/collections/${collectionId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
    });
  });
});
