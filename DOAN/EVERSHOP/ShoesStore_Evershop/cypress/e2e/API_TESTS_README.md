# EverShop API Tests Documentation

This directory contains comprehensive Cypress API tests for the EverShop e-commerce platform covering the following modules:

## Modules Tested

### 1. **Catalog API Tests** (`catalog/api_test/catalog.cy.js`)
Tests for product, category, collection, and attribute management.

**Key Endpoints Tested:**
- `POST /api/products` - Create product
- `GET /api/products` - List products
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/categories` - Create category
- `GET /api/categories` - List categories
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/attributes` - Create attribute
- `GET /api/attributes` - List attributes
- `POST /api/collections` - Create collection
- `GET /api/collections` - List collections
- `DELETE /api/collections/:id` - Delete collection

**Test Scenarios:**
- Creating products with valid/invalid data
- Handling duplicate SKUs
- Category creation and hierarchy
- Attribute creation with different types
- Collection management
- Pagination and filtering
- Authorization requirements

---

### 2. **Customer API Tests** (`customer/api_test/customer.cy.js`)
Tests for customer management, authentication, addresses, and password management.

**Key Endpoints Tested:**
- `POST /api/customers` - Register customer
- `POST /api/customers/tokens` - Customer login
- `POST /api/customers/token/refresh` - Refresh customer token
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `POST /api/customers/:id/addresses` - Add customer address
- `GET /api/customers/:id/addresses` - List addresses
- `PUT /api/customers/:id/addresses/:addressId` - Update address
- `DELETE /api/customers/:id/addresses/:addressId` - Delete address
- `POST /api/customers/:id/password` - Update password
- `POST /api/customers/password-reset` - Request password reset
- `DELETE /api/customers/:id` - Delete customer account

**Test Scenarios:**
- Customer registration with valid/invalid data
- Email validation and duplicate checks
- Login with correct/incorrect credentials
- Token refresh mechanism
- Customer profile management
- Address management (add, update, delete)
- Password change and reset flows
- Authorization checks

---

### 3. **Checkout API Tests** (`checkout/api_test/checkout.cy.js`)
Tests for shopping cart, shipping, and order checkout.

**Key Endpoints Tested:**
- `POST /api/carts` - Create shopping cart
- `GET /api/carts/:id` - Get cart details
- `POST /api/carts/:id/items` - Add item to cart
- `PUT /api/carts/:id/items/:itemId` - Update item quantity
- `DELETE /api/carts/:id/items/:itemId` - Remove item from cart
- `POST /api/shipping-zones` - Create shipping zone
- `POST /api/shipping-methods` - Create shipping method
- `POST /api/carts/:id/address` - Add address to cart
- `POST /api/carts/:id/shipping-method` - Set shipping method
- `POST /api/orders` - Create order from cart

**Test Scenarios:**
- Cart creation and management
- Adding/removing items
- Quantity updates
- Invalid quantity handling
- Stock management
- Shipping zone configuration
- Shipping method setup
- Cart address validation
- Order creation workflow
- Complete checkout flow
- Empty cart handling

---

### 4. **OMS API Tests** (`oms/api_test/oms.cy.js`)
Tests for Order Management System operations.

**Key Endpoints Tested:**
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `POST /api/orders/:id/shipments` - Create shipment
- `GET /api/orders/:id/shipments` - List shipments
- `PUT /api/orders/:id/shipments/:shipmentId` - Update shipment
- `POST /api/orders/:id/mark-delivered` - Mark order delivered
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/statistics/sales` - Get sales statistics

**Test Scenarios:**
- Order listing with pagination
- Filtering by status and date range
- Order detail retrieval
- Order status transitions
- Shipment creation and management
- Tracking number updates
- Order delivery marking
- Order cancellation (with restrictions)
- Sales statistics generation
- Order lifecycle workflows
- Performance testing

---

### 5. **CMS API Tests** (`cms/api_test/cms.cy.js`)
Tests for Content Management System including pages, widgets, and banners.

**Key Endpoints Tested:**
- `POST /api/cms-pages` - Create CMS page
- `GET /api/cms-pages` - List CMS pages
- `GET /api/cms-pages/:id` - Get page details
- `PUT /api/cms-pages/:id` - Update CMS page
- `DELETE /api/cms-pages/:id` - Delete CMS page
- `POST /api/cms-widgets` - Create widget
- `GET /api/cms-widgets` - List widgets
- `PUT /api/cms-widgets/:id` - Update widget
- `DELETE /api/cms-widgets/:id` - Delete widget
- `POST /api/cms-banners` - Create banner
- `GET /api/cms-banners` - List banners

**Test Scenarios:**
- Page creation and validation
- URL key uniqueness checks
- Widget management (hero, banner, slider, product_list types)
- Widget positioning and sorting
- Banner creation and positioning
- Content validation
- Authorization requirements
- Content workflow (create → update → view)
- Multi-widget page management
- Performance testing

---

## Running the Tests

### Prerequisites
1. Install Cypress dependencies:
```bash
npm install
```

2. Ensure the EverShop server is running on `http://localhost:3000`

