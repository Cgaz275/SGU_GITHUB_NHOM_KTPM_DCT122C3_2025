# Tài Liệu Kiểm Thử Module COD (Cash on Delivery)

## Mục Đích

Tài liệu này mô tả chi tiết về cấu trúc, kịch bản kiểm thử và các trường hợp sử dụng cho module COD (Thanh toán khi nhận hàng) trong hệ thống Evershop. Module này quản lý phương thức thanh toán COD, xác thực trạng thái, và phát sự kiện đơn hàng.

---

## Cấu Trúc Thư Mục

```
src/modules/cod/
├── tests/
│   ├── test.md                                   # Tài liệu kiểm thử (file này)
│   ├── unit/
│   │   ├── codPaymentValidator.test.ts           # Test validator COD
│   │   ├── codPaymentInitializer.test.ts         # Test initializer COD
│   │   └── codCapturePayment.test.ts             # Test capture payment
│   └── integration/
│       ├── codPaymentFlow.test.ts                # Test quy trình COD
│       └── orderWithCodPayment.test.ts           # Test đơn hàng COD
├── api/
│   └── codCapturePayment/                        # API capture payment
├── bootstrap.ts                                  # Bootstrap file (tệp chính)
└── graphql/                                      # GraphQL resolvers
```

---

## Phân Loại Kiểm Thử

### 1. Unit Test (Kiểm Thử Đơn Vị)

Kiểm thử các hàm riêng lẻ, dịch vụ và logic nghiệp vụ của phương thức COD.

#### Test Files:
- `unit/codPaymentValidator.test.ts` - Test validator
- `unit/codPaymentInitializer.test.ts` - Test initializer
- `unit/codCapturePayment.test.ts` - Test capture payment

### 2. Integration Test (Kiểm Thử Tích Hợp)

Kiểm thử sự tương tác giữa COD payment method và hệ thống checkout.

#### Test Files:
- `integration/codPaymentFlow.test.ts` - Test quy trình COD
- `integration/orderWithCodPayment.test.ts` - Test tạo đơn hàng COD

---

## Chi Tiết Các Test Suite

### Test Suite 1: codPaymentValidator.test.ts

**Mục đích:** Kiểm thử hàm validator COD, kiểm tra xem phương thức COD có được bật hay không.

**Số lượng test case:** 8

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| COD enabled from config | COD bật trong config | Validator trả về true |
| COD disabled from config | COD tắt trong config | Validator trả về false |
| COD from settings | COD bật từ settings | getSetting('codPaymentStatus') = 1 → true |
| COD disabled from settings | COD tắt từ settings | getSetting('codPaymentStatus') = 0 → false |
| Config takes priority | Config có ưu tiên | Config status được kiểm tra trước |
| Invalid status value | Status không phải 0/1 | Treat as false hoặc throw error |
| Missing config | Không có config | Fallback sang settings |
| Async validator behavior | Async function | Trả về Promise |

**Mock Dependencies:**
- `../../lib/util/getConfig`: Get config values
- `../../modules/setting/services/setting.getSetting`: Get setting values

**Ví dụ chạy test:**
```bash
npm test -- unit/codPaymentValidator.test.ts
```

---

### Test Suite 2: codPaymentInitializer.test.ts

**Mục đích:** Kiểm thử hàm initializer COD, kiểm tra đăng ký phương thức thanh toán.

**Số lượng test case:** 6

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Payment method initialization | Khởi tạo phương thức | Trả về object có `code: 'cod'` |
| Display name from setting | Lấy tên hiển thị | `name` từ setting `codDisplayName` |
| Default display name | Tên mặc định | Nếu không có setting, dùng "Cash on Delivery" |
| Code must be 'cod' | Mã phương thức | `code` phải là 'cod' |
| Return object structure | Cấu trúc trả về | Object có `code` và `name` |
| Async initialization | Async function | Trả về Promise |

**Mock Dependencies:**
- `../../modules/setting/services/setting.getSetting`: Get setting
- `../../lib/util/getConfig`: Get config

**Ví dụ chạy test:**
```bash
npm test -- unit/codPaymentInitializer.test.ts
```

---

### Test Suite 3: codCapturePayment.test.ts

**Mục đích:** Kiểm thử API capture payment COD.

**Số lượng test case:** 7

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Capture payment request | Request capture payment | HTTP 200 với status success |
| Missing order ID | Không có order ID | HTTP 400, message: "Order ID required" |
| Invalid order ID | Order không tồn tại | HTTP 404, message: "Order not found" |
| Payment already captured | Đã capture | HTTP 400, message: "Payment already captured" |
| Request body validation | Validate body | Yêu cầu order_id, amount |
| Response structure | Response format | Response có `success`, `data` |
| Authorization check | Auth middleware | Request phải authenticated |

**Mock Dependencies:**
- `@evershop/postgres-query-builder`: select, update
- `../../../lib/postgres/connection`: getConnection
- `../../../lib/util/registry`: Get registry values

