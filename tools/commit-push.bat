@echo off
setlocal enabledelayedexpansion
echo 🚀 Automatic Commit and Push...

:: Check if we are in a git repository
if not exist ".git" (
    echo ❌ No git repository found
    echo Initialize with: git init
    pause
    exit /b 1
)

:: Add all files
echo 📁 Adding files...
git add .

:: Detect changes and suggest commit message
echo 🔍 Analyzing changes with git status...
git status --porcelain > temp_status.txt

:: Show what git status detected
echo 📋 Changes detected:
type temp_status.txt

:: Check for different types of changes
findstr /C:"package.json" temp_status.txt >nul && set "pkg_changed=1"
findstr /C:".md" temp_status.txt >nul && set "docs_changed=1"
findstr /C:".js" temp_status.txt >nul && set "code_changed=1"
findstr /C:".yml" temp_status.txt >nul && set "workflow_changed=1"
findstr /C:"tools/" temp_status.txt >nul && set "tools_changed=1"

:: Check for version changes in package.json
if defined pkg_changed (
    git diff HEAD package.json | findstr /C:"version" >nul && set "version_changed=1"
)

:: Build dynamic message based on actual files changed
set "changed_files="
for /f "tokens=2*" %%a in (temp_status.txt) do (
    set "file=%%a"
    if defined changed_files (
        set "changed_files=!changed_files!, !file!"
    ) else (
        set "changed_files=!file!"
    )
)

:: Generate dynamic message based on files
set "default_msg=feat: update "
if defined version_changed (
    set "default_msg=release: bump version and update files"
) else if defined pkg_changed (
    set "default_msg=feat: update package.json"
) else if defined docs_changed (
    set "default_msg=docs: update documentation files"
) else if defined code_changed (
    set "default_msg=feat: update core files"
) else if defined workflow_changed (
    set "default_msg=ci: update workflow files"
) else if defined tools_changed (
    set "default_msg=chore: update development tools"
) else (
    set "default_msg=feat: update files"
)

:: Show what was detected with actual files
echo.
echo 🎯 Files to commit: %changed_files%

:: Clean up temp file
del temp_status.txt 2>nul

:: Ask for commit message with smart default
echo.
echo 💡 Suggested: %default_msg%
set /p "message=💬 Commit message (or Enter for suggested): "
if "%message%"=="" set message=%default_msg%

:: Create the commit
echo 📝 Creating commit...
git commit -m "%message%"
if %errorlevel% neq 0 (
    echo ⚠️ No changes to commit or error occurred
)

:: Pull remote changes first to avoid conflicts
echo 🔄 Syncing with remote...
git pull origin main --rebase
if %errorlevel% neq 0 (
    echo ⚠️ Conflict during pull, trying merge strategy...
    git pull origin main
)

:: Push to remote branch
echo 🌐 Pushing to remote branch...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Error during push
    echo Check your connection and remote branch
    pause
    exit /b 1
)

echo ✅ Commit and push successful!
pause
