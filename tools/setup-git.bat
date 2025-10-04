@echo off
echo 🔧 Configuration Git...

:: Initialiser le repo si nécessaire
if not exist ".git" (
    echo 📁 Initialisation du repository...
    git init
)

:: Ajouter le remote origin si pas déjà fait
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🌐 Ajout du remote origin...
    git remote add origin https://github.com/GerardFevill/best-code.git
) else (
    echo ✅ Remote origin déjà configuré
)

:: Créer la branche main si nécessaire
git branch -M main

echo ✅ Configuration Git terminée !
echo.
echo 📋 Prochaines étapes :
echo 1. Utilisez tools\commit-push.bat pour commit et push
echo 2. Ou tools\quick-commit.bat pour un commit rapide
echo.
pause
