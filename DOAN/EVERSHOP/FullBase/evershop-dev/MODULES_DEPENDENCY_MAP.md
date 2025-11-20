# EverShop Module Dependencies Map

## 📊 Dependency Graph

```
SHARED (Base Layer)
├── lib/* (utilities, registry, helpers)
├── graphql/* (GraphQL API layer)
└── base/* (base services)

MODULE DEPENDENCIES (in deployment order):
│
├── 1️⃣ INDEPENDENT MODULES (No inter-module deps)
│   ├── catalog
│   ├── customer
│   ├── auth
│   ├── cms
│   ├── tax
│   ├── promotion
│   └── oms
│
├── 2️⃣ DEPENDS ON SHARED
│   ├── setting
│   │   └── used by: cod, stripe, paypal
│   │
│   └── checkout
│       ├── depends on: catalog (getProductsBaseQuery)
│       └── used by: cod, stripe, paypal
│
└── 3️⃣ DEPENDS ON OTHER MODULES
    ├── cod
    │   ├── → checkout (registerPaymentMethod)
    │   └── → setting (getSetting)
    │
    ├── stripe
    │   ├── → checkout (registerPaymentMethod)
    │   ├── → setting (getSetting)
    │   └── → oms (config update)
    │
    └── paypal
        ├── → checkout (registerPaymentMethod)
        ├── → setting (getSetting)
        └── → oms (config update)
```

## 📋 Detailed Dependencies Table

| Module | Imports From | Used By | Status |
|--------|--------------|---------|--------|
| **catalog** | lib/*, graphql | checkout | ✅ Core |
| **checkout** | lib/*, graphql, **catalog** | cod, stripe, paypal | ✅ Core |
| **customer** | lib/*, graphql | - | ✅ Independent |
| **auth** | lib/*, graphql | - | ✅ Independent |
| **cms** | lib/*, graphql | - | ✅ Independent |
| **setting** | lib/*, graphql | cod, stripe, paypal | ✅ Core |
| **tax** | lib/*, graphql | - | ✅ Independent |
| **promotion** | lib/*, graphql | - | ✅ Independent |
| **oms** | lib/*, graphql | stripe, paypal | ✅ Core |
| **cod** | lib/*, **checkout**, **setting** | - | ⚠️ Dependent |
| **stripe** | lib/*, **checkout**, **setting**, **oms** | - | ⚠️ Dependent |
| **paypal** | lib/*, **checkout**, **setting**, **oms** | - | ⚠️ Dependent |

## 🔍 Inter-Module Imports (Exact Locations)

### checkout → catalog
```typescript
// packages/evershop/src/modules/checkout/bootstrap.ts:5
import { getProductsBaseQuery } from '../catalog/services/getProductsBaseQuery.js';
```

### cod → checkout
```javascript
// packages/evershop/src/modules/cod/bootstrap.js:4
import { registerPaymentMethod } from '../checkout/services/getAvailablePaymentMethods.js';
```

### cod → setting
```javascript
// packages/evershop/src/modules/cod/bootstrap.js:3
import { getSetting } from '../../modules/setting/services/setting.js';
```

### stripe → checkout
```javascript
// packages/evershop/src/modules/stripe/bootstrap.js:5
import { registerPaymentMethod } from '../checkout/services/getAvailablePaymentMethods.js';
```

### stripe → setting
```javascript
// packages/evershop/src/modules/stripe/bootstrap.js:6
import { getSetting } from '../setting/services/setting.js';
```

### stripe → oms
```javascript
// packages/evershop/src/modules/stripe/bootstrap.js:1
import config from 'config';
// Uses: config.util.setModuleDefaults('oms', authorizedPaymentStatus)
```

### paypal → checkout
```javascript
// packages/evershop/src/modules/paypal/bootstrap.js:4
import { registerPaymentMethod } from '../checkout/services/getAvailablePaymentMethods.js';
```

### paypal → setting
```javascript
// packages/evershop/src/modules/paypal/bootstrap.js:5
import { getSetting } from '../setting/services/setting.js';
```

### paypal → oms
```javascript
// packages/evershop/src/modules/paypal/bootstrap.js:1
import config from 'config';
// Uses: config.util.setModuleDefaults('oms', {...})
```

## 🚀 Safe Deployment Order

**Phase 1 - Foundation** (No inter-module deps)
```
1. base/
2. setting/
3. graphql/ (shared)
```

**Phase 2 - Core Modules** (Independent)
```
4. catalog
5. customer
6. auth
7. cms
8. tax
9. promotion
10. oms
```

**Phase 3 - Dependent Modules**
```
11. checkout (depends on: catalog)
12. cod (depends on: checkout, setting)
13. stripe (depends on: checkout, setting, oms)
14. paypal (depends on: checkout, setting, oms)
```

## ⚠️ Key Issues to Address Before Splitting

### 1. **Circular Dependencies Check**
- ✅ NO circular dependencies found
- Safe to split

### 2. **Shared Code That Must Stay Together**
- `lib/util/registry.js` - Plugin system (all modules use)
- `lib/util/hookable.js` - Hook system (all modules use)
- `lib/widget/widgetManager.js` - Widget system
- GraphQL services and types

### 3. **Breaking Points**

#### **checkout.services/getAvailablePaymentMethods.js** (CRITICAL)
- Registers payment methods
- **Used by**: cod, stripe, paypal
- **Action**: Export as public API, version it

#### **setting.services/getSetting** (CRITICAL)
- Gets configuration values
- **Used by**: cod, stripe, paypal
- **Action**: Export as public API, version it

#### **catalog.services/getProductsBaseQuery** (CRITICAL)
- Base product query
- **Used by**: checkout
- **Action**: Export as public API, version it

### 4. **Configuration & Database**
- All modules share **same PostgreSQL** instance
- All modules register via **Registry API** (not directly calling each other)
- Configuration via **config module** is centralized
- **Action**: Keep DB migrations per module, but coordinated

## 📦 Versioning Strategy

Suggest Semantic Versioning per module:
```
@evershop/catalog@1.0.0
@evershop/checkout@1.0.0
@evershop/customer@1.0.0
@evershop/auth@1.0.0
@evershop/cms@1.0.0
@evershop/setting@1.0.0
@evershop/cod@1.0.0
@evershop/stripe@1.0.0
@evershop/paypal@1.0.0
...
```

**Version Pinning in main app**:
```json
{
  "dependencies": {
    "@evershop/catalog": "^1.0.0",
    "@evershop/checkout": "^1.0.0",
    "@evershop/customer": "^1.0.0",
    "@evershop/cod": "^1.0.0",
    "@evershop/stripe": "^1.0.0"
  }
}
```

## 🔗 GitHub Branch Strategy

```
main (production)
├── module/catalog
├── module/checkout
├── module/cms
├── module/customer
├── module/auth
├── module/cod
├── module/stripe
├── module/paypal
├── module/setting
├── module/oms
├── module/tax
├── module/promotion
└── shared/base
    shared/lib
    shared/graphql
```

Each feature → branch → PR → test → merge to module/* → auto-tag → CI/CD deploy

## ✅ Recommendation Summary

**Safe to Split:**
- ✅ No circular dependencies
- ✅ Registry pattern allows loose coupling
- ✅ Clear breaking points identified
- ✅ Shared code identified

**Next Steps:**
1. Create npm package.json for each module
2. Extract shared utilities
3. Define public APIs with versioning
4. Create GitHub Actions workflow per module
5. Setup database migration strategy
