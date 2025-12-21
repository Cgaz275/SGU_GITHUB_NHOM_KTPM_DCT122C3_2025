# Tài Liệu Kiểm Thử Module CMS (Content Management System)

## Mục Đích

Tài liệu này mô tả chi tiết về cấu trúc, kịch bản kiểm thử và các trường hợp sử dụng cho module CMS trong hệ thống Evershop. Module này quản lý tệp, thư mục, hình ảnh và nội dung tĩnh của hệ thống.

---

## Cấu Trúc Thư Mục

```
src/modules/cms/
├── tests/
│   ├── test.md                           # Tài liệu kiểm thử (file này)
│   ├── unit/
│   │   ├── uploadFile.test.ts            # Test dịch vụ tải file
│   │   ├── deleteFile.test.ts            # Test dịch vụ xóa file
│   │   └── createFolder.test.ts          # Test dịch vụ tạo thư mục
│   └── integration/
│       ├── fileUploadIntegration.test.ts # Test tích hợp tải file
│       └── folderOperations.test.ts      # Test tích hợp thao tác thư mục
├── services/
│   ├── uploadFile.ts                     # Dịch vụ tải file
│   ├── deleteFile.ts                     # Dịch vụ xóa file
│   ├── createFolder.ts                   # Dịch vụ tạo thư mục
│   ├── browFiles.ts                      # Dịch vụ duyệt file
│   ├── imageProcessor.ts                 # Dịch vụ xử lý hình ảnh
│   └── pageMetaInfo.ts                   # Dịch vụ thông tin trang
└── api/                                  # API endpoints
```

---

## Phân Loại Kiểm Thử

### 1. Unit Test (Kiểm Thử Đơn Vị)

Kiểm thử các hàm riêng lẻ, dịch vụ và logic nghiệp vụ mà không phụ thuộc vào các thành phần khác.

#### Test Files:
- `unit/uploadFile.test.ts`
- `unit/deleteFile.test.ts`
- `unit/createFolder.test.ts`

### 2. Integration Test (Kiểm Thử Tích Hợp)

Kiểm thử sự tương tác giữa các dịch vụ file/folder và hệ thống tệp.

#### Test Files:
- `integration/fileUploadIntegration.test.ts`
- `integration/folderOperations.test.ts`

---

## Chi Tiết Các Test Suite

### Test Suite 1: uploadFile.test.ts

**Mục đích:** Kiểm thử dịch vụ tải file, bao gồm validation, error handling, và file metadata.

**Số lượng test case:** 12

#### Test Cases - File Validation (4 cases):

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Single file upload | Tải một file đơn lẻ | File được tải thành công với metadata |
| Multiple files upload | Tải nhiều files cùng lúc | Tất cả files được tải thành công |
| Empty files array | Tải mảng files rỗng | Trả về mảng rỗng |
| Valid MIME types | Kiểm tra MIME types hợp lệ | `image/jpeg`, `image/png`, `application/pdf` được chấp nhận |

#### Test Cases - File Metadata (3 cases):

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| File size tracking | Kiểm tra kích thước file | File object có thuộc tính `size` với giá trị đúng |
| File name preservation | Giữ nguyên tên file | `filename` trong kết quả khớp với file được tải |
| URL generation | Tạo URL cho file | URL được tạo theo định dạng `/static/path/filename` |

#### Test Cases - Path Handling (3 cases):

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Valid destination path | Tải vào đường dẫn hợp lệ | File được lưu vào đúng thư mục |
| Path with subdirectories | Đường dẫn chứa thư mục lồng nhau | Tạo tự động các thư mục trung gian |
| Path normalization | Chuẩn hóa đường dẫn | Loại bỏ `/` ở đầu, không có `\\` |

#### Test Cases - Error Handling (2 cases):

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Invalid destination path | Đường dẫn không hợp lệ | Throw Error, không tạo file |
| File write error | Lỗi khi ghi file | Catch error, rollback operation |

**Mock Dependencies:**
- `fs/promises.mkdir`: File system mkdir
- `fs/promises.writeFile`: File system write
- `buildUrl`: URL builder function

**Ví dụ chạy test:**
```bash
npm test -- unit/uploadFile.test.ts
```

---

### Test Suite 2: deleteFile.test.ts

**Mục đích:** Kiểm thử dịch vụ xóa file, bao gồm validation, error handling.

**Số lượng test case:** 8

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Delete existing file | Xóa file tồn tại | File được xóa thành công, không throw error |
| Delete non-existent file | Xóa file không tồn tại | Throw Error: "Requested path does not exist" |
| Delete directory path | Cố gắng xóa thư mục | Throw Error: "Requested path is not a file" |
| Path validation | Kiểm tra đường dẫn | Path được chuẩn hóa trước khi xóa |
| File existence check | Kiểm tra tồn tại file | existsSync được gọi với đúng path |
| File type verification | Kiểm tra loại file | lstatSync().isDirectory() được gọi |
| Multiple file deletion | Xóa nhiều file cùng lúc | Từng file được xóa riêng biệt |
| Error message accuracy | Kiểm tra tin nhắn lỗi | Message mô tả chính xác lỗi xảy ra |

**Mock Dependencies:**
- `fs.existsSync`: Check file existence
- `fs.lstatSync`: Get file stats
- `fs.unlinkSync`: Delete file

**Ví dụ chạy test:**
```bash
npm test -- unit/deleteFile.test.ts
```

---

### Test Suite 3: createFolder.test.ts

