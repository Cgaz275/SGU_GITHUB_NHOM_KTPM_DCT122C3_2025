# Tài Liệu Kiểm Thử Module Catalog (Danh Mục Sản Phẩm)

## Mục Đích

Tài liệu này mô tả chi tiết về cấu trúc, kịch bản kiểm thử và các trường hợp sử dụng cho module Catalog trong hệ thống Evershop. Module này quản lý sản phẩm, danh mục, thuộc tính sản phẩm và bộ sưu tập.

---

## Cấu Trúc Thư Mục

```
src/modules/catalog/
├── tests/
│   ├── test.md                                   # Tài liệu kiểm thử (file này)
│   ├── unit/
│   │   ├── createCategory.test.ts                # Test tạo danh mục
│   │   ├── deleteCategory.test.ts                # Test xóa danh mục
│   │   ├── createProductAttribute.test.ts        # Test tạo thuộc tính sản phẩm
│   │   └── createProduct.test.ts                 # Test tạo sản phẩm
│   └── integration/
│       ├── categoryManagement.test.ts            # Test quản lý danh mục
│       ├── productManagement.test.ts             # Test quản lý sản phẩm
│       └── attributeManagement.test.ts           # Test quản lý thuộc tính
├── services/
│   ├── category/
│   │   ├── createCategory.ts                     # Dịch vụ tạo danh mục
│   │   ├── updateCategory.ts                     # Dịch vụ cập nhật danh mục
│   │   └── deleteCategory.ts                     # Dịch vụ xóa danh mục
│   ├── product/
│   │   ├── createProduct.ts                      # Dịch vụ tạo sản phẩm
│   │   ├── updateProduct.ts                      # Dịch vụ cập nhật sản phẩm
│   │   └── deleteProduct.ts                      # Dịch vụ xóa sản phẩm
│   ├── attribute/
│   │   ├── createProductAttribute.ts             # Dịch vụ tạo thuộc tính
│   │   ├── updateProductAttribute.ts             # Dịch vụ cập nhật thuộc tính
│   │   └── deleteProductAttribute.ts             # Dịch vụ xóa thuộc tính
│   └── collection/
│       ├── createCollection.ts                   # Dịch vụ tạo bộ sưu tập
│       ├── updateCollection.ts                   # Dịch vụ cập nhật bộ sưu tập
│       └── deleteCollection.ts                   # Dịch vụ xóa bộ sưu tập
└── api/                                          # API endpoints
```

---

## Chi Tiết Các Test Suite

### Test Suite 1: createCategory.test.ts

**Mục đích:** Kiểm thử dịch vụ tạo danh mục, bao gồm validation, transaction, và error handling.

**Số lượng test case:** 12

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Create valid category | Tạo danh mục hợp lệ | Danh mục được tạo với id, uuid, name |
| Validate required fields | Kiểm tra fields bắt buộc | Throw lỗi nếu thiếu `name` hoặc `url_key` |
| Parent category relationship | Tạo danh mục con | `parent_id` được set đúng |
| Category with description | Tạo danh mục với description | Description được lưu vào bảng category_description |
| Transaction rollback on error | Lỗi trong tạo danh mục | Transaction được rollback, dữ liệu không lưu |
| Unique URL key | Kiểm tra URL key unique | Duplicate URL keys throw error |
| Invalid parent category | Parent category không tồn tại | Throw Error: "Parent category not found" |
| Category data validation | Kiểm tra schema | Validate dữ liệu theo categoryDataSchema |
| Return created category | Kiểm tra giá trị trả về | Return object có `category_id`, `uuid`, `name` |
| Handle context properly | Context parameter | Throw error nếu context không phải object |
| Multiple category creation | Tạo nhiều danh mục | Mỗi danh mục được lưu riêng biệt |
| Category with metadata | Metadata thêm | Custom fields được lưu nếu valid |

**Mock Dependencies:**
- `@evershop/postgres-query-builder`: select, insert
- `../../../lib/postgres/connection`: getConnection, startTransaction, commit, rollback
- `../../base/services/getAjv`: Schema validation

---

### Test Suite 2: deleteCategory.test.ts

**Mục đích:** Kiểm thử dịch vụ xóa danh mục.

**Số lượng test case:** 10

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Delete existing category | Xóa danh mục tồn tại | Danh mục được xóa thành công |
| Category not found | Category UUID không tồn tại | Throw Error: "Invalid category id" |
| Delete with transaction | Xóa trong transaction | Sử dụng startTransaction/commit |
| Delete category relationship | Xóa kèm description | Xóa cả category_description |
| Return deleted category | Kiểm tra giá trị trả về | Return danh mục đã xóa |
| Transaction rollback on error | Lỗi trong xóa | Transaction được rollback |
| Handle context parameter | Context validation | Throw error nếu context không phải object |
| Delete with UUID | UUID required | Yêu cầu UUID chính xác |
| Cascade delete | Xóa dữ liệu liên quan | Xóa tất cả related data |
| Multiple category deletion | Xóa nhiều danh mục | Mỗi lần xóa độc lập |

