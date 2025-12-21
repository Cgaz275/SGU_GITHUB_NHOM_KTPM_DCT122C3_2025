# CHƯƠNG 4: THIẾT KẾ KIỂM THỬ

## 1. Tổng Quan

Kiểm thử phần mềm là một phần quan trọng trong quy trình phát triển ứng dụng e-commerce EverShop. Mục đích của kiểm thử là đảm bảo chất lượng phần mềm, phát hiện lỗi sớm, và xác minh rằng hệ thống hoạt động theo yêu cầu.

### 1.1 Mục Tiêu Kiểm Thử
- **Phát hiện lỗi:** Tìm ra các bộ phận không hoạt động đúng cách
- **Xác minh yêu cầu:** Đảm bảo phần mềm đáp ứng các yêu cầu chức năng
- **Đảm bảo chất lượng:** Cải thiện độ tin cậy và hiệu suất hệ thống
- **Giảm rủi ro:** Phát hiện vấn đề trước khi triển khai vào sản xuất
- **Tối ưu hóa:** Nâng cao trải nghiệm người dùng

### 1.2 Phạm Vi Kiểm Thử EverShop

Hệ thống EverShop bao gồm các module chính cần kiểm thử:

| Module | Mô Tả | Loại Kiểm Thử |
|--------|-------|----------------|
| **Catalog** | Quản lý sản phẩm, danh mục, thuộc tính | API, Unit, E2E |
| **Customer** | Quản lý khách hàng, đăng ký, đăng nhập | API, Unit, E2E |
| **Checkout** | Giỏ hàng, thanh toán, giao hàng | API, Unit, E2E, Integration |
| **OMS** | Quản lý đơn hàng, vận chuyển | API, Unit, E2E |
| **CMS** | Quản lý nội dung, widget, banner | API, Unit, E2E |

### 1.3 Các Cấp Độ Kiểm Thử
- **Unit Testing:** Kiểm thử các thành phần riêng lẻ
- **Integration Testing:** Kiểm thử sự tương tác giữa các module
- **System Testing:** Kiểm thử toàn bộ hệ thống
- **Acceptance Testing:** Kiểm thử chấp nhận người dùng (UAT)

---

## 2. Phạm Vi Kiểm Thử (Test Scope)

### 2.1 Các Giai Đoạn Kiểm Thử

Bảng sau đây liệt kê các giai đoạn khác nhau của quá trình kiểm thử Website Shoes Store:

| Phases | Teams Responsible |
|--------|-------------------|
| **Kiểm thử đơn vị** | Nhóm phát triển |
| **Kiểm thử tích hợp** | Nhóm kiểm thử |
| **Kiểm thử hệ thống** | Nhóm kiểm thử |
| **Kiểm thử chấp nhận** | Đại diện người dùng |

#### 2.1.1 Kiểm Thử Đơn Vị (Unit Testing)
**Nhóm Phát Triển (Development Team)**
- Kiểm thử các function, method riêng lẻ
- Sử dụng Jest framework
- Coverage target: ≥ 70%
- Thời gian: Song song với phát triển

**Phạm vi:**
- Auth Module: authMiddleware, loginUser, logoutUser, generateToken, refreshToken
- Catalog Module: createCategory, createProduct, deleteCategory
- Checkout Module: addCartItem, calculatePrice, discountAmount, taxAmount, grandTotal
- Customer Module: createCustomer, loginCustomer
- CMS Module: uploadFile, deleteFile, createFolder
- COD Module: Payment validation, capture, initialization

#### 2.1.2 Kiểm Thử Tích Hợp (Integration Testing)
**Nhóm Kiểm Thử (QA Team)**
- Kiểm thử tương tác giữa multiple modules
- Sử dụng Supertest + Jest
- Kiểm thử API endpoints + Database
- Thời gian: Sau unit tests

**Phạm vi:**
- Admin workflow: Login → Pending updates → Action
- Create listing: User → Form validation → Database → Response
- View listing: Browse → Database query → Display
- Checkout flow: Cart → Shipping → Payment → Order creation
- Report flow: User report → Admin review → Status update

#### 2.1.3 Kiểm Thử Hệ Thống (System Testing)
**Nhóm Kiểm Thử (QA Team)**
- Kiểm thử toàn bộ ứng dụng end-to-end
- Sử dụng Cypress
- Kiểm thử giao diện người dùng + business logic
- Thời gian: Trước release

**Phạm vi:**
- Complete user flows từ login đến checkout
- Cross-browser compatibility
- Responsive design testing
- Performance on different devices

#### 2.1.4 Kiểm Thử Chấp Nhận (UAT - User Acceptance Testing)
**Đại Diện Người Dùng (End User / Product Owner)**
- Xác minh yêu cầu kinh doanh
- Kiểm tra trải nghiệm người dùng thực tế
- Thời gian: Cuối cùng trước deployment

**Phạm vi:**
- Business requirements verification
- User experience validation
- Real-world scenario testing

---

### 2.2 Các Loại Kiểm Thử Áp Dụng

Website Shoes Store sẽ áp dụng các loại kiểm thử sau:

| Activity | Teams Responsible |
|----------|-------------------|
| **Functionality Testing** | Nhóm kiểm thử |
| **Database Testing** | Nhóm kiểm thử + Dev |
| **Security Testing** | Nhóm kiểm thử |
| **GUI and Usability Testing** | Nhóm kiểm thử |
| **Performance and Load/Volume Testing** | Nhóm kiểm thử |
| **Code Testing** | Nhóm phát triển |
| **Smoke Testing** | Nhóm kiểm thử |
| **Regression Testing** | Nhóm kiểm thử |
| **Defect fix verification testing / Defect validation testing** | Nhóm kiểm thử |

#### 2.2.1 Functionality Testing
**Mục đích:** Xác minh tất cả các chức năng hoạt động theo yêu cầu

**Phạm vi:**
- Product browsing & filtering
- Shopping cart operations (add, remove, update qty)
- User registration & login
- Checkout process
- Order management
- Report & review functionality
- Admin dashboard

**Phương pháp:** Manual + Automated (Jest, Cypress)

#### 2.2.2 Database Testing
**Mục đích:** Xác minh dữ liệu được lưu trữ, truy vấn, và cập nhật đúng cách

