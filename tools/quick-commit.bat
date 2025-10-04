@echo off
echo ⚡ Quick commit...

:: Add files first
git add .

:: Detect changes with git diff
echo 🔍 Analyzing changes with git diff...
git diff --name-only HEAD > temp_diff.txt
git diff --cached --name-only >> temp_diff.txt

:: Check for different types of changes
findstr /C:"package.json" temp_diff.txt >nul && set "pkg_changed=1"
findstr /C:".md" temp_diff.txt >nul && set "docs_changed=1"
findstr /C:".js" temp_diff.txt >nul && set "code_changed=1"
findstr /C:".yml" temp_diff.txt >nul && set "workflow_changed=1"
findstr /C:"tools/" temp_diff.txt >nul && set "tools_changed=1"

:: Check for version changes in package.json
if defined pkg_changed (
    git diff HEAD package.json | findstr /C:"version" >nul && set "version_changed=1"
)

:: Generate smart message based on actual changes
set "commit_msg=feat: update @cosmospark/best-code"
if defined version_changed set "commit_msg=release: bump version to latest"
if defined pkg_changed if not defined version_changed set "commit_msg=feat: update package configuration"
if defined docs_changed set "commit_msg=docs: update documentation"
if defined code_changed set "commit_msg=feat: update core functionality"
if defined workflow_changed set "commit_msg=ci: update deployment workflow"
if defined tools_changed set "commit_msg=chore: update development tools"

:: Clean up
del temp_diff.txt 2>nul

:: Commit and push with smart message
echo 💡 Using: %commit_msg%
git commit -m "%commit_msg%" && git push

if %errorlevel% equ 0 (
    echo ✅ Push successful!
) else (
    echo ❌ Error during commit/push
)

pause
