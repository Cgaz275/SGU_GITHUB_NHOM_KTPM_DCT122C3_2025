# 📦 Hướng Dẫn Tách Module Catalog

## 🎯 Mục tiêu
Tách `packages/evershop/src/modules/catalog/` thành package npm riêng lẻ (`@evershop/catalog`) có thể deploy độc lập qua CI/CD.

## 📋 Cấu trúc Module Catalog Hiện Tại

```
packages/evershop/src/modules/catalog/
├── api/                    ← REST API endpoints
├── bootstrap.js            ← Module initialization
├── components/             ← React components (admin + storefront)
├── events.d.ts            ← TypeScript definitions
├── graphql/               ← GraphQL types & resolvers
├── migration/             ← Database migrations
├── pages/                 ← Admin & storefront pages
├── services/              ← Business logic
├── subscribers/           ← Event listeners
└── tests/                 ← Tests
```

## 🚀 Step-by-Step Tách Module

### **Step 1: Tạo folder package mới**

```bash
# Tạo folder cho catalog package
mkdir -p packages/catalog/src/modules/catalog
```

### **Step 2: Copy module catalog**

```bash
# Copy tất cả files từ core vào package mới
cp -r packages/evershop/src/modules/catalog/* packages/catalog/src/modules/catalog/
```

### **Step 3: Tạo package.json cho catalog**

Tạo file: `packages/catalog/package.json`

```json
{
  "name": "@evershop/catalog",
  "version": "1.0.0",
  "type": "module",
  "description": "Product Information Management (PIM) module for EverShop",
  "main": "dist/modules/catalog/index.js",
  "types": "dist/modules/catalog/index.d.ts",
  "files": [
    "dist"
  ],
  "exports": {
    ".": {
      "import": "./dist/modules/catalog/index.js",
      "types": "./dist/modules/catalog/index.d.ts"
    },
    "./services": {
      "import": "./dist/modules/catalog/services/index.js",
      "types": "./dist/modules/catalog/services/index.d.ts"
    },
    "./bootstrap": {
      "import": "./dist/modules/catalog/bootstrap.js",
      "types": "./dist/modules/catalog/bootstrap.d.ts"
    }
  },
  "scripts": {
    "build": "tsc && copyfiles -u 1 \"src/**/*.{graphql,scss,json}\" dist",
    "test": "jest",
    "lint": "eslint src/",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "@evershop/evershop": "^2.1.0"
  },
  "dependencies": {},
  "devDependencies": {
    "@evershop/evershop": "^2.1.0",
    "typescript": "^5.8.3",
    "copyfiles": "^2.4.1",
    "jest": "^29.7.0",
    "eslint": "^9.24.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### **Step 4: Tạo tsconfig.json**

Tạo file: `packages/catalog/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### **Step 5: Tạo Index/Export file**

Tạo file: `packages/catalog/src/modules/catalog/index.ts`

```typescript
export { default as bootstrap } from './bootstrap.js';
export * from './services/index.js';

// Export API endpoints
export { addProductToCategory } from './api/addProductToCategory/route.js';
export { updateProduct } from './api/updateProduct/route.js';
export { deleteProduct } from './api/deleteProduct/route.js';

// Export GraphQL resolvers
export * from './graphql/index.js';
```

### **Step 6: Tạo Services Index**

Tạo file: `packages/catalog/src/modules/catalog/services/index.ts`

```typescript
// Product services
export { getProductsBaseQuery } from './product/getProductsBaseQuery.js';
export { getFilterableAttributes } from './getFilterableAttributes.js';
export { getProductsByCategoryBaseQuery } from './getProductsByCategoryBaseQuery.js';

// Category services
export { getCategories } from './category/getCategories.js';

// Collection services
export { getCollections } from './collection/getCollections.js';

// Attribute services
export { getAttributes } from './attribute/getAttributes.js';

// Cart item fields
export { registerCartItemProductUrlField } from './registerCartItemProductUrlField.js';
export { registerCartItemVariantOptionsField } from './registerCartItemVariantOptionsField.js';
```

### **Step 7: Tạo Shared Index (GraphQL)**

Tạo file: `packages/catalog/src/modules/catalog/graphql/index.ts`

```typescript
// Export GraphQL resolvers
export * from './types/Product/Product.resolvers.js';
export * from './types/Category/Category.resolvers.js';
export * from './types/Collection/Collection.resolvers.js';
export * from './types/Attribute/Attribute.resolvers.js';
```

### **Step 8: Tạo GitHub Actions Workflow**

Tạo file: `.github/workflows/catalog-module.yml`