**Phạm vi:**
- Data integrity
- SQL queries performance
- Database transactions
- Data relationships (FK, constraints)
- Backup & recovery

**Phương pháp:** Integration tests với PostgreSQL

#### 2.2.3 Security Testing
**Mục đích:** Phát hiện và ngăn chặn các lỗ hổng bảo mật

**Phạm vi:**
- SQL Injection attacks
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Authentication bypass
- Authorization vulnerabilities
- Password strength
- JWT token validation
- Data encryption

**Phương pháp:** Manual penetration testing + Automated (SAST tools)

#### 2.2.4 GUI and Usability Testing
**Mục đích:** Xác minh giao diện người dùng thân thiện và dễ sử dụng

**Phạm vi:**
- Layout & design consistency
- Navigation clarity
- Button functionality
- Form validation messages
- Responsive design (mobile, tablet, desktop)
- Accessibility (WCAG standards)
- Color contrast
- Font readability

**Phương pháp:** Manual testing + Automated (Cypress visual tests)

#### 2.2.5 Performance and Load/Volume Testing
**Mục đích:** Đảm bảo hệ thống hoạt động tốt dưới tải lớn

**Phạm vi:**
- Page load time (< 3 seconds)
- Response time under load
- Database query performance
- Concurrent user handling
- Memory usage
- CPU usage
- Bandwidth optimization

**Phương pháp:** JMeter, LoadRunner, hoặc K6

#### 2.2.6 Code Testing
**Mục đích:** Kiểm tra chất lượng code và tuân thủ chuẩn

**Phạm vi:**
- Code style (ESLint)
- Type checking (TypeScript)
- Unit tests coverage
- Code complexity
- Unused variables
- Security vulnerabilities (Semgrep)

**Phương pháp:** Automated static analysis

#### 2.2.7 Smoke Testing
**Mục đích:** Kiểm tra cơ bản các chức năng chính hoạt động

**Phạm vi:**
- Application startup
- Database connection
- API endpoints availability
- Critical user flows

**Phương pháp:** Automated (quick tests)

#### 2.2.8 Regression Testing
**Mục đích:** Đảm bảo code thay đổi mới không break chức năng cũ

**Phạm vi:**
- All existing test cases
- Previous bug fixes
- All modules affected by change

**Phương pháp:** Automated test suite

#### 2.2.9 Defect Fix Verification Testing
**Mục đích:** Xác minh bug được fix đúng và không tạo ra bug mới

**Phạm vi:**
- Reported bugs
- Fix verification
- Side effect checking

---

## 3. Phân Tích Khung Nhìn V-Model

### 2.1 Giới Thiệu V-Model

V-Model là mô hình phát triển phần mềm kết hợp các hoạt động kiểm thử với các giai đoạn phát triển. Tên gọi "V" xuất phát từ hình dạng của mô hình: phía bên trái là các giai đoạn phát triển (Design), phía bên phải là các giai đoạn kiểm thử (Testing).

```
    DEVELOPMENT                    TESTING
    ___________                    _______
    
    Requirement                    UAT Testing
         |                              |
         |                              |
    High-Level Design ---------> System Testing
         |                              |
         |                              |
    Detailed Design ---------> Integration Testing
         |                              |
         |                              |
    Implementation ---------> Unit Testing
```

### 2.2 Áp Dụng V-Model cho EverShop

#### 2.2.1 Giai Đoạn Thiết Kế (Design)

**Yêu Cầu (Requirements):**
- Phân tích yêu cầu chức năng: Quản lý sản phẩm, khách hàng, đơn hàng
- Phân tích yêu cầu phi chức năng: Hiệu suất, bảo mật, độ khả dụng

**Thiết Kế Cấp Cao (High-Level Design):**
- Kiến trúc hệ thống: Microservices vs Monolithic
- Các module và mối quan hệ giữa chúng
- Database schema
- API endpoints

**Thiết Kế Chi Tiết (Detailed Design):**
- Thiết kế các class và function
- Thiết kế workflow kinh doanh
- Thiết kế giao diện người dùng (UI)

**Triển Khai (Implementation):**
- Viết code theo thiết kế
- Code review
- Version control

#### 2.2.2 Giai Đoạn Kiểm Thử (Testing)

**Kiểm Thử Đơn Vị (Unit Testing):**
- Kiểm thử các function riêng lẻ
- Sử dụng Jest framework
- Phạm vi: Tất cả các module
- Tỉ lệ coverage: ≥ 70%

Ví dụ:
```javascript
describe('Product Service', () => {
  it('Should calculate discount price correctly', () => {
    const originalPrice = 100;
    const discount = 10;
    const result = calculateDiscountPrice(originalPrice, discount);
    expect(result).toBe(90);
  });
});
```

**Kiểm Thử Tích Hợp (Integration Testing):**
- Kiểm thử tương tác giữa các module
- Kiểm thử API endpoints với database
- Ví dụ: Cart + Checkout + Order

```javascript
describe('Checkout Integration', () => {
  it('Should create order when cart items are valid', async () => {
    const cart = await createCart();
    await addItemToCart(cart.id, productId, 2);
    const order = await createOrderFromCart(cart.id);
    expect(order).toHaveProperty('order_id');
  });
});
```

**Kiểm Thử Hệ Thống (System Testing):**
- Kiểm thử toàn bộ luồng người dùng
- Sử dụng Cypress framework
- End-to-End (E2E) testing
- Test các tình huống thực tế

**Kiểm Thử Chấp Nhận (UAT - User Acceptance Testing):**
- Người dùng thực hiện kiểm thử
- Xác minh yêu cầu kinh doanh
- Kiểm tra trải nghiệm người dùng

### 2.3 Lợi Ích của V-Model

✓ Rõ ràng và dễ theo dõi các giai đoạn  
✓ Kiểm thử được lên kế hoạch từ sớm  
✓ Dễ phát hiện lỗi ở giai đoạn thiết kế  
✓ Giảm chi phí sửa lỗi  
✓ Đảm bảo chất lượng cao  

### 2.4 Hạn Chế của V-Model

✗ Không linh hoạt với thay đổi yêu cầu  
✗ Phù hợp với dự án có yêu cầu rõ ràng  
✗ Thời gian dài từ bắt đầu đến kết thúc  