**Mock Dependencies:**
- PostgreSQL query builder functions
- Connection and transaction utilities

---

### Test Suite 3: createProductAttribute.test.ts

**Mục đích:** Kiểm thử dịch vụ tạo thuộc tính sản phẩm.

**Số lượng test case:** 8

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Create attribute | Tạo thuộc tính | Thuộc tính được tạo với id, code |
| Attribute code validation | Kiểm tra code hợp lệ | Code không chứa khoảng trắng |
| Required attribute fields | Fields bắt buộc | `code` và `label` là bắt buộc |
| Attribute type | Loại thuộc tính | `type` có giá trị hợp lệ (select, text, etc) |
| Attribute options | Tùy chọn cho attribute | Options được lưu nếu type=select |
| Transaction handling | Sử dụng transaction | Rollback nếu có lỗi |
| Return created attribute | Giá trị trả về | Return attribute object đầy đủ |
| Context parameter | Context handling | Throw error nếu context không phải object |

---

### Test Suite 4: createProduct.test.ts

**Mục đích:** Kiểm thử dịch vụ tạo sản phẩm.

**Số lượng test case:** 14

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Create valid product | Tạo sản phẩm hợp lệ | Sản phẩm được tạo với id, uuid, sku |
| Required product fields | Fields bắt buộc | `name`, `sku`, `price` là bắt buộc |
| Unique SKU | SKU phải unique | Throw error nếu SKU trùng |
| Product description | Tạo kèm description | Description được lưu đúng |
| Product categories | Gán danh mục | Product được liên kết với categories |
| Product attributes | Gán thuộc tính | Product attributes được lưu |
| Product pricing | Kiểm tra giá | `price`, `cost` được lưu đúng |
| Product status | Status hợp lệ | Status: active, inactive, draft |
| Stock management | Inventory | Quantity, weight được lưu |
| Transaction handling | Transaction | Rollback nếu có lỗi |
| Return created product | Giá trị trả về | Return product object đầy đủ |
| Product images | Lưu hình ảnh | Images được liên kết với product |
| Product variants | Tạo biến thể | Variants được tạo nếu có |
| Context parameter | Context handling | Throw error nếu context không phải object |

---

## Integration Test Suite 5: categoryManagement.test.ts

**Mục đích:** Kiểm thử quy trình quản lý danh mục hoàn chỉnh.

**Số lượng test case:** 8

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Create category hierarchy | Tạo cấu trúc danh mục | Parent-child relationship hoạt động |
| Update category | Cập nhật danh mục | Changes được lưu đúng |
| Category search | Tìm kiếm | Tìm kiếm danh mục theo name/url |
| Delete with children | Xóa parent có child | Xử lý properly (delete/reparent) |
| Multiple categories | Quản lý nhiều | Mỗi danh mục độc lập |
| Category with products | Danh mục có sản phẩm | Relationship được duy trì |
| Performance test | Load lớn | Xử lý 100+ danh mục |
| Concurrent operations | Thao tác đồng thời | Không bị race condition |

---

## Integration Test Suite 6: productManagement.test.ts

**Mục đích:** Kiểm thử quy trình quản lý sản phẩm.

**Số lượng test case:** 10

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Complete product lifecycle | Tạo, cập nhật, xóa | Tất cả thao tác hoạt động |
| Product with variants | Sản phẩm có biến thể | Variants được quản lý |
| Product inventory | Quản lý stock | Stock updates được tracked |
| Product relationships | Liên kết sản phẩm | Categories, attributes, images |
| Bulk product operations | Tạo nhiều sản phẩm | Batch operations hoạt động |
| Product search | Tìm kiếm sản phẩm | Search theo name, sku, category |
| Product filtering | Lọc sản phẩm | Filter theo price, category, status |
| Transaction integrity | Data consistency | Tất cả data được lưu đúng |
| Error handling | Xử lý lỗi | Error message chính xác |
| Performance | Tốc độ | Tạo 1000+ products trong time hợp lý |

---

## Cách Chạy Kiểm Thử

```bash
npm test -- src/modules/catalog/tests
npm test -- src/modules/catalog/tests/unit
npm test -- src/modules/catalog/tests/integration
npm test -- src/modules/catalog/tests/unit/createCategory.test.ts
```

---

## Compilation và Execution

```bash
npm run deploy && npm run test -- ./packages/evershop/dist/modules/catalog/tests --coverage
```