```yaml
name: Catalog Module CI/CD

on:
  push:
    branches:
      - main
      - module/catalog
    paths:
      - 'packages/catalog/**'
      - '.github/workflows/catalog-module.yml'
  pull_request:
    branches:
      - module/catalog
    paths:
      - 'packages/catalog/**'

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint catalog module
        run: npm run lint --workspace=@evershop/catalog
      
      - name: Type check catalog module
        run: npm run build --workspace=@evershop/catalog
      
      - name: Run tests
        run: npm test --workspace=@evershop/catalog
        env:
          DB_HOST: localhost
          DB_PORT: 5433
          DB_NAME: evershop_test
          DB_USER: postgres
          DB_PASSWORD: postgres

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build catalog module
        run: npm run build --workspace=@evershop/catalog
      
      - name: Archive dist folder
        uses: actions/upload-artifact@v4
        with:
          name: catalog-dist
          path: packages/catalog/dist

  publish:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/module/catalog' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build catalog module
        run: npm run build --workspace=@evershop/catalog
      
      - name: Create Release Tag
        id: tag
        run: |
          VERSION=$(node -p "require('./packages/catalog/package.json').version")
          TAG="catalog-v${VERSION}"
          echo "tag=${TAG}" >> $GITHUB_OUTPUT
      
      - name: Publish to npm
        run: npm publish --workspace=@evershop/catalog
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.tag.outputs.tag }}
          release_name: Catalog Module v${{ steps.tag.outputs.version }}
          body: |
            Catalog module release
            
            - Package: @evershop/catalog
            - Version: ${{ steps.tag.outputs.version }}
          draft: false
          prerelease: false
```

### **Step 9: Update Root package.json**

Thêm catalog vào workspaces trong file: `package.json`

```json
{
  "workspaces": [
    "packages/*",
    "extensions/*"
  ],
  "name": "evershop",
  ...
}
```

### **Step 10: Update Main App package.json**

Trong file: `my-evershop-app/package.json`

```json
{
  "dependencies": {
    "@evershop/evershop": "2.1.0",
    "@evershop/catalog": "^1.0.0"
  }
}
```

### **Step 11: Update .npmrc (optional, nếu dùng private registry)**

Tạo file: `.npmrc`

```
@evershop:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

### **Step 12: Tạo git branch**

```bash
# Create catalog module branch
git checkout -b module/catalog

# Commit changes
git add -A
git commit -m "chore: extract catalog module to separate package"

# Push to origin
git push origin module/catalog
```

## 📝 Database Migration Strategy

Mỗi update của catalog module có thể kèm migrations:

```bash
packages/catalog/
└── src/modules/catalog/
    └── migration/
        ├── 001-initial-products-table.sql
        ├── 002-add-sku-column.sql
        └── 003-add-variant-support.sql
```

**Trong bootstrap.js**, register migrations:

```javascript
import { registerMigration } from '@evershop/evershop/lib/migration';

export default () => {
  registerMigration('catalog', [
    '001-initial-products-table.sql',
    '002-add-sku-column.sql'
  ]);
};
```

## 🔄 Versioning Strategy

**Semantic Versioning:**
- `MAJOR` - Breaking changes (breaking API, removed services)
- `MINOR` - New features (new APIs, new services)
- `PATCH` - Bug fixes

**Update version trước khi release:**

```bash
cd packages/catalog
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## ✅ Pre-Deployment Checklist

Trước khi merge sang `module/catalog`:

- [ ] All tests passing locally
- [ ] GraphQL schema validated
- [ ] Database migrations tested
- [ ] Types exported correctly
- [ ] Services documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] No circular dependencies
- [ ] Breaking changes documented

## 🚨 Lưu Ý Quan Trọng

### **1. GraphQL Schema**
Catalog exports GraphQL types và resolvers. Khi update, đảm bảo:
- ✅ Backward compatible (add new fields, không xóa cũ)
- ✅ Tests GraphQL queries
- ✅ Update types.d.ts

### **2. Services API**
Services được import bởi checkout:
```javascript
import { getProductsBaseQuery } from '@evershop/catalog/services';
```

Khi tách:
- ✅ Export tất cả public services
- ✅ Version the service API
- ✅ Document breaking changes

### **3. Database Schema**
PostgreSQL chung, nhưng:
- ✅ Catalog migration tự quản lý bảng product, category, collection, attribute
- ✅ Migrations rollback-safe
- ✅ Test migrations thoroughly

### **4. Circular Dependencies**
Catalog → không phụ thuộc module khác ✅
Nhưng nhiều modules depend vào catalog
→ Cần test compatibility

## 📚 Testing Strategy

```bash
# Unit tests
npm test --workspace=@evershop/catalog

# Integration tests (with main app)
npm test --workspace=my-evershop-app

# GraphQL schema validation
npm run validate-schema --workspace=@evershop/catalog
```

## 🔗 Liên Kết Tiếp Theo

Sau khi catalog được tách:
1. Tách checkout (phụ thuộc vào catalog)
2. Tách customer, auth, cms (independent)
3. Tách payment modules: cod, stripe, paypal

## 💡 Troubleshooting

**Problem**: Tests fail trong catalog package
```bash
Solution: Kiểm tra node_modules - cần install deps với npm ci
```

**Problem**: GraphQL types lỗi
```bash
Solution: Rebuild GraphQL schema sau mỗi change
npm run build --workspace=@evershop/catalog
```

**Problem**: Services import không được
```bash
Solution: Đảm bảo services/index.ts export tất cả public APIs
```