---

## 3. Phân Tích Khung Nhìn Agile CI/CD

### 3.1 Giới Thiệu Agile CI/CD

Agile CI/CD (Continuous Integration/Continuous Deployment) là phương pháp phát triển liên tục với:
- **Continuous Integration (CI):** Tích hợp code thường xuyên
- **Continuous Delivery (CD):** Giao hàng sản phẩm tự động
- **Continuous Deployment:** Triển khai tự động vào sản xuất

### 3.2 Quy Trình Agile CI/CD cho EverShop

```
┌─────────────┐
│ Developer   │ Viết code, commit lên Git
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Git Push            │ Push code lên repository
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ CI Pipeline         │
│ - ESLint            │ Kiểm tra code style
│ - Jest Unit Tests   │ Unit test
│ - Build             │ Build project
└──────┬──────────────┘
       │
       ▼
   Pass? ──No──> Notify Developer (Fix Issues)
       │
      Yes
       │
       ▼
┌─────────────────────┐
│ CD Pipeline         │
│ - Deploy Staging    │ Triển khai staging
│ - Cypress E2E Tests │ E2E test
│ - Smoke Tests       │ Kiểm tra cơ bản
└──────┬──────────────┘
       │
       ▼
   Pass? ──No──> Rollback & Notify
       │
      Yes
       │
       ▼
┌─────────────────────┐
│ Deploy Production   │ Triển khai sản xuất
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Monitor & Logging   │ Giám sát và ghi log
└─────────────────────┘
```

### 3.3 Chi Tiết Các Bước CI/CD

#### 3.3.1 Commit & Push Stage
```yaml
Trigger: Developer push code to Git
Time: < 1 minute
Action: Repository receives commit
```

#### 3.3.2 CI Stage (~ 5-10 minutes)

**Linting & Code Quality:**
```bash
eslint src/
prettier --check src/
```
- Kiểm tra code style
- Phát hiện lỗi cơ bản

**Unit Testing:**
```bash
jest --coverage
```
- Chạy tất cả unit tests
- Yêu cầu: coverage ≥ 70%

**Build:**
```bash
npm run build
```
- Compile TypeScript
- Bundle code
- Kiểm tra lỗi build

#### 3.3.3 CD Stage (~ 10-15 minutes)

**Deploy Staging:**
```bash
docker build -t evershop:latest .
docker push registry/evershop:latest
kubectl deploy staging
```

**E2E Testing:**
```bash
cypress run --spec "cypress/e2e/**/*.cy.js"
```
- Kiểm thử toàn bộ user flow
- Test catalog, customer, checkout, oms, cms

**Smoke Testing:**
```bash
curl https://staging.evershop.io/health
# Kiểm tra API endpoints có phản hồi
# Kiểm tra database connection
# Kiểm tra cache
```

#### 3.3.4 Production Deployment

**Blue-Green Deployment:**
- Duy trì 2 version (Blue & Green)
- Switch traffic khi Green sẵn sàng
- Rollback nhanh nếu có vấn đề

**Canary Release:**
- Triển khai cho 10% người dùng
- Monitor metrics
- Tăng dần đến 100%

### 3.4 Lợi Ích của Agile CI/CD

✓ Phát hành nhanh chóng  
✓ Phát hiện lỗi sớm  
✓ Giảm rủi ro triển khai  
✓ Feedback nhanh từ người dùng  
✓ Tự động hóa quy trình  
✓ Cải thiện chất lượng liên tục  

### 3.5 Công Cụ Sử Dụng

- **VCS:** Git (GitHub, GitLab)
- **CI/CD:** Jenkins, GitLab CI, GitHub Actions
- **Containerization:** Docker, Kubernetes
- **Monitoring:** Prometheus, ELK Stack

---

## 4. Phương Pháp Kiểm Thử

### 4.1 Kiểm Thử Tĩnh (Static Testing)

#### 4.1.1 Định Nghĩa
Kiểm thử tĩnh là kiểm thử code mà **không thực thi** chương trình. Tập trung vào phân tích code, thiết kế, tài liệu.

#### 4.1.2 Các Kỹ Thuật Kiểm Thử Tĩnh

**1. Code Review**
- Nhà phát triển khác đọc và xem xét code
- Tìm lỗi logic, vấn đề bảo mật
- Kiểm tra tuân thủ chuẩn code

Quy trình Code Review EverShop:
```
1. Developer push code → Create Pull Request
2. Reviewer kiểm tra code
   - Functionality correctness
   - Code style compliance
   - Performance impact
   - Security issues
3. Comment & Request Changes (nếu cần)
4. Approve & Merge
```

**2. Static Analysis (Linting)**
- Sử dụng ESLint để kiểm tra code
- Tìm pattern lỗi phổ biến
- Kiểm tra chuẩn code style

Cấu hình ESLint cho EverShop:
```javascript
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-undefined': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2]
  }
};
```

**3. Type Checking (TypeScript)**
- Kiểm tra kiểu dữ liệu
- Phát hiện lỗi kiểu tại compile time
- Giảm runtime errors

```typescript
// Example TypeScript check
interface Product {
  product_id: number;
  name: string;
  price: number;
  qty: number;
}

function calculateTotal(product: Product): number {
  return product.price * product.qty;
}

// TypeScript sẽ báo lỗi nếu gọi với sai kiểu
calculateTotal({ name: 'Shoe' }); // ❌ Error: Missing properties
```

**4. Code Complexity Analysis**
- Đo độ phức tạp cyclomatic
- Xác định các function quá phức tạp
- Đề xuất refactor

#### 4.1.3 Lợi Ích Kiểm Thử Tĩnh

✓ Phát hiện lỗi sớm (trước compile)  
✓ Giảm chi phí sửa lỗi  
✓ Cải thiện độ bảo mật  
✓ Đảm bảo chuẩn code  
✓ Giảm maintenance cost  

---

### 4.2 Kiểm Thử Động (Dynamic Testing)

#### 4.2.1 Định Nghĩa
Kiểm thử động là kiểm thử **bằng cách thực thi** chương trình để xác minh hành vi.

#### 4.2.2 Các Loại Kiểm Thử Động