**Mục đích:** Kiểm thử dịch vụ tạo thư mục, bao gồm folder creation, validation, và error handling.

**Số lượng test case:** 8

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Create new folder | Tạo thư mục mới | Thư mục được tạo thành công |
| Create nested folders | Tạo thư mục lồng nhau | Tất cả thư mục cha được tạo tự động |
| Folder already exists | Thư mục đã tồn tại | Không throw error, return path |
| Recursive creation | Tạo recursive | fs.mkdir được gọi với `{ recursive: true }` |
| Return destination path | Kiểm tra giá trị trả về | Trả về `destinationPath` |
| Path normalization | Chuẩn hóa path | Path được normalize trước khi tạo |
| Handle deep paths | Xử lý đường dẫn sâu | Tạo được 5+ level deep folders |
| Empty path handling | Xử lý path rỗng | Throw Error hoặc xử lý gracefully |

**Mock Dependencies:**
- `fs.existsSync`: Check folder existence
- `fs/promises.mkdir`: Create folder

**Ví dụ chạy test:**
```bash
npm test -- unit/createFolder.test.ts
```

---

### Test Suite 4: fileUploadIntegration.test.ts (Integration)

**Mục đích:** Kiểm thử quy trình tải file hoàn chỉnh, từ validation đến lưu trữ trên đĩa.

**Số lượng test case:** 10

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Complete upload workflow | Tải file từ upload đến lưu trữ | File có trong hệ thống tệp |
| Create upload directory | Tạo thư mục tải | Thư mục được tạo trước khi tải |
| Handle multiple uploads | Tải nhiều file cùng lúc | Tất cả files được tải đúng thứ tự |
| File metadata in response | Kiểm tra metadata trong response | Response chứa `name`, `size`, `mimetype`, `url` |
| URL consistency | Kiểm tra URL consistency | URL được build theo định dạng nhất quán |
| Storage path verification | Kiểm tra lưu trữ vật lý | Files được lưu vào media path |
| Permission handling | Xử lý quyền tệp | Tệp được tạo với quyền đọc/ghi |
| Cleanup after error | Dọn dẹp sau lỗi | Thư mục được tạo ngay cả khi có lỗi |
| Large file handling | Xử lý file lớn | File > 10MB được tải thành công |
| Concurrent uploads | Tải file đồng thời | Xử lý parallel uploads không bị race condition |

**Mock Dependencies:**
- Tất cả dependencies từ uploadFile.test.ts
- File system operations

---

### Test Suite 5: folderOperations.test.ts (Integration)

**Mục đích:** Kiểm thử các thao tác thư mục tích hợp.

**Số lượng test case:** 8

#### Test Cases:

| Test Case | Mô Tả | Kỳ Vọng |
|-----------|-------|---------|
| Create and delete folder | Tạo rồi xóa thư mục | Thư mục được tạo và xóa thành công |
| Upload to created folder | Tải file vào thư mục mới | File được tải vào đúng thư mục |
| Nested folder operations | Thao tác thư mục lồng nhau | Tạo được thư mục con của thư mục con |
| Delete folder with files | Xóa thư mục chứa files | Xóa files trước rồi xóa thư mục |
| Folder path validation | Kiểm tra path hợp lệ | Path được normalize |
| Folder existence check | Kiểm tra tồn tại | existsSync được gọi đúng |
| Create multiple folders | Tạo nhiều thư mục | Tất cả folders được tạo |
| Folder isolation | Folders độc lập | Files trong folder A không ảnh hưởng folder B |

**Mock Dependencies:**
- Tất cả dependencies từ createFolder.test.ts và deleteFile.test.ts
- File system integration

---

## Kịch Bản Kiểm Thử Chính

### Kịch Bản 1: Tải File

```
1. User tải file từ giao diện
2. API nhận file thông qua multer
3. Dịch vụ uploadFile được gọi
   ├─ Validate destination path
   ├─ Tạo thư mục nếu cần
   ├─ Ghi file vào disk
   └─ Tạo URL truy cập
4. Trả về file metadata cho client
```

**Test Coverage:**
- uploadFile.test.ts: Upload validation, path handling, metadata
- fileUploadIntegration.test.ts: Complete workflow

---

### Kịch Bản 2: Xóa File

```
1. User yêu cầu xóa file
2. API gọi deleteFile service
   ├─ Kiểm tra file tồn tại
   ├─ Xác nhận là file (không phải folder)
   └─ Xóa file từ disk
3. Trả về kết quả xóa
```

**Test Coverage:**
- deleteFile.test.ts: Existence check, type validation, deletion

---

### Kịch Bản 3: Tạo Thư Mục

```
1. User yêu cầu tạo thư mục
2. API gọi createFolder service
   ├─ Chuẩn hóa path
   ├─ Kiểm tra tồn tại
   └─ Tạo thư mục recursively
3. Trả về path đã tạo
```

**Test Coverage:**
- createFolder.test.ts: Path handling, folder creation
- folderOperations.test.ts: Nested folders, multiple operations

---

## Cách Chạy Kiểm Thử

### Chạy Tất Cả Tests

```bash
npm test
```

### Chạy Riêng Module CMS

```bash
npm test -- src/modules/cms/tests
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
npm test -- uploadFile.test.ts
npm test -- deleteFile.test.ts
npm test -- folderOperations.test.ts
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

### Full Pipeline

```bash
npm run deploy && npm run test -- ./packages/evershop/dist/modules/cms/tests
```

### With coverage

```bash
npm run test -- ./packages/evershop/dist/modules/cms/tests --coverage
```
