@echo off
echo 🔄 Fixing sync issue...

echo 📥 Pulling remote changes...
git pull origin main --rebase

if %errorlevel% neq 0 (
    echo ⚠️ Rebase failed, trying merge...
    git pull origin main
)

echo 🌐 Pushing local changes...
git push origin main

if %errorlevel% equ 0 (
    echo ✅ Sync fixed successfully!
) else (
    echo ❌ Still having issues
    echo Try: git status
)

:: Auto-delete this script
del "%~f0"
pause