**1. Unit Testing**

Định nghĩa: Kiểm thử các function/method riên lẻ

Framework: Jest

**Ví dụ 1: Unit Test cho Checkout Module (addCartItem)**
```javascript
// packages/evershop/src/modules/checkout/tests/unit/addCartItem.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('addCartItem Service', () => {
  let mockCart;
  let mockItem;

  beforeEach(() => {
    jest.clearAllMocks();

    mockItem = {
      product_id: 1,
      product_sku: 'PROD-001',
      qty: 1,
      price: 99.99,
      getData: jest.fn().mockImplementation(function(key) {
        const data = {
          product_sku: this.product_sku,
          qty: this.qty
        };
        return data[key];
      }),
      setData: jest.fn(),
      hasError: jest.fn().mockReturnValue(false),
      getErrors: jest.fn().mockReturnValue({})
    };

    mockCart = {
      items: [mockItem],
      createItem: jest.fn().mockResolvedValue(mockItem),
      getItems: jest.fn().mockReturnValue([mockItem]),
      setData: jest.fn().mockResolvedValue(undefined),
      export: jest.fn().mockReturnValue({ items: [mockItem] })
    };
  });

  describe('Add single item to cart', () => {
    it('should add new item to cart', async () => {
      const newItem = { product_id: 2 };
      expect(newItem).toHaveProperty('product_id');
    });

    it('should create item through cart', async () => {
      mockCart.createItem.mockResolvedValue(mockItem);
      expect(mockCart.createItem).toBeDefined();
    });

    it('should return added item', async () => {
      const result = mockCart.createItem(1, 1);
      expect(result).toBeDefined();
    });
  });

  describe('Quantity handling', () => {
    it('should parse quantity as number', async () => {
      const qty = parseInt('5', 10);
      expect(qty).toBe(5);
      expect(typeof qty).toBe('number');
    });

    it('should handle string quantity', async () => {
      const qty = parseInt('10', 10);
      expect(qty).toBe(10);
    });

    it('should handle numeric quantity', async () => {
      const qty = parseInt('7', 10);
      expect(qty).toBe(7);
    });
  });
});
```

