# 📦 Copy Packages from FullBase

**Bước này cần copy `packages/`, `extensions/`, `themes/`, `public/` từ FullBase vào evershop**

## Windows (PowerShell)

```powershell
# Mở PowerShell tại thư mục project root

# 1. Copy packages/
Copy-Item -Path "DOAN\EVERSHOP\FullBase\evershop-dev\packages" -Destination "DOAN\EVERSHOP\evershop\" -Recurse -Force
Write-Host "✓ packages/ copied"

# 2. Copy extensions/
Copy-Item -Path "DOAN\EVERSHOP\FullBase\evershop-dev\extensions" -Destination "DOAN\EVERSHOP\evershop\" -Recurse -Force
Write-Host "✓ extensions/ copied"

# 3. Copy themes/
Copy-Item -Path "DOAN\EVERSHOP\FullBase\evershop-dev\themes" -Destination "DOAN\EVERSHOP\evershop\" -Recurse -Force
Write-Host "✓ themes/ copied"

# 4. Copy public/
Copy-Item -Path "DOAN\EVERSHOP\FullBase\evershop-dev\public" -Destination "DOAN\EVERSHOP\evershop\" -Recurse -Force
Write-Host "✓ public/ copied"

# 5. Verify
Get-ChildItem "DOAN\EVERSHOP\evershop\" -Directory | Select-Object Name
```

---

## macOS/Linux (Bash)

```bash
# 1. Copy packages/
cp -r DOAN/EVERSHOP/FullBase/evershop-dev/packages DOAN/EVERSHOP/evershop/
echo "✓ packages/ copied"

# 2. Copy extensions/
cp -r DOAN/EVERSHOP/FullBase/evershop-dev/extensions DOAN/EVERSHOP/evershop/
echo "✓ extensions/ copied"

# 3. Copy themes/
cp -r DOAN/EVERSHOP/FullBase/evershop-dev/themes DOAN/EVERSHOP/evershop/
echo "✓ themes/ copied"

# 4. Copy public/
cp -r DOAN/EVERSHOP/FullBase/evershop-dev/public DOAN/EVERSHOP/evershop/
echo "✓ public/ copied"

# 5. Verify
ls -la DOAN/EVERSHOP/evershop/ | grep -E "^d"
```

---

## Verify Success

```bash
# Check if packages exist
ls DOAN/EVERSHOP/evershop/packages/evershop/src/

# Should show: modules, components, bin, etc.
```

---

## Troubleshooting

### If copy fails with permission error:
```powershell
# Run PowerShell as Administrator
# Hoặc dùng File Explorer để copy manually
```

### If you prefer manual copy:
1. Open File Explorer
2. Navigate to: `DOAN\EVERSHOP\FullBase\evershop-dev\`
3. Select: `packages`, `extensions`, `themes`, `public` folders
4. Copy (Ctrl+C)
5. Navigate to: `DOAN\EVERSHOP\evershop\`
6. Paste (Ctrl+V)

---

## Next Steps

After copying packages/, run:

```bash
cd DOAN/EVERSHOP/evershop

# Install dependencies
npm install

# Compile TypeScript
npm run compile
npm run compile:db

# Test
npm run test

# Build
npm run build
```

Then commit everything to GitHub Desktop! ✅
