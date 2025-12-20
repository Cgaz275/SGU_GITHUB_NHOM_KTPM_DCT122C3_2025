/**
 * CMS (Content Management System) API Tests
 * Tests for CMS endpoints including pages, widgets, banners, and content management
 */

describe('CMS API Tests', () => {
  const baseUrl = Cypress.config('baseUrl');
  const apiBaseUrl = `${baseUrl}/api`;
  let adminAccessToken = null;
  let pageId = null;
  let widgetId = null;
  let bannerId = null;

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

  describe('POST /api/cms-pages - Create CMS Page', () => {
    it('Should successfully create a CMS page', () => {
      const pageData = {
        title: `Test Page ${Date.now()}`,
        url_key: `test-page-${Date.now()}`,
        content: 'This is test page content',
        status: 1,
        visibility: 1
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-pages`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: pageData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('page_id');
        pageId = response.body.data.page_id;
      });
    });

    it('Should fail to create page without title', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-pages`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          url_key: `test-${Date.now()}`,
          content: 'Content without title'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should fail to create page without content', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-pages`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: `Page ${Date.now()}`,
          url_key: `test-${Date.now()}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should reject duplicate URL key', () => {
      const urlKey = `duplicate-${Date.now()}`;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-pages`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: 'First Page',
          url_key: urlKey,
          content: 'Content'
        }
      });

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-pages`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Second Page',
          url_key: urlKey,
          content: 'Content'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('Should require authorization', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-pages`,
        body: {
          title: `Page ${Date.now()}`,
          url_key: `test-${Date.now()}`,
          content: 'Content'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('GET /api/cms-pages - List CMS Pages', () => {
    it('Should retrieve list of CMS pages', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-pages`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Should support pagination', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-pages?limit=10&page=1`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should support filtering by status', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-pages?status=1`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('GET /api/cms-pages/:id - Get CMS Page', () => {
    it('Should retrieve single CMS page', () => {
      if (!pageId) {
        cy.skip();
      }

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-pages/${pageId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.page_id).to.equal(pageId);
      });
    });

    it('Should return 404 for non-existent page', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-pages/999999`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('PUT /api/cms-pages/:id - Update CMS Page', () => {
    it('Should successfully update CMS page', () => {
      if (!pageId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/cms-pages/${pageId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Updated Page Title',
          content: 'Updated content'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.title).to.equal('Updated Page Title');
      });
    });

    it('Should fail to update page without authorization', () => {
      if (!pageId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/cms-pages/${pageId}`,
        body: {
          title: 'Hacked Title'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });

    it('Should return 404 for non-existent page update', () => {
      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/cms-pages/999999`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Updated Title'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('POST /api/cms-widgets - Create CMS Widget', () => {
    it('Should successfully create a CMS widget', () => {
      const widgetData = {
        title: `Widget ${Date.now()}`,
        type: 'hero',
        content: {
          heading: 'Welcome',
          description: 'Widget description',
          image: 'https://example.com/image.jpg'
        },
        position: 'homepage',
        sort_order: 1,
        status: 1
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-widgets`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: widgetData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        widgetId = response.body.data.widget_id;
      });
    });

    it('Should fail to create widget without title', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-widgets`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          type: 'hero',
          position: 'homepage'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should fail to create widget without type', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-widgets`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: `Widget ${Date.now()}`,
          position: 'homepage'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it('Should support different widget types', () => {
      const widgetTypes = ['hero', 'banner', 'slider', 'product_list'];

      widgetTypes.forEach((type) => {
        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/cms-widgets`,
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: {
            title: `Widget ${type} ${Date.now()}`,
            type,
            position: 'homepage',
            content: {}
          },
          failOnStatusCode: false
        }).then((response) => {
          expect([200, 201]).to.include(response.status);
        });
      });
    });
  });

  describe('GET /api/cms-widgets - List CMS Widgets', () => {
    it('Should retrieve list of CMS widgets', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-widgets`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Should support filtering by position', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-widgets?position=homepage`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('Should support filtering by type', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-widgets?type=hero`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('PUT /api/cms-widgets/:id - Update CMS Widget', () => {
    it('Should successfully update CMS widget', () => {
      if (!widgetId) {
        cy.skip();
      }

      cy.request({
        method: 'PUT',
        url: `${apiBaseUrl}/cms-widgets/${widgetId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Updated Widget Title',
          sort_order: 2
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('DELETE /api/cms-widgets/:id - Delete CMS Widget', () => {
    it('Should successfully delete CMS widget', () => {
      if (!widgetId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/cms-widgets/${widgetId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    });

    it('Should return 404 when deleting non-existent widget', () => {
      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/cms-widgets/999999`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  describe('POST /api/cms-banners - Create Banner', () => {
    it('Should successfully create a banner', () => {
      const bannerData = {
        title: `Banner ${Date.now()}`,
        content: 'Banner content',
        image: 'https://example.com/banner.jpg',
        link: 'https://example.com',
        status: 1,
        position: 'top'
      };

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-banners`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: bannerData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        bannerId = response.body.data.banner_id;
      });
    });

    it('Should fail to create banner without required fields', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-banners`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          position: 'top'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('GET /api/cms-banners - List Banners', () => {
    it('Should retrieve list of banners', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-banners`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Should support filtering by position', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-banners?position=top`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('DELETE /api/cms-pages/:id - Delete CMS Page', () => {
    it('Should successfully delete CMS page', () => {
      if (!pageId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/cms-pages/${pageId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    });

    it('Should return 404 when deleting non-existent page', () => {
      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/cms-pages/999999`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it('Should require authorization for deletion', () => {
      if (!pageId) {
        cy.skip();
      }

      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/cms-pages/${pageId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('CMS Content Management Workflow', () => {
    it('Should complete full CMS workflow: create page → update → view', () => {
      const uniqueKey = `cms-flow-${Date.now()}`;
      let createdPageId = null;

      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/cms-pages`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Workflow Test Page',
          url_key: uniqueKey,
          content: 'Initial content',
          status: 1
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        createdPageId = response.body.data.page_id;
      });

      if (createdPageId) {
        cy.request({
          method: 'PUT',
          url: `${apiBaseUrl}/cms-pages/${createdPageId}`,
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: {
            title: 'Updated Workflow Page',
            content: 'Updated content'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
        });

        cy.request({
          method: 'GET',
          url: `${apiBaseUrl}/cms-pages/${createdPageId}`,
          headers: {
            Authorization: `Bearer ${adminAccessToken}`
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.data.title).to.equal('Updated Workflow Page');
        });
      }
    });

    it('Should manage multiple widgets on homepage', () => {
      const widgets = [
        { title: 'Hero Widget', type: 'hero' },
        { title: 'Slider Widget', type: 'slider' },
        { title: 'Products Widget', type: 'product_list' }
      ];

      widgets.forEach((widget) => {
        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/cms-widgets`,
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: {
            title: `${widget.title} ${Date.now()}`,
            type: widget.type,
            position: 'homepage',
            content: {},
            status: 1
          },
          failOnStatusCode: false
        }).then((response) => {
          expect([200, 201]).to.include(response.status);
        });
      });
    });
  });

  describe('CMS Performance Tests', () => {
    it('Should retrieve page list within acceptable time', () => {
      const startTime = Date.now();

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-pages?limit=50`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        expect(duration).to.be.lessThan(3000);
      });
    });

    it('Should retrieve widget list within acceptable time', () => {
      const startTime = Date.now();

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/cms-widgets?limit=50`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        expect(duration).to.be.lessThan(3000);
      });
    });
  });
});