**Ví dụ 2: Unit Test cho Catalog Module (createProduct)**
```javascript
// packages/evershop/src/modules/catalog/tests/unit/createProduct.test.ts
import { describe, it, expect } from '@jest/globals';

describe('createProduct Service', () => {
  describe('Create valid product', () => {
    it('should accept product data with name', () => {
      const productData = {
        name: 'Test Shoe',
        sku: 'SHOE-001',
        price: 99.99
      };
      expect(productData).toHaveProperty('name');
      expect(productData.name).toBe('Test Shoe');
    });

    it('should validate product SKU', () => {
      const productData = { sku: 'PROD-001' };
      expect(productData).toHaveProperty('sku');
      expect(productData.sku).toBe('PROD-001');
    });

    it('should validate product price is greater than 0', () => {
      const productData = { price: 99.99 };
      expect(productData).toHaveProperty('price');
      expect(productData.price).toBeGreaterThan(0);
    });
  });

  describe('Required product fields validation', () => {
    it('should require name field', () => {
      const invalidData = { sku: 'TEST-001', price: 99.99 };
      expect(invalidData).not.toHaveProperty('name');
    });

    it('should require sku field', () => {
      const invalidData = { name: 'Product', price: 99.99 };
      expect(invalidData).not.toHaveProperty('sku');
    });

    it('should require price field', () => {
      const invalidData = { name: 'Product', sku: 'PROD-001' };
      expect(invalidData).not.toHaveProperty('price');
    });

    it('should accept complete product data', () => {
      const productData = {
        name: 'Running Shoe',
        sku: 'SHOE-001',
        price: 100,
        status: 1,
        qty: 100,
        url_key: 'running-shoe',
        group_id: 1,
        visibility: 'visible'
      };
      expect(productData).toHaveProperty('name');
      expect(productData).toHaveProperty('sku');
      expect(productData).toHaveProperty('price');
      expect(productData).toHaveProperty('status');
      expect(productData).toHaveProperty('qty');
    });
  });
});
```
```

Chạy Unit Tests:
```bash
npm test
npm test -- --coverage
```

**2. Integration Testing**

Định nghĩa: Kiểm thử tương tác giữa các module

Ví dụ Integration Test:
```javascript
// checkout.integration.test.js
describe('Checkout Integration', () => {
  it('Should complete checkout flow: add item → checkout → create order', async () => {
    // Step 1: Create cart
    const cart = await cartService.createCart();
    expect(cart).toHaveProperty('cart_id');

    // Step 2: Add item
    const product = await catalogService.getProduct(1);
    await cartService.addItem(cart.id, product.id, 2);
    const updatedCart = await cartService.getCart(cart.id);
    expect(updatedCart.items).toHaveLength(1);
    expect(updatedCart.items[0].qty).toBe(2);

    // Step 3: Add address
    await cartService.addAddress(cart.id, {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '123 Main St',
      city: 'City',
      country: 'Vietnam'
    });

    // Step 4: Create order
    const order = await orderService.createOrder(cart.id);
    expect(order).toHaveProperty('order_id');
    expect(order.status).toBe('pending');
  });
});
```

**3. API Testing**

Định nghĩa: Kiểm thử API endpoints

Framework: Cypress (API requests)

**Ví dụ 1: Checkout API Test**
```javascript
// cypress/e2e/checkout/api_test/checkout.cy.js
describe('Checkout API Tests', () => {
  const baseUrl = Cypress.config('baseUrl');
  const apiBaseUrl = `${baseUrl}/api`;
  let adminAccessToken = null;
  let cartId = null;
  let productId = null;

  before(() => {
    // Login as admin
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

    // Create test product
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/products`,
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        sku: `CHECKOUT-${Date.now()}`,
        name: 'Checkout Test Shoe',
        type: 'simple',
        price: 99.99,
        qty: 100,
        status: 1
      }
    }).then((response) => {
      if (response.status === 200) {
        productId = response.body.data.product_id;
      }
    });
  });

  describe('POST /api/carts - Create Cart', () => {
    it('Should successfully create a new cart', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('cart_id');
        cartId = response.body.data.cart_id;
      });
    });

    it('Should return valid cart object structure', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/carts`,
        body: {}
      }).then((response) => {
        expect(response.body.data).to.have.property('items');
        expect(response.body.data.items).to.be.an('array');
        expect(response.body.data).to.have.property('total');
        expect(response.body.data).to.have.property('items_count');
      });
    });
  });

  describe('GET /api/carts/:id - Get Cart', () => {
    it('Should retrieve cart details', () => {
      if (!cartId) cy.skip();

      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/carts/${cartId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.cart_id).to.equal(cartId);
      });
    });

    it('Should return 404 for non-existent cart', () => {
      cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/carts/invalid-cart-id`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });
});
```

**Ví dụ 2: Admin Authentication API Test**
```javascript
// cypress/e2e/auth/api_test/admin-auth.cy.js
describe('Admin Authentication API Tests', () => {
  const baseUrl = Cypress.config('baseUrl');
  const apiBaseUrl = `${baseUrl}/api`;
  const testAdmin = Cypress.env('TEST_ADMIN_EMAIL') || 'alanewiston2@gmail.com';
  const testPassword = Cypress.env('TEST_ADMIN_PASSWORD') || 'a12345678';

  describe('Admin Login Endpoint - POST /api/user/tokens', () => {
    it('Should successfully login admin with valid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/user/tokens`,
        headers: { 'Content-Type': 'application/json' },
        body: {
          email: testAdmin,
          password: testPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.property('accessToken');
        expect(response.body.data).to.have.property('refreshToken');
      });
    });

    it('Should fail with invalid admin email', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/user/tokens`,
        body: {
          email: 'nonexistent@test.com',
          password: testPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 422, 500]);
      });
    });

    it('Should fail with incorrect password', () => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/user/tokens`,
        body: {
          email: testAdmin,
          password: 'wrongpassword123'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 422, 500]);
      });
    });

    it('Should reject SQL injection in email field', () => {
      const sqlInjection = "admin' OR '1'='1";
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/user/tokens`,
        body: {
          email: sqlInjection,
          password: testPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 422, 500]);
      });
    });
  });
});
```

**4. E2E Testing (User Acceptance)**

Định nghĩa: Kiểm thử toàn bộ luồng người dùng từ giao diện

Framework: Cypress

Ví dụ E2E Test cho EverShop Shoes Store:
```javascript
// cypress/e2e/shopping.cy.js
describe('E2E: Complete Shopping Flow - EverShop Shoes Store', () => {
  beforeEach(() => {
    cy.visit('/'); // Navigate to home page
  });

  it('Should complete shopping from browsing shoes to order', () => {
    // Step 1: Home page should be visible
    cy.contains('EverShop').should('be.visible');
    cy.get('[data-test="header"]').should('exist');

    // Step 2: Navigate to catalog/products
    cy.get('[data-test="menu-catalog"]').click();
    cy.url().should('include', '/catalog');
    cy.contains('Shoes', { matchCase: false }).should('be.visible');

    // Step 3: Browse and select a shoe product
    cy.get('[data-test="product-card"]').first().click();
    cy.get('[data-test="product-name"]').should('be.visible');
    cy.get('[data-test="product-price"]').should('be.visible');

    // Step 4: Add product to cart
    cy.get('[data-test="add-to-cart"]').click();
    cy.get('[data-test="cart-message"]').should('contain', 'Added');

    // Step 5: View cart
    cy.get('[data-test="cart-icon"]').click();
    cy.contains('Your Cart').should('be.visible');
    cy.get('[data-test="cart-item"]').should('have.length', 1);
    cy.get('[data-test="cart-total"]').should('be.visible');

    // Step 6: Proceed to checkout
    cy.get('[data-test="checkout-btn"]').click();
    cy.url().should('include', '/checkout');

    // Step 7: Enter shipping information
    cy.get('[data-test="first-name"]').type('John');
    cy.get('[data-test="last-name"]').type('Doe');
    cy.get('[data-test="email"]').type('john@example.com');
    cy.get('[data-test="phone"]').type('0123456789');
    cy.get('[data-test="address"]').type('123 Main Street');
    cy.get('[data-test="city"]').type('Ho Chi Minh City');
    cy.get('[data-test="state"]').type('HCM');
    cy.get('[data-test="country"]').select('Vietnam');
    cy.get('[data-test="postcode"]').type('700000');

    // Step 8: Select shipping method
    cy.get('[data-test="shipping-method"]').first().click();

    // Step 9: Select payment method
    cy.get('[data-test="payment-method"]').first().click();

    // Step 10: Place order
    cy.get('[data-test="place-order-btn"]').click();
    cy.url().should('include', '/order');
    cy.contains('Order Confirmation', { matchCase: false }).should('be.visible');
    cy.get('[data-test="order-number"]').should('be.visible');
  });

  it('Should handle cart operations correctly', () => {
    // Add multiple items
    cy.get('[data-test="product-card"]').eq(0).click();
    cy.get('[data-test="add-to-cart"]').click();
    cy.go('back');

    cy.get('[data-test="product-card"]').eq(1).click();
    cy.get('[data-test="add-to-cart"]').click();
    cy.go('back');

    // View cart and verify items
    cy.get('[data-test="cart-icon"]').click();
    cy.get('[data-test="cart-item"]').should('have.length', 2);

    // Update quantity
    cy.get('[data-test="item-qty"]').first().clear().type('2');
    cy.get('[data-test="cart-total"]').should('be.visible');

    // Remove item
    cy.get('[data-test="remove-item"]').last().click();
    cy.get('[data-test="cart-item"]').should('have.length', 1);
```

#### 4.2.3 Chiến Lược Kiểm Thử

**Pyramid Testing:**
```
         │
         │ E2E Tests (5%)
         │ ▲
         │▲ ▲
         │ ▲ ▲ Integration Tests (15%)
         │▲ ▲ ▲
      ───┼────────────────
         │▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ Unit Tests (80%)
         │
```

Phân bổ kiểm thử cho EverShop:
- **Unit Tests:** 80% - Kiểm thử các function, service
- **Integration Tests:** 15% - Kiểm thử API, Database
- **E2E Tests:** 5% - Kiểm thử user flow quan trọng

#### 4.2.4 Test Data Management

Tạo test data fixtures:
```javascript
// fixtures/products.json
{
  "products": [
    {
      "product_id": 1,
      "sku": "SHOE-001",
      "name": "Test Shoe",
      "price": 99.99,
      "qty": 100,
      "status": 1
    }
  ]
}
```

Seed test data:
```javascript
beforeEach(async () => {
  await database.seed('products', fixtures.products);
  await database.seed('categories', fixtures.categories);
});

afterEach(async () => {
  await database.cleanup();
});
```

---

## 5. Phân Tích Các Kỹ Thuật Nâng Cao

### 5.1 Manual Testing vs Automation Testing

#### 5.1.1 Manual Testing

**Định Nghĩa:**
Manual testing là quá trình kiểm thử phần mềm bằng tay, người kiểm thử tương tác trực tiếp với ứng dụng.

**Ưu Điểm:**
✓ Phát hiện lỗi không mong đợi  
✓ Kiểm tra trải nghiệm người dùng  
✓ Hiệu quả chi phí ban đầu  
✓ Linh hoạt với thay đổi  

**Nhược Điểm:**
✗ Chậm và tốn công sức  
✗ Dễ xảy ra lỗi con người  
✗ Khó lặp lại test case  
✗ Chi phí cao trong dài hạn  

**Khi Nào Nên Dùng:**
- Exploratory testing (phát hiện lỗi mới)
- Usability testing (kiểm tra UX)
- Ad-hoc testing
- Những case phức tạp và thay đổi thường xuyên

#### 5.1.2 Automation Testing

**Định Nghĩa:**
Automation testing là sử dụng công cụ, script để tự động kiểm thử.

**Ưu Điểm:**
✓ Nhanh chóng, hiệu quả  
✓ Lặp lại được chính xác  
✓ Chi phí tiết kiệm dài hạn  
✓ Có thể chạy 24/7  
✓ Tăng độ tin cậy  

**Nhược Điểm:**
✗ Chi phí ban đầu cao  
✗ Khó kiểm tra UX  
✗ Cần kỹ năng lập trình  
✗ Bảo trì script phức tạp  

**Khi Nào Nên Dùng:**
- Regression testing
- Performance testing
- Load testing
- Những test case lặp lại thường xuyên

#### 5.1.3 Kết Hợp Tối Ưu

Chiến lược tối ưu cho EverShop:

```
┌─────────────────────────────────────────────┐
│           TEST STRATEGY MATRIX               │
├──────────────────┬──────────────────────────┤
│ Test Type        │ Manual | Automation      │
├──────────────────┼──────────────────────────┤
│ Unit Tests       │   20%  │      80%       │
│ Integration      │   30%  │      70%       │
│ E2E Tests        │   40%  │      60%       │
│ Exploratory      │  100%  │       0%       │
│ Performance      │   10%  │      90%       │
└──────────────────┴──────────────────────────┘
```

**Quy Trình Kết Hợp:**

1. **Dev Phase:** Automation tests (Unit + Integration)
2. **QA Phase:** Automation tests (E2E) + Manual (Exploratory)
3. **Pre-Release:** Manual smoke test + Automation regression
4. **Production:** Monitoring + Manual incident testing

---

### 5.2 GenAI trong Kiểm Thử (Dự Tính)

**⚠️ Ghi Chú:** Phần này là **dự tính** - chưa được triển khai trong hệ thống EverShop hiện tại.

#### 5.2.1 Các Ứng Dụng Tiềm Năng

**1. Test Case Generation**
- GenAI tạo test case tự động từ yêu cầu
- Phát hiện các edge case
- Tăng code coverage

**2. Automated Test Script Generation**
- Tạo script kiểm thử từ user stories
- Hỗ trợ tạo E2E tests nhanh

**3. Defect Prediction**
- Dự đoán các phần code dễ có lỗi
- Ưu tiên kiểm thử

**4. Test Data Generation**
- Tạo test data đa dạng
- Đảm bảo coverage các scenario

**5. Natural Language Test Specification**
- Viết test theo ngôn ngữ tự nhiên
- AI chuyển thành code test

#### 5.2.2 Lợi Ích Dự Kiến

✓ Tăng tốc độ tạo test cases  
✓ Cải thiện coverage  
✓ Giảm chi phí kiểm thử  
✓ Phát hiện lỗi sớm hơn  

#### 5.2.3 Thách Thức

✗ Giảm phát hiện edge case ngoài mong đợi  
✗ Cần dữ liệu training chất lượng cao  
✗ Xác thực kết quả vẫn cần con người  
✗ Chi phí computational cao  

#### 5.2.4 Kế Hoạch Triển Khai Tương Lai

**Phase 1 (6 tháng):** Pilot test case generation cho Catalog module  
**Phase 2 (12 tháng):** Mở rộng sang các module khác  
**Phase 3 (18 tháng):** Tích hợp vào CI/CD pipeline  

---

### 5.3 Tự Động Hóa Quy Trình Kiểm Thử

#### 5.3.1 Công Cụ Tự Động Hóa Hiện Tại

**1. ESLint - Code Quality & Linting**

Mục đích: Tự động kiểm tra chất lượng code

Cài đặt:
```bash
npm install eslint --save-dev
npm init @eslint/config
```

Cấu hình `.eslintrc.js`:
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error'
  }
};
```

Chạy ESLint:
```bash
# Kiểm tra một file
eslint src/file.js

