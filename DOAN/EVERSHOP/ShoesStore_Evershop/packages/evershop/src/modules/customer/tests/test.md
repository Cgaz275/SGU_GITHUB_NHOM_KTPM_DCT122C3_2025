# Tài Liệu Kiểm Thử Module Customer (Khách Hàng)

## Mục Đích

Tài liệu này mô tả chi tiết về cấu trúc, kịch bản kiểm thử và các trường hợp sử dụng cho module Customer trong hệ thống Evershop. Module này quản lý khách hàng, xác thực, địa chỉ, và thông tin cá nhân.

---

## Cấu Trúc Thư Mục

```
src/modules/customer/
├── tests/
│   ├── test.md                                   # Tài liệu kiểm thử (file này)
│   ├── unit/
│   │   ├── loginCustomerWithEmail.test.ts        # Test đăng nhập khách hàng
│   │   ├── createCustomer.test.ts                # Test tạo khách hàng
│   │   └── updatePassword.test.ts                # Test cập nhật mật khẩu
│   └── integration/
│       ├── customerAuthentication.test.ts        # Test xác thực khách hàng
│       └── customerManagement.test.ts            # Test quản lý khách hàng
├── services/
│   ├── getCustomersBaseQuery.ts                  # Query khách hàng
│   └── customer/
│       ├── loginCustomerWithEmail.ts             # Dịch vụ đăng nhập
│       ├── createCustomer.ts                     # Dịch vụ tạo khách hàng
│       ├── updateCustomer.ts                     # Dịch vụ cập nhật
│       ├── deleteCustomer.ts                     # Dịch vụ xóa khách hàng
│       ├── updatePassword.ts                     # Dịch vụ cập nhật mật khẩu
│       └── address/
│           ├── createCustomerAddress.ts          # Tạo địa chỉ
│           ├── updateCustomerAddress.ts          # Cập nhật địa chỉ
│           └── deleteCustomerAddress.ts          # Xóa địa chỉ
└── api/                                          # API endpoints
```

---

## Chi Tiết Các Test Suite

### Unit Tests (6 suites)

- **loginCustomerWithEmail.test.ts** - Test đăng nhập, xác thực email/mật khẩu
- **createCustomer.test.ts** - Test tạo khách hàng, validation, password hashing
- **updatePassword.test.ts** - Test cập nhật mật khẩu, verification

### Integration Tests (2 suites)

- **customerAuthentication.test.ts** - Test flow đăng nhập, session quản lý
- **customerManagement.test.ts** - Test CRUD khách hàng, địa chỉ

---

## Cách Chạy Kiểm Thử

```bash
npm test -- src/modules/customer/tests
npm test -- src/modules/customer/tests/unit
npm test -- src/modules/customer/tests/integration
```

---

## Compilation và Execution

```bash
npm run deploy && npm run test -- ./packages/evershop/dist/modules/customer/tests --coverage
```