**Ví dụ chạy test:**
```bash
npm test -- unit/codCapturePayment.test.ts
```

---

### Test Suite 4: codPaymentFlow.test.ts (Integration)

**Mục đích:** Kiểm thử quy trình COD từ đăng ký đến capture payment.

**Số lượng test case:** 9

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Complete COD flow | Toàn bộ quy trình | Init → Register → Validate → Success |
| Payment method registered | Đăng ký phương thức | Phương thức xuất hiện trong available methods |
| Payment method validation | Validate COD | Nếu bật → có thể dùng |
| Checkout with COD | Chọn COD tại checkout | Phương thức được chọn |
| Order creation with COD | Tạo đơn với COD | Order được lưu với payment_method = 'cod' |
| Order placed event | Event phát ra | Khi order = 'cod' → emit 'order_placed' |
| Payment capture after order | Capture payment | Sau khi tạo order → capture |
| Payment status update | Cập nhật status | Payment status được cập nhật |
| Error handling in flow | Xử lý lỗi | Proper error messages |

**Mock Dependencies:**
- Bootstrap initialization
- Checkout service integration
- Setting and config services

---

### Test Suite 5: orderWithCodPayment.test.ts (Integration)

**Mục đích:** Kiểm thử quy trình tạo đơn hàng với thanh toán COD.

**Số lượng test case:** 10

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Create order with COD | Tạo đơn hàng | Order được tạo thành công |
| Order status initial | Trạng thái ban đầu | Status = "pending" hoặc "processing" |
| Payment method storage | Lưu phương thức | `payment_method` = 'cod' |
| Capture payment | Capture COD | Payment được capture |
| Order placed event emitted | Phát sự kiện | 'order_placed' event được emit |
| Customer notification | Thông báo | Email sent to customer |
| Order items saved | Lưu items | Tất cả items được lưu |
| Inventory update | Cập nhật kho | Stock được giảm |
| Shipping address | Địa chỉ giao hàng | Được lưu đúng |
| Payment info tracking | Theo dõi thanh toán | Payment status được tracking |

**Mock Dependencies:**
- Order creator service
- Email service
- Inventory service
- Event emitter
- Database connections

---

## Kịch Bản Kiểm Thử Chính

### Kịch Bản 1: Bootstrap COD Module

```
1. System gọi bootstrap()
2. Hệ thống đăng ký payment method
   ├─ init callback → return {code: 'cod', name: 'Cash on Delivery'}
   ├─ validator callback → check if COD enabled
   └─ Phương thức được thêm vào available payment methods
3. Đăng ký hook for order.created event
```

**Test Coverage:**
- codPaymentInitializer.test.ts: Init callback
- codPaymentValidator.test.ts: Validator callback
- codPaymentFlow.test.ts: Complete registration

---

### Kịch Bản 2: Thanh Toán COD Tại Checkout

```
1. Customer chọn COD tại checkout
2. API validate phương thức
   ├─ validator được gọi
   ├─ Kiểm tra COD status
   └─ Nếu true → COD có sẵn
3. Order được tạo với payment_method = 'cod'
4. Order placed event được emit
5. Capture payment được gọi
```

**Test Coverage:**
- codPaymentValidator.test.ts: Validation logic
- codPaymentFlow.test.ts: Complete flow
- orderWithCodPayment.test.ts: Order creation

---

### Kịch Bán 3: Order Placed Event

```
1. Order được tạo với payment_method = 'cod'
2. Hook after 'createOrderFunc' được trigger
3. Kiểm tra payment_method == 'cod'
4. Nếu đúng → emit 'order_placed' event
5. Event listeners xử lý event (email, notification, etc)
```

**Test Coverage:**
- codPaymentFlow.test.ts: Hook execution
- orderWithCodPayment.test.ts: Event emission

---

## Cách Chạy Kiểm Thử

### Chạy Tất Cả Tests

```bash
npm test
```

### Chạy Riêng Module COD

```bash
npm test -- src/modules/cod/tests
```

### Chạy Unit Tests Riêng

```bash
npm test -- unit
```

### Chạy Integration Tests Riêng

```bash
npm test -- integration
```

### Chạy Test Cụ Thể

```bash
npm test -- codPaymentValidator.test.ts
npm test -- orderWithCodPayment.test.ts
npm test -- codPaymentFlow.test.ts
```

### Chạy Với Coverage Report

```bash
npm test -- --coverage
```

### Chạy Trong Watch Mode

```bash
npm test -- --watch
```

---

## Compilation và Execution

### Step 1: Compile TypeScript
```bash
npm run deploy
```

### Step 2: Run Jest Tests
```bash
npm test -- ./packages/evershop/dist/modules/cod/tests
```

### Full Pipeline
```bash
npm run deploy && npm test -- ./packages/evershop/dist/modules/cod/tests
```

### With coverage
```bash
npm run test -- ./packages/evershop/dist/modules/cod/tests --coverage
```