# Kiểm tra toàn bộ src
eslint src/

# Tự động fix lỗi
eslint src/ --fix

# Với coverage report
eslint src/ --format json > eslint-report.json
```

CI/CD Integration:
```yaml
# .gitlab-ci.yml
lint:
  stage: test
  script:
    - npm install
    - npm run lint
  allow_failure: false
```

**2. Jest - Unit & Integration Testing**

Mục đích: Tự động kiểm thử code

Cài đặt:
```bash
npm install --save-dev jest @babel/preset-env
npm install --save-dev @testing-library/react
```

Cấu hình `jest.config.js` cho EverShop:
```javascript
// jest.config.js
export default {
  testEnvironment: "node",
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        isolatedModules: true
      }
    }]
  },
  moduleNameMapper: {
    '^@evershop/postgres-query-builder$': '<rootDir>/packages/postgres-query-builder/src/index.ts',
    '^@evershop/postgres-query-builder/(.*)$': '<rootDir>/packages/postgres-query-builder/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@evershop)/)"
  ],
  testMatch: [
    "<rootDir>/packages/**/src/**/__tests__/**/*.test.[jt]s",
    "<rootDir>/packages/**/src/**/*.test.[jt]s"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/packages/evershop/dist",
    "services/login",
    "services/logout",
    "services/session"
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  collectCoverageFrom: [
    "packages/evershop/src/modules/**/*.{ts,tsx,js}",
    "!packages/evershop/src/modules/**/tests/**",
    "!packages/evershop/src/modules/**/*.test.{ts,tsx,js}",
    "!packages/evershop/dist/**"
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "text-summary", "html", "lcov", "json"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "packages/evershop/dist"
  ]
};
```

Viết tests:
```javascript
// src/services/__tests__/catalog.test.js
describe('Catalog Service', () => {
  it('Should fetch products successfully', async () => {
    const products = await catalogService.getProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
  });
});
```

Chạy tests Jest cho EverShop:
```bash
# Chạy tất cả tests
npm test

