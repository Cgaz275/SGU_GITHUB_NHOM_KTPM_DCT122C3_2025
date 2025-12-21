# Hướng Dẫn EverShop: Giải Thích Luồng Hoạt Động Admin và User

## Mục Lục
1. [Thuộc Tính Sản Phẩm (Attributes)](#thuộc-tính-sản-phẩm)
2. [Sản Phẩm (Products)](#sản-phẩm)
3. [Danh Mục (Categories)](#danh-mục)
4. [Bộ Sưu Tập (Collections)](#bộ-sưu-tập)
5. [Mua Hàng và Thanh Toán](#mua-hàng-và-thanh-toán)

---

## Thuộc Tính Sản Phẩm

### Giải Thích Chi Tiết

**Thuộc tính (Attributes)** là các đặc điểm hoặc tính chất của sản phẩm. Chúng được sử dụng để mô tả chi tiết các sản phẩm trong cửa hàng.

#### Các Cài Đặt Chính

| Cài Đặt | Giải Thích | Ví Dụ |
|--------|-----------|-------|
| **Tên (Name)** | Nhãn hiển thị của thuộc tính | "Màu sắc", "Kích cỡ" |
| **Mã (Code)** | Mã định danh duy nhất nội bộ | "color", "size" |
| **Loại (Type)** | Định dạng dữ liệu | Text, Select, Multiselect, Textarea |
| **Bắt Buộc (Is Required?)** | Bắt buộc nhập khi tạo sản phẩm | Có/Không |
| **Có thể Lọc (Is Filterable?)** | Cho phép khách hàng lọc sản phẩm | Có/Không |
| **Hiển Thị Frontend (Display on Frontend?)** | Hiển thị cho khách hàng | Có/Không |
| **Thứ Tự Sắp Xếp (Sort Order)** | Vị trí hiển thị | 0, 1, 2, ... |
| **Nhóm Thuộc Tính (Attribute Group)** | Nhóm chứa thuộc tính | "Default", "Custom" |

### Luồng Hoạt Động Admin (Tạo Thuộc Tính)

```
1. Đăng nhập vào Admin Panel
   ↓
2. Vào mục Catalog → Attributes
   ↓
3. Nhấn "Create New Attribute"
   ↓
4. Điền thông tin:
   - Tên: "Màu sắc"
   - Mã: "color"
   - Loại: Select
   - Bắt buộc: Có
   - Có thể lọc: Có
   - Hiển thị: Có
   - Thứ tự: 1
   - Nhóm: Default
   ↓
5. Thêm các tùy chọn (Options):
   - Trắng
   - Đen
   - Xanh
   ↓
6. Nhấn "Save"
   ↓
7. Thuộc tính được tạo thành công
```

### Luồng Hoạt Động User (Sử Dụng Thuộc Tính)

```
1. Khách hàng vào trang Catalog
   ↓
2. Thấy các bộ lọc ở sidebar trái:
   - Nếu "Is Filterable" = Có
   - Hiển thị: ☐ Trắng ☐ Đen ☐ Xanh
   ↓
3. Chọn một hoặc nhiều tùy chọn
   ↓
4. Danh sách sản phẩm cập nhật
   ↓
5. Khách hàng xem chi tiết sản phẩm:
   - Thấy "Màu sắc: Trắng" (nếu Display = Có)
   ↓
6. Khi tạo đơn hàng, nếu "Is Required" = Có:
   - Bắt buộc chọn một màu sắc
```

---

## Sản Phẩm

### Giải Thích Chi Tiết

**Sản phẩm (Products)** là những mặt hàng được bán trong cửa hàng. Mỗi sản phẩm có các thông tin như tên, giá, kho, mô tả...

#### Các Phần Chính

**Phần Chung (General)**
- **Tên Sản Phẩm**: Tên hiển thị khách hàng thấy
- **SKU**: Mã sản phẩm để quản lý kho (ví dụ: "SHOE-001")
- **Giá**: Giá bán sản phẩm
- **Danh Mục**: Danh mục sản phẩm thuộc về
- **Mô Tả**: Mô tả chi tiết sản phẩm

**Phần Media**
- Tải ảnh/video sản phẩm
- Hiển thị cho khách hàng

**Phần Tối Ưu Hóa SEO**
- **URL Key**: Đường dẫn URL sản phẩm (ví dụ: "giay-the-thao-nam")
- **Meta Title**: Tiêu đề trên Google (tối đa 60 ký tự)
- **Meta Description**: Mô tả trên Google (tối đa 160 ký tự)

**Phần Trạng Thái**
- **Status**: Enabled (Bật) / Disabled (Tắt)
- **Visibility**: Hiển thị trong danh mục hay tìm kiếm

**Phần Hàng Tồn Kho**
- **Quản Lý Kho**: Có/Không
- **Tình Trạng**: In Stock / Out of Stock
- **Số Lượng**: Số lượng hàng có sẵn

**Phần Vận Chuyển**
- **Cân Nặng**: Cân nặng sản phẩm (kg)
- **Không yêu cầu vận chuyển**: Cho sản phẩm số hoá

### Luồng Hoạt Động Admin (Tạo Sản Phẩm)

```
1. Đăng nhập vào Admin Panel
   ↓
2. Vào mục Products → All Products
   ↓
3. Nhấn "Create New Product"
   ↓
4. Điền thông tin Chung:
   - Tên: "Giày Thể Thao Nam"
   - SKU: "SHOE-MEN-001"
   - Giá: 1.500.000 VND
   - Danh Mục: Giày
   - Mô Tả: Giày thể thao chất lượng cao...
   ↓
5. Tải ảnh:
   - Ảnh chính sản phẩm
   - Ảnh chi tiết từ các góc độ
   ↓
6. Điền SEO:
   - URL Key: "giay-the-thao-nam"
   - Meta Title: "Giày Thể Thao Nam - Chất Lượng Cao"
   - Meta Description: "Giày thể thao nam thời trang..."
   ↓
7. Cài đặt Trạng Thái:
   - Status: Enabled
   - Visibility: Catalog, Search
   ↓
8. Cài đặt Hàng Tồn Kho:
   - Quản Lý: Có
   - Tình Trạng: In Stock
   - Số Lượng: 100
   ↓
9. Cài đặt Vận Chuyển:
   - Cân Nặng: 0.5 kg
   ↓
10. Chọn Nhóm Thuộc Tính:
    - Nhóm: "Default"
    ↓
11. Thêm các Thuộc Tính:
    - Màu sắc: Trắng
    - Kích cỡ: 42
    ↓
12. Nhấn "Save"
    ↓
13. Sản phẩm được tạo thành công
```

### Luồng Hoạt Động User (Mua Sản Phẩm)

```
1. Khách hàng vào cửa hàng
   ↓
2. Duyệt danh mục hoặc tìm kiếm
   ↓
3. Thấy danh sách sản phẩm:
   - Ảnh sản phẩm
   - Tên sản phẩm
   - Giá
   ↓
4. Nhấn vào sản phẩm để xem chi tiết
   ↓
5. Trên trang chi tiết:
   - Thấy tất cả ảnh
   - Mô tả sản phẩm
   - Giá
   - Thông tin thuộc tính:
     * Màu sắc: [Chọn màu]
     * Kích cỡ: [Chọn kích cỡ]
   ↓
6. Nếu "Is Required" = Có:
   - Bắt buộc chọn tất cả thuộc tính
   ↓
7. Chọn số lượng
   ↓
8. Nhấn "Add to Cart"
   ↓
9. Sản phẩm được thêm vào giỏ hàng
   ↓
10. Tiếp tục mua hoặc thanh toán
```

---

## Danh Mục

### Giải Thích Chi Tiết

**Danh mục (Categories)** là nhóm sản phẩm theo loại. Dùng để tổ chức hàng hóa một cách có hệ thống.

#### Các Phần Chính

| Phần | Giải Thích |
|-----|-----------|
| **Tên Danh Mục** | Tên hiển thị (ví dụ: "Giày nam") |
| **Danh Mục Cha** | Danh mục cấp cao hơn (tạo phân cấp) |
| **Mô Tả** | Mô tả chi tiết danh mục |
| **Ảnh Bìa** | Ảnh hiển thị ở đầu danh mục |
| **URL Key** | Đường dẫn URL danh mục |
| **Meta Title/Description** | Tối ưu SEO |
| **Status** | Enabled/Disabled |
| **Include in Store Menu** | Hiển thị trong menu |
| **Show Products** | Hiển thị danh sách sản phẩm |

#### Ví Dụ Phân Cấp Danh Mục

```
Giày (Danh mục cha)
├── Giày nam (Danh mục con)
│   ├── Giày thể thao
│   └── Giày tây
├── Giày nữ (Danh mục con)
│   ├── Giày cao gót
│   └── Giày búp bê
└── Giày trẻ em (Danh mục con)
```

### Luồng Hoạt Động Admin (Tạo Danh Mục)

```
1. Đăng nhập vào Admin Panel
   ↓
2. Vào mục Catalog → Categories
   ↓
3. Nhấn "Create New Category"
   ↓
4. Điền Tên Danh Mục:
   - "Giày nam"
   ↓
5. Chọn Danh Mục Cha (tùy chọn):
   - "Giày"
   ↓
6. Viết Mô Tả:
   - "Bộ sưu tập giày nam chất lượng cao..."
   ↓
7. Tải Ảnh Bìa:
   - Ảnh đại diện cho danh mục
   ↓
8. Điền SEO:
   - URL Key: "giay-nam"
   - Meta Title: "Giày Nam - Cửa Hàng Giày Tốt Nhất"
   - Meta Description: "Khám phá bộ sưu tập giày nam..."
   ↓
9. Cài đặt Trạng Thái:
   - Status: Enabled
   - Include in Store Menu: Yes
   - Show Products: Yes
   ↓
10. Nhấn "Save"
    ↓
11. Danh mục được tạo thành công
```

### Luồng Hoạt Động User (Duyệt Danh Mục)

```
1. Khách hàng vào cửa hàng
   ↓
2. Thấy menu chính:
   - Giày
     * Giày nam
     * Giày nữ
     * Giày trẻ em
   ↓
3. Nhấn "Giày nam"
   ↓
4. Trên trang danh mục:
   - Thấy ảnh bìa
   - Mô tả danh mục
   - Danh sách sản phẩm
   ↓
5. Sử dụng bộ lọc ở sidebar:
   - Lọc theo thuộc tính có "Is Filterable = Có"
   ↓
6. Nhấn vào sản phẩm để xem chi tiết
   ↓
7. Hoặc quay lại để chọn danh mục khác
```

---

## Bộ Sưu Tập

### Giải Thích Chi Tiết

**Bộ sưu tập (Collections)** là nhóm sản phẩm theo chủ đề hoặc chiến dịch. Khác với danh mục, một sản phẩm có thể thuộc nhiều bộ sưu tập.

#### So Sánh Collection vs Category

| Tiêu Chí | Collection | Category |
|---------|-----------|----------|
| **Mục Đích** | Chủ đề/Chiến dịch | Loại sản phẩm |
| **Số Lượng** | Một sản phẩm → Nhiều collection | Một sản phẩm → Một category |
| **Thay Đổi** | Linh hoạt, theo mùa | Cố định |
| **Ví Dụ** | "Bộ sưu tập hè 2024" | "Giày nam" |

#### Ví Dụ Collections

- "Bộ sưu tập mùa hè 2024"
- "Sản phẩm bán chạy nhất"
- "Giảm giá từ 30% trở lên"
- "Sản phẩm mới nhất"
- "Flash sale hôm nay"

### Luồng Hoạt Động Admin (Tạo Bộ Sưu Tập)

```
1. Đăng nhập vào Admin Panel
   ↓
2. Vào mục Products → Collections
   ↓
3. Nhấn "Create New Collection"
   ↓
4. Điền Tên Bộ Sưu Tập:
   - "Bộ sưu tập mùa hè 2024"
   ↓
5. Điền Mã Collection:
   - "summer-collection-2024"
   ↓
6. Viết Mô Tả:
   - "Bộ sưu tập giày mùa hè với kiểu dáng..."
   ↓
7. Nhấn "Save"
   ↓
8. Bộ sưu tập được tạo
   ↓
9. Thêm sản phẩm vào bộ sưu tập:
   - Vào từng sản phẩm
   - Chọn "Collections" → Thêm bộ sưu tập
   ↓
10. Hoặc khi tạo sản phẩm:
    - Chọn Collections trong form
```

### Luồng Hoạt Động User (Xem Bộ Sưu Tập)

```
1. Khách hàng vào cửa hàng
   ↓
2. Thấy các bộ sưu tập ở trang chủ hoặc menu:
   - "Bộ sưu tập mùa hè 2024"
   - "Sản phẩm nổi bật"
   - "Flash sale hôm nay"
   ↓
3. Nhấn vào một bộ sưu tập
   ↓
4. Trên trang bộ sưu tập:
   - Thấy mô tả
   - Danh sách sản phẩm
   ↓
5. Có thể lọc sản phẩm (nếu có bộ lọc)
   ↓
6. Nhấn vào sản phẩm để xem chi tiết
   ↓
7. Thêm vào giỏ hàng hoặc tiếp tục mua
```

---

## Mua Hàng và Thanh Toán

### Giải Thích Chi Tiết

**Mua hàng và thanh toán** là quy trình mà khách hàng chọn sản phẩm, đặt hàng, và thanh toán. Admin cần chuẩn bị hệ thống thanh toán, giao hàng, và theo dõi đơn hàng.

#### Các Giai Đoạn Chính

1. **Giỏ Hàng (Shopping Cart)** - Khách hàng thêm sản phẩm
2. **Checkout** - Nhập thông tin giao hàng, chọn phương thức thanh toán
3. **Thanh Toán (Payment)** - Xác nhận thanh toán
4. **Đơn Hàng (Order)** - Lưu trữ thông tin đơn hàng
5. **Giao Hàng (Shipping)** - Admin chuẩn bị hàng, gửi cho khách

### Luồng Hoạt Động Admin (Chuẩn Bị Hệ Thống)

#### 1. Cài Đặt Phương Thức Thanh Toán

```
1. Đăng nhập vào Admin Panel
   ↓
2. Vào mục Settings → Payment Methods
   ↓
3. Cấu hình các phương thức thanh toán:
   - Thanh toán khi nhận hàng (COD - Cash On Delivery)
   - Chuyển khoản ngân hàng
   - Thẻ tín dụng (nếu có gateway)
   - Ví điện tử (nếu có)
   - PayPal (nếu tích hợp)
   ↓
4. Cài đặt từng phương thức:
   - Bật/Tắt
   - Phí thanh toán (nếu có)
   - Điều kiện áp dụng
   ↓
5. Nhấn "Save"
```

#### 2. Cài Đặt Giao Hàng

```
1. Vào mục Settings → Shipping Methods
   ↓
2. Tạo phương thức giao hàng:
   - Giao hàng nhanh (1-2 ngày)
   - Giao hàng tiêu chuẩn (3-5 ngày)
   - Giao hàng tiết kiệm (5-7 ngày)
   ↓
3. Cài đặt từng phương thức:
   - Tên
   - Phí giao hàng (hoặc miễn phí)
   - Thời gian giao dự kiến
   - Điều kiện áp dụng (VD: miễn phí nếu mua > 500K)
   ↓
4. Nhấn "Save"
```

#### 3. Cài Đặt Thuế (nếu cần)

```
1. Vào mục Settings → Tax
   ↓
2. Cài đặt tỷ lệ thuế:
   - Thuế GTGT: 10%
   - Thuế khác (nếu có)
   ↓
3. Nhấn "Save"
```

#### 4. Quản Lý Đơn Hàng

```
1. Đăng nhập Admin Panel
   ↓
2. Vào mục Orders → All Orders
   ↓
3. Xem danh sách đơn hàng:
   - Đơn hàng chờ xác nhận
   - Đơn hàng đang xử lý
   - Đơn hàng đang giao
   - Đơn hàng đã hoàn thành
   - Đơn hàng bị hủy
   ↓
4. Nhấn vào một đơn hàng để xem chi tiết:
   - Thông tin khách hàng
   - Danh sách sản phẩm
   - Tổng tiền (bao gồm tax, shipping)
   - Trạng thái thanh toán
   - Địa chỉ giao hàng
   ↓
5. Cập nhật trạng thái:
   - Xác nhận đơn hàng
   - Chuẩn bị hàng
   - Giao cho shipper
   - Đánh dấu là đã giao
   ↓
6. Nếu cần:
   - Liên hệ khách hàng
   - Hủy đơn hàng
   - Xử lý khiếu nại
```

#### 5. Quản Lý Hoàn Trả (Returns)

```
1. Vào mục Orders → Returns/Refunds
   ↓
2. Xem các yêu cầu hoàn trả từ khách
   ↓
3. Xác nhận hoàn trả:
   - Kiểm tra lý do
   - Xác minh sản phẩm
   - Phê duyệt hoàn lại tiền
   ↓
4. Cấp mã hoàn trả cho khách
   ↓
5. Khách hàng gửi hàng lại
   ↓
6. Kiểm nhận hàng lại
   ↓
7. Xác nhận hoàn tiền
```

### Luồng Hoạt Động User (Mua Hàng)

#### 1. Thêm Sản Phẩm vào Giỏ Hàng

```
1. Khách hàng xem chi tiết sản phẩm
   ↓
2. Chọn các tùy chọn (nếu có):
   - Màu sắc
   - Kích cỡ
   - Số lượng
   ↓
3. Nhấn "Add to Cart"
   ↓
4. Sản phẩm được thêm vào giỏ hàng
   ↓
5. Thông báo: "Đã thêm vào giỏ hàng"
   ↓
6. Khách hàng có thể:
   - Tiếp tục mua (quay lại shopping)
   - Xem giỏ hàng (bấm icon giỏ)
```

#### 2. Xem Giỏ Hàng

```
1. Khách hàng nhấn icon giỏ hàng ở header
   ↓
2. Mở trang giỏ hàng:
   - Danh sách sản phẩm đã thêm
   - Ảnh sản phẩm
   - Tên sản phẩm
   - Giá
   - Số lượng (có thể thay đổi)
   - Tổng tiền từng sản phẩm
   ↓
3. Có thể:
   - Thay đổi số lượng
   - Xóa sản phẩm
   - Tiếp tục mua hàng
   - Tiến tới Checkout
   ↓
4. Nhấn "Proceed to Checkout"
```

#### 3. Checkout (Nhập Thông Tin)

```
1. Nhập/Xác nhận thông tin giao hàng:
   - Họ và tên
   - Số điện thoại
   - Email
   - Địa chỉ giao hàng
   - Tỉnh/Thành phố
   - Quận/Huyện
   - Xã/Phường
   - Mã bưu chính (nếu cần)
   ↓
2. Chọn phương thức giao hàng:
   - Giao hàng nhanh: 1-2 ngày (+ 30.000đ)
   - Giao hàng tiêu chuẩn: 3-5 ngày (+ 20.000đ)
   - Giao hàng tiết kiệm: 5-7 ngày (+ 10.000đ)
   ↓
3. Hệ thống tính toán:
   - Tổng giá sản phẩm
   + Phí giao hàng
   + Thuế (nếu có)
   = Tổng cộng
   ↓
4. Chọn phương thức thanh toán:
   ☐ Thanh toán khi nhận hàng (COD)
   ☐ Chuyển khoản ngân hàng
   ☐ Thẻ tín dụng
   ☐ PayPal
   ↓
5. Nhập mã giảm giá (nếu có)
   ↓
6. Xem lại Đơn Hàng:
   - Sản phẩm
   - Địa chỉ giao
   - Phương thức giao
   - Phương thức thanh toán
   - Tổng tiền
   ↓
7. Nhấn "Confirm Order"
```

#### 4. Thanh Toán

**Trường hợp 1: Thanh toán khi nhận hàng (COD)**
```
1. Nhấn "Confirm Order"
   ↓
2. Hệ thống hiển thị:
   - Đơn hàng đã tạo thành công
   - Số đơn hàng
   - Email xác nhận được gửi
   ↓
3. Trạng thái: Đợi shipper lấy hàng
   ↓
4. Khách hàng nhận hàng:
   - Kiểm tra sản phẩm
   - Thanh toán cho shipper
   ↓
5. Đơn hàng hoàn tất
```

**Trường hợp 2: Chuyển khoản ngân hàng**
```
1. Nhấn "Confirm Order"
   ↓
2. Hệ thống hiển thị:
   - Thông tin chuyển khoản:
     * Tên ngân hàng
     * Số tài khoản
     * Tên chủ tài khoản
     * Số tiền cần chuyển
     * Nội dung chuyển khoản
   ↓
3. Khách hàng chuyển khoản vào tài khoản cửa hàng
   ↓
4. Admin xác nhận thanh toán
   ↓
5. Chuẩn bị hàng và giao cho shipper
   ↓
6. Khách nhận hàng
   ↓
7. Đơn hàng hoàn tất
```

**Trường hợp 3: Thẻ tín dụng / PayPal**
```
1. Nhấn "Confirm Order"
   ↓
2. Chuyển hướng tới gateway thanh toán
   (Stripe, PayPal, v.v.)
   ↓
3. Khách hàng nhập thông tin thẻ
   ↓
4. Thanh toán được xác nhận
   ↓
5. Quay lại cửa hàng:
   - Hiển thị "Thanh toán thành công"
   - Số đơn hàng
   ↓
6. Admin chuẩn bị hàng
   ↓
7. Giao cho shipper
   ↓
8. Khách nhận hàng
   ↓
9. Đơn hàng hoàn tất
```

#### 5. Theo Dõi Đơn Hàng

```
1. Khách hàng nhập email hoặc số đơn hàng
   ↓
2. Xem trạng thái đơn hàng:
   ✓ Đã xác nhận
   ✓ Đang chuẩn bị hàng
   ✓ Đã giao cho shipper
   ⏳ Đang giao
   ✓ Đã giao
   ↓
3. Xem thông tin giao hàng:
   - Mã vận đơn
   - Tên shipper
   - Số điện thoại shipper
   ↓
4. Gọi shipper nếu cần
   ↓
5. Khi nhận hàng, xác nhận đã giao
```

#### 6. Hoàn Trả Sản Phẩm (nếu cần)

```
1. Khách hàng nhận hàng nhưng không hài lòng
   ↓
2. Nhấn "Request Return" trên trang theo dõi
   ↓
3. Chọn lý do hoàn trả:
   - Sản phẩm khác mô tả
   - Sản phẩm bị lỗi/hỏng
   - Không cần nữa
   - Lý do khác
   ↓
4. Viết mô tả vấn đề
   ↓
5. Tải ảnh sản phẩm (nếu cần)
   ↓
6. Nhấn "Submit Return Request"
   ↓
7. Chờ Admin xác nhận:
   - Thông báo qua email
   - Admin xem xét lý do
   ↓
8. Nếu được duyệt:
   - Nhận mã hoàn trả
   - Được hướng dẫn gửi hàng lại
   - Địa chỉ gửi lại
   ↓
9. Gửi hàng lại đến cửa hàng
   ↓
10. Admin kiểm nhận
    ↓
11. Xác nhận hoàn tiền
    ↓
12. Tiền được hoàn vào tài khoản/thẻ
```

### Sơ Đồ Quy Trình Mua Hàng Hoàn Chỉnh

```
┌─────────────────────────────────────────────────────────────┐
│ KHÁCH HÀNG (USER)                 │ CỬA HÀNG (ADMIN)        │
├─────────────────────────────────────────────────────────────┤
│ 1. Duyệt sản phẩm                 │                         │
│    ↓                              │                         │
│ 2. Thêm vào giỏ                   │                         │
│    ↓                              │                         │
│ 3. Xem giỏ hàng                   │                         │
│    ↓                              │                         │
│ 4. Proceed to Checkout            │                         │
│    ↓                              │                         │
│ 5. Nhập thông tin giao hàng       │                         │
│    ↓                              │                         │
│ 6. Chọn phương thức giao          │                         │
│    ↓                              │                         │
│ 7. Chọn phương thức thanh toán    │                         │
│    ↓                              │                         │
│ 8. Confirm Order                  │ ← Tạo đơn hàng         │
│    ↓                              │   ↓                     │
│ 9. Thanh toán                     │ ← Xác nhận thanh toán  │
│    (COD / Bank / Card)            │   ↓                     │
│    ↓                              │ ← Chuẩn bị hàng        │
│ 10. Nhận email xác nhận           │   ↓                     │
│    ↓                              │ ← Giao cho shipper     │
│ 11. Theo dõi đơn hàng             │   ↓                     │
│    ↓                              │ ← Giao cho khách       │
│ 12. Nhận hàng                     │   ↓                     │
│    ↓                              │   Hoàn tất            │
│ 13. Xác nhận đã giao              │                         │
│    ↓                              │                         │
│ 14. (Nếu cần) Request Return      │ ← Xem yêu cầu         │
│    ↓                              │   ↓                     │
│ 15. Gửi hàng lại                  │ ← Kiểm nhận           │
│    ↓                              │   ↓                     │
│ 16. Nhận hoàn tiền                │ ← Xác nhận hoàn       │
└─────────────────────────────────────────────────────────────┘
```

### Trạng Thái Đơn Hàng

| Trạng Thái | Ý Nghĩa | Admin Hành Động | User Thấy |
|-----------|---------|-----------------|-----------|
| **Pending** | Đợi xác nhận | Xác nhận đơn | Chờ xác nhận |
| **Confirmed** | Đã xác nhận | Chuẩn bị hàng | Đã xác nhận |
| **Processing** | Đang chuẩn bị | Giao shipper | Đang chuẩn bị |
| **Shipped** | Đã giao shipper | Theo dõi | Đang giao |
| **Delivered** | Đã giao khách | Kiểm tra | Đã nhận |
| **Completed** | Hoàn thành | Lưu trữ | Hoàn thành |
| **Cancelled** | Bị hủy | Hoàn tiền | Đã hủy |
| **Returned** | Hoàn lại | Kiểm nhận | Đang hoàn |

### Các Vấn Đề Phổ Biến và Cách Xử Lý

| Vấn Đề | Admin Xử Lý | User Hành Động |
|--------|------------|-----------------|
| **Khách chưa thanh toán** | Gửi email nhắc nhở | Thanh toán lại |
| **Địa chỉ không đúng** | Liên hệ khách, giao lại | Xác nhận địa chỉ |
| **Sản phẩm bị hỏng** | Nhận hoàn trả, gửi lại | Request return |
| **Giao hàng muộn** | Liên hệ shipper, bồi thường | Liên hệ cửa hàng |
| **Khách thụ động không nhận** | Liên hệ, sắp xếp lại | Lấy hàng kịp thời |

---

## Quy Trình Mua Hàng Hoàn Chỉnh (End-to-End)

### Admin Setup (Chuẩn Bị)

```
1. Tạo Attribute Groups
   ↓
2. Tạo Attributes (Màu, Kích cỡ, v.v.)
   ↓
3. Tạo Categories (Giày, Áo, v.v.)
   ↓
4. Tạo Collections (Mùa hè, Giảm giá, v.v.)
   ↓
5. Tạo Products
   - Gán vào Categories
   - Thêm thuộc tính
   - Gán vào Collections
   ↓
6. Quản lý kho (Inventory)
   ↓
7. Cửa hàng sẵn sàng
```

### User Journey (Hành Trình Khách Hàng)

```
1. Truy cập cửa hàng
   ↓
2. Duyệt Categories hoặc Collections
   ↓
3. Sử dụng bộ lọc (dựa trên Attributes)
   ↓
4. Chọn sản phẩm
   ↓
5. Xem chi tiết (Attributes, Giá, Ảnh, v.v.)
   ↓
6. Chọn các tùy chọn (nếu bắt buộc):
   - Màu sắc
   - Kích cỡ
   - v.v.
   ↓
7. Thêm vào giỏ hàng
   ↓
8. Tiếp tục mua hoặc thanh toán
   ↓
9. Hoàn tất đơn hàng
```

---

## Các Điểm Quan Trọng Cần Nhớ

### Cho Admin

✓ **Attributes** → Dùng để mô tả chi tiết sản phẩm  
✓ **Categories** → Tổ chức sản phẩm theo loại (phân cấp)  
✓ **Collections** → Nhóm sản phẩm theo chủ đề (linh hoạt)  
✓ **Products** → Những gì bán trong cửa hàng  

### Cho User

✓ **Bộ lọc** → Dựa trên Attributes có "Is Filterable = Có"  
✓ **Thông tin sản phẩm** → Dựa trên "Display on Frontend = Có"  
✓ **Bắt buộc chọn** → Dựa trên "Is Required = Có"  
✓ **Duyệt cửa hàng** → Qua Categories hoặc Collections  

---

## Ví Dụ Thực Tế Hoàn Chỉnh

### Admin tạo một sản phẩm giày

```
1. Tạo Attributes:
   - Tên: "Màu sắc" | Mã: "color"
     * Loại: Select
     * Is Required: Yes
     * Is Filterable: Yes
     * Display: Yes
     * Tùy chọn: Trắng, Đen, Xanh
   
   - Tên: "Kích cỡ" | Mã: "size"
     * Loại: Select
     * Is Required: Yes
     * Is Filterable: Yes
     * Display: Yes
     * Tùy chọn: 36, 37, 38, 39, 40, 41, 42

2. Tạo Category:
   - Tên: "Giày"
   - URL: "giay"

3. Tạo Products:
   - Tên: "Giày Thể Thao Nam"
   - SKU: "SHOE-001"
   - Giá: 1.500.000
   - Category: Giày
   - Attributes:
     * Màu: Trắng, Đen, Xanh
     * Kích cỡ: 36-42
   - Collections: "Bộ sưu tập mùa hè 2024"

4. Bộ sưu tập:
   - Tên: "Bộ sưu tập mùa hè 2024"
   - Mã: "summer-2024"
```

### User mua sản phẩm

```
1. Vào cửa hàng
   ↓
2. Thấy menu: Giày (Category)
   ↓
3. Nhấn vào "Giày"
   ↓
4. Thấy bộ lọc:
   ☐ Trắng
   ☐ Đen
   ☐ Xanh
   
   ☐ 36
   ☐ 37
   ☐ 38
   ... (từ Attributes có Is Filterable = Yes)
   ↓
5. Chọn "Trắng" + "42"
   ↓
6. Thấy sản phẩm "Giày Thể Thao Nam" khi lọc
   ↓
7. Nhấn vào sản phẩm
   ↓
8. Trên trang chi tiết:
   - Giá: 1.500.000
   - Mô tả
   - Ảnh
   - Bắt buộc chọn:
     * Màu sắc: [Trắng ▼]
     * Kích cỡ: [42 ▼]
   ↓
9. Nhấn "Add to Cart"
   ↓
10. Giỏ hàng: 1 sản phẩm (Giày Thể Thao Nam - Trắng - 42)
```

---

## Kết Luận

EverShop sử dụng cấu trúc có hệ thống để quản lý sản phẩm:

- **Attributes** → Chi tiết sản phẩm (Màu, Kích cỡ, v.v.)
- **Categories** → Tổ chức hàng (Giày, Áo, v.v.)
- **Collections** → Nhóm sản phẩm theo chiến dịch
- **Products** → Những gì bán

Admin chuẩn bị, User mua. Cả hai đều phụ thuộc vào cấu hình Attributes và Organizations (Categories, Collections).
