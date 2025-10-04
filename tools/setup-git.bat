@echo off
echo 🔧 Git Configuration...

:: Initialize repo if necessary
if not exist ".git" (
    echo 📁 Initializing repository...
    git init
)

:: Add remote origin if not already done
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🌐 Adding remote origin...
    git remote add origin https://github.com/GerardFevill/best-code.git
) else (
    echo ✅ Remote origin already configured
)

:: Create main branch if necessary
git branch -M main

echo ✅ Git configuration completed!
echo.
echo 📋 Next steps:
echo 1. Use tools\commit-push.bat to commit and push
echo 2. Or tools\quick-commit.bat for quick commit
echo.
pause