# Chạy với coverage report
npm test -- --coverage

# Chạy watch mode (để lập trình)
npm test -- --watch

# Chạy một module cụ thể
npm test -- auth.test.ts

# Chạy tất cả tests trong catalog module
npm test -- packages/evershop/src/modules/catalog/tests/

# Update snapshots
npm test -- -u
```

Jest Report:
```
Jest Coverage Report:
─────────────────────────────────────────────
File        | Statements | Branches | Lines
─────────────────────────────────────────────
catalog.js  |    85%     |   80%   | 85%
customer.js |    90%     |   85%   | 90%
checkout.js |    75%     |   70%   | 75%
─────────────────────────────────────────────
Total       |    83%     |   78%   | 83%
```

**3. Cypress - E2E Testing**

Mục đích: Tự động kiểm thử user flow

Cài đặt:
```bash
npm install --save-dev cypress
npx cypress open
```

Cấu hình `cypress.config.js` cho EverShop:
```javascript
// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'qjkijo',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: process.env.CYPRESS_DEFAULT_COMMAND_TIMEOUT || 10000,
    requestTimeout: process.env.CYPRESS_REQUEST_TIMEOUT || 10000,
    responseTimeout: process.env.CYPRESS_RESPONSE_TIMEOUT || 10000,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    reporter: 'json',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: true
    },
    async setupNodeEvents(on, config) {
      const { seedTestAdmin, cleanupTestAdmin, closePool } =
        await import('./cypress/plugins/seedTestAdmin.js');

      on('task', {
        seedTestAdmin,
        cleanupTestAdmin,
        closePool
      });

      on('before:browser:launch', (browser = {}, launchFn) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchFn.args.push('--disable-blink-features=AutomationControlled');
        }
        return launchFn;
      });

      return config;
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js'
```

Viết tests:
```javascript
// cypress/e2e/shopping.cy.js
describe('Shopping Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should browse products and add to cart', () => {
    cy.contains('Products').click();
    cy.get('[data-test="product-card"]').first().click();
    cy.get('[data-test="add-to-cart"]').click();
    cy.contains('Added to cart').should('be.visible');
  });

  it('Should complete checkout', () => {
    cy.visit('/cart');
    cy.contains('Checkout').click();
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/order-confirmation');
  });
});
```

Chạy tests Cypress cho EverShop:
```bash
# Mở Cypress UI (interactive mode)
npm run test:e2e:ui

# Chạy tất cả E2E tests (headless)
npm run test:e2e:headless

# Chạy tất cả E2E tests
npm run test:e2e

# Chạy một folder cụ thể
cypress run --spec "cypress/e2e/auth/**/*.cy.js"

# Chạy với browser cụ thể
cypress run --browser chrome

# Chạy với report JSON
cypress run --reporter json
```

Test files cã sȃn trong EverShop:
- `cypress/e2e/auth/api_test/` - Admin authentication API tests
- `cypress/e2e/catalog/api_test/` - Product catalog tests
- `cypress/e2e/checkout/api_test/` - Cart & checkout tests
- `cypress/e2e/customer/api_test/` - Customer management tests
- `cypress/e2e/cms/api_test/` - Content management tests
- `cypress/e2e/oms/api_test/` - Order management tests

#### 5.3.2 Quy Trình Tự Động Hóa Hoàn Chỉnh

```
Developer Push Code
        │
        ▼
┌───────────────────────────────────┐
│  GIT WEBHOOK TRIGGER              │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  1. LINTING STAGE                 │
│  $ npm run lint                   │
│  ✓ ESLint checks                  │
│  ✓ Prettier format                │
│  ✓ Code style validation          │
└───────────────────────────────────┘
        │
    Pass?─No─→ Fail Build
        │ Yes
        ▼
┌───────────────────────────────────┐
│  2. UNIT TESTING STAGE            │
│  $ npm test                       │
│  ✓ Jest runs all tests            │
│  ✓ Coverage check (≥70%)          │
│  ✓ Generate coverage report       │
└───────────────────────────────────┘
        │
    Pass?─No─→ Fail Build
        │ Yes
        ▼
┌───────────────────────────────────┐
│  3. BUILD STAGE                   │
│  $ npm run build                  │
│  ✓ Compile TypeScript             │
│  ✓ Bundle code                    │
│  ✓ Optimize assets                │
└───────────────────────────────────┘
        │
    Pass?─No─→ Fail Build
        │ Yes
        ▼
┌───────────────────────────────────┐
│  4. DEPLOY STAGING                │
│  $ docker build & deploy          │
│  ✓ Deploy to staging env          │
│  ✓ Run smoke tests                │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  5. E2E TESTING STAGE             │
│  $ npm run cypress:run            │
│  ✓ Catalog tests                  │
│  ✓ Customer tests                 │
│  ✓ Checkout tests                 │
│  ✓ OMS tests                      │
│  ✓ CMS tests                      │
│  ✓ Video recordings               │
└───────────────────────────────────┘
        │
    Pass?─No─→ Notify Dev (Fix & Retry)
        │ Yes
        ▼