3. Set environment variables in `cypress.env.json`:
```json
{
  "TEST_ADMIN_EMAIL": "alanewiston2@gmail.com",
  "TEST_ADMIN_PASSWORD": "a12345678"
}
```

### Running All API Tests
```bash
# Run all tests in headless mode
npm run cypress:run

# Run specific module tests
npm run cypress:run -- --spec "cypress/e2e/catalog/api_test/catalog.cy.js"
npm run cypress:run -- --spec "cypress/e2e/customer/api_test/customer.cy.js"
npm run cypress:run -- --spec "cypress/e2e/checkout/api_test/checkout.cy.js"
npm run cypress:run -- --spec "cypress/e2e/oms/api_test/oms.cy.js"
npm run cypress:run -- --spec "cypress/e2e/cms/api_test/cms.cy.js"
```

### Running Tests in Interactive Mode
```bash
# Open Cypress Test Runner
npm run cypress:open

# Then select the test file you want to run interactively
```

### Running Specific Test Suites
```bash
# Run a specific describe block
npm run cypress:run -- --spec "cypress/e2e/catalog/api_test/catalog.cy.js" --grep "Create Product"

# Run tests matching a pattern
npm run cypress:run -- --grep "authorization"
```

---

## Test Structure

Each test file follows a consistent structure:

1. **Setup Phase**
   - Obtain admin authentication token
   - Create test data if needed

2. **Describe Blocks** - Organized by endpoint and functionality
   - Positive test cases
   - Negative test cases (invalid data, missing fields)
   - Authorization checks
   - Edge cases

3. **Individual Test Cases** (it blocks)
   - Clear test descriptions
   - Specific assertions
   - Failure handling with `failOnStatusCode: false`

4. **Cleanup**
   - Automatic cleanup via test framework
   - Deletion of created test data

---

## Test Data Management

### Test Data Naming
All test data uses timestamps to ensure uniqueness:
```javascript
const email = `test_${Date.now()}@example.com`;
const urlKey = `test-${Date.now()}`;
```

### Test Flow
1. **Create** - Create test resources
2. **Modify** - Update created resources
3. **Delete** - Clean up resources
4. **Verify** - Validate responses

---

## Common Test Patterns

### Authentication
All admin operations require bearer token:
```javascript
headers: {
  Authorization: `Bearer ${adminAccessToken}`,
  'Content-Type': 'application/json'
}
```

### Error Handling
Tests handle multiple possible status codes:
```javascript
expect(response.status).to.be.oneOf([400, 422]);
```

### Conditional Skipping
Tests skip if required data not available:
```javascript
if (!productId) {
  cy.skip();
}
```

---

## Expected Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation completed",
  "data": {
    "id": 123,
    // resource data
  }
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify credentials in `cypress.env.json`
   - Check if admin user exists in the database
   - Verify API endpoint is `/api/user/tokens`

2. **API Endpoint Not Found (404)**
   - Ensure EverShop server is running
   - Verify base URL in `cypress.config.js` (default: `http://localhost:3000`)
   - Check module is enabled in EverShop

3. **Data Conflicts**
   - Tests use timestamps for uniqueness, but if tests run too quickly:
   - Clear test data manually or run tests with delays
   - Consider increasing `Date.now()` precision if needed

4. **Connection Timeouts**
   - Increase timeout in `cypress.config.js`:
   ```javascript
   defaultCommandTimeout: 15000
   requestTimeout: 15000
   ```

---

## Assertions Reference

### Status Code Checks
```javascript
expect(response.status).to.equal(200);
expect(response.status).to.be.oneOf([200, 201]);
expect(response.status).to.be.greaterThan(199);
```

### Response Body Checks
```javascript
expect(response.body).to.have.property('data');
expect(response.body.data).to.be.an('array');
expect(response.body.data).to.have.lengthOf(10);
```

### Data Validation
```javascript
expect(response.body.data.email).to.equal('test@example.com');
expect(response.body.data.price).to.be.greaterThan(0);
expect(response.body.data.name).to.include('Test');
```

---

## Best Practices

1. **Use `failOnStatusCode: false`** for error scenarios
2. **Store IDs in variables** for use in subsequent tests
3. **Use describe blocks** to organize related tests
4. **Test both happy paths and error cases**
5. **Add performance tests** for critical operations
6. **Document non-obvious test logic** with comments
7. **Use meaningful assertion messages** when needed
8. **Clean up test data** after tests complete

---

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Cypress API Tests
  run: |
    npm install
    npm run cypress:run
```

Results are saved to `cypress/results/` in JSON format for CI integration.

---

## Contributing

When adding new API tests:

1. Follow existing test structure
2. Use consistent naming conventions
3. Add both positive and negative test cases
4. Include authorization checks
5. Document test scenarios in describe blocks
6. Update this README with new endpoints

---

## Contact & Support

For issues or questions about these tests, please refer to:
- EverShop Documentation: https://docs.evershop.io
- Test Configuration: `cypress.config.js`
- Environment Setup: `cypress.env.json`

---

**Last Updated:** 2024
**Test Coverage:** 5 Modules (Catalog, Customer, Checkout, OMS, CMS)
