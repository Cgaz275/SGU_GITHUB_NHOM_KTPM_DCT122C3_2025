# Tài Liệu Kiểm Thử Module Checkout (Thanh Toán)

## Mục Đích

Tài liệu này mô tả chi tiết về cấu trúc, kịch bản kiểm thử và các trường hợp sử dụng cho module Checkout trong hệ thống Evershop. Module này quản lý giỏ hàng, thanh toán, đơn hàng và phương thức vận chuyển.

---

## Cấu Trúc Thư Mục

```
src/modules/checkout/
├── tests/
│   ├── test.md                                   # Tài liệu kiểm thử (file này)
│   ├── unit/
│   │   ├── addCartItem.test.ts                   # Test thêm item vào giỏ
│   │   ├── createNewCart.test.ts                 # Test tạo giỏ mới
│   │   ├── getMyCart.test.ts                     # Test lấy giỏ
│   │   └── orderValidator.test.ts                # Test validate đơn hàng
│   └── integration/
│       ├── cartManagement.test.ts                # Test quản lý giỏ hàng
│       └── checkoutFlow.test.ts                  # Test quy trình thanh toán
├── services/
│   ├── addCartItem.ts                            # Thêm item giỏ
│   ├── removeCartItem.ts                         # Xóa item giỏ
│   ├── createNewCart.ts                          # Tạo giỏ mới
│   ├── getMyCart.ts                              # Lấy giỏ của tôi
│   ├── saveCart.ts                               # Lưu giỏ
│   ├── updateCartItemQty.ts                      # Cập nhật qty
│   ├── checkout.ts                               # Thanh toán
│   ├── orderValidator.ts                         # Validate đơn hàng
│   └── ...
└── api/                                          # API endpoints
```

---

## Chi Tiết Các Test Suite

### Unit Tests (4 suites)

- **addCartItem.test.ts** - Test thêm sản phẩm vào giỏ hàng
- **createNewCart.test.ts** - Test tạo giỏ hàng mới
- **getMyCart.test.ts** - Test lấy giỏ hàng của khách hàng
- **orderValidator.test.ts** - Test validate đơn hàng

### Integration Tests (2 suites)

- **cartManagement.test.ts** - Test CRUD giỏ hàng
- **checkoutFlow.test.ts** - Test quy trình thanh toán hoàn chỉnh

---

## Cách Chạy Kiểm Thử

```bash
npm test -- src/modules/checkout/tests
npm test -- src/modules/checkout/tests/unit
npm test -- src/modules/checkout/tests/integration
```

---

## Compilation và Execution

```bash
npm run deploy && npm run test -- ./packages/evershop/dist/modules/checkout/tests --coverage
```