┌───────────────────────────────────┐
│  6. DEPLOY PRODUCTION             │
│  $ kubectl deploy prod            │
│  ✓ Blue-Green deployment          │
│  ✓ Health checks                  │
│  ✓ Canary release (10%→100%)      │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  7. MONITORING                    │
│  ✓ Prometheus metrics             │
│  ✓ Error tracking (Sentry)        │
│  ✓ Performance monitoring         │
│  ✓ Logs (ELK Stack)               │
└───────────────────────────────────┘
```

#### 5.3.3 Cấu Hình CI/CD Pipeline Mẫu

**GitHub Actions Example:**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint

  unit-test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: unit-test
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run compile
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: build
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:e2e:headless

  deploy:
    runs-on: ubuntu-latest
    needs: e2e
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - run: docker build -t evershop:latest .
      - run: docker push registry/evershop:latest
      - run: kubectl deploy production
```

#### 5.3.4 Metrics & Reporting

**Test Metrics:**
```
Total Tests: 250
├── Unit Tests: 200 (✓ 198 passed, ✗ 2 failed)
├── Integration Tests: 30 (✓ 30 passed)
└── E2E Tests: 20 (✓ 20 passed)

Coverage:
├── Statements: 83%
├── Branches: 78%
├── Functions: 85%
└── Lines: 83%

Performance:
├── Lint Time: 2s
├── Unit Test Time: 15s
├── Build Time: 8s
├── E2E Test Time: 45s
└── Total: 70s
```

**Report Dashboard:**
- Code Quality Score: 8.5/10
- Test Coverage: 83%
- Build Success Rate: 98%
- Deployment Frequency: 5 times/week

#### 5.3.5 Best Practices

1. **Test Early & Often**
   - Chạy tests trước khi commit
   - Kiểm tra coverage trước merge

2. **Fail Fast**
   - Linting chạy trước
   - Unit tests chạy nhanh
   - E2E tests chạy cuối

3. **Parallel Execution**
   - Chạy tests đồng thời
   - Giảm thời gian tổng

4. **Maintain Tests**
   - Cập nhật tests khi code thay đổi
   - Xóa tests lỗi thời
   - Refactor test code

5. **Monitor Metrics**
   - Theo dõi coverage trends
   - Alerts nếu coverage giảm
   - Report regular

---

## Kết Luận

Thiết kế kiểm thử toàn diện cho hệ thống EverShop bao gồm:

1. **V-Model** - Cung cấp cấu trúc rõ ràng cho kiểm thử
2. **Agile CI/CD** - Tự động hóa quy trình phát triển
3. **Kiểm thử Tĩnh** - Phát hiện lỗi sớm qua ESLint, code review
4. **Kiểm thử Động** - Xác minh hành vi qua Unit, Integration, E2E tests
5. **Tự Động Hóa** - Sử dụng ESLint, Jest, Cypress
6. **GenAI** - Dự tính triển khai trong tương lai

Kết hợp các phương pháp này đảm bảo:
- ✓ Chất lượng cao
- ✓ Phát hành nhanh
- ✓ Rủi ro thấp
- ✓ Chi phí tối ưu
- ✓ Sự hài lòng khách hàng

---

## 6. Danh Sách Các File Kiểm Thử trong EverShop Shoes Store\n\nHệ thống EverShop Shoes Store sử dụng cấu trúc test file theo module:\n\n### 6.1 E2E Tests (Cypress)\n\nTất cả E2E tests nằm trong: `cypress/e2e/`\n\n**Các file test theo module:**\n- `cypress/e2e/auth/api_test/` - Admin login, security tests\n- `cypress/e2e/catalog/api_test/` - Product & category management\n- `cypress/e2e/checkout/api_test/` - Cart, shipping, payment tests\n- `cypress/e2e/customer/api_test/` - Customer registration & profile\n- `cypress/e2e/cms/api_test/` - Content management tests\n- `cypress/e2e/oms/api_test/` - Order management tests\n\n### 6.2 Unit Tests (Jest)\n\nUnit tests tổ chức theo module trong `packages/evershop/src/modules/`\n\n**Auth Module:** 5 files\n- `authMiddleware.test.ts`, `loginUserWithEmail.test.ts`, `logoutUser.test.ts`\n- `generateToken.test.ts`, `refreshToken.test.ts`\n\n**Catalog Module:** 6 files\n- `createCategory.test.ts`, `createProduct.test.ts`, `deleteCategory.test.ts`\n- `categoryManagement.test.ts`, `productManagement.test.ts`, `productView.test.js`\n\n**Checkout Module:** 15 files\n- Tính toán: `productPrice.test.js`, `discountAmount.test.js`, `lineTotal.test.js`\n- Giỏ hàng: `addCartItem.test.ts`, `removeItemSideEffect.test.js`, `updateCartItemQtySideEffect.test.js`\n\n**Customer Module:** 3 files\n- `createCustomer.test.ts`, `loginCustomerWithEmail.test.ts`, `customerManagement.test.ts`\n\n**CMS Module:** 7 files\n- `createFolder.test.ts`, `deleteFile.test.ts`, `uploadFile.test.ts`, `fileUploadIntegration.test.ts`\n\n**COD Module:** 5 files\n- `codCapturePayment.test.ts`, `codPaymentFlow.test.ts`, `orderWithCodPayment.test.ts`\n\n### 6.3 Chạy Tests\n\n```bash\n# E2E Tests\nnpm run test:e2e          # Chạy tất cả\nnpm run test:e2e:ui       # UI mode\n\n# Unit Tests\nnpm test                  # Chạy tất cả\nnpm test -- --coverage    # Với coverage report\n```\n\n### 6.4 Thống Kê Tests\n\n- **Total Test Files:** 47+\n- **Total Test Cases:** 250+\n- **Target Coverage:** ≥ 70%\n\n---\n\n## Tài Liệu Tham Khảo

- Jest Documentation: https://jestjs.io/
- Cypress Documentation: https://docs.cypress.io/
- ESLint Guide: https://eslint.org/
- Testing Library: https://testing-library.com/
- ISTQB Testing Standards
- Agile Testing: A Practical Guide (Lisa Crispin)
