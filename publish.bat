@echo off
echo ========================================
echo   Publication de @cosmospark/best-code
echo ========================================
echo.

echo Verification de la connexion npm...
npm whoami
if %errorlevel% neq 0 (
    echo ERREUR: Vous n'etes pas connecte a npm
    echo Executez: npm login
    pause
    exit /b 1
)

echo.
echo Verification des fichiers...
if not exist "package.json" (
    echo ERREUR: package.json introuvable
    pause
    exit /b 1
)

if not exist "index.js" (
    echo ERREUR: index.js introuvable
    pause
    exit /b 1
)

if not exist "README.md" (
    echo ERREUR: README.md introuvable
    pause
    exit /b 1
)

echo.
echo Test du package...
npm start
if %errorlevel% neq 0 (
    echo ERREUR: Le test du package a echoue
    pause
    exit /b 1
)

echo.
echo Verification de la version...
npm version --json

echo.
echo Publication en cours...
npm publish
if %errorlevel% neq 0 (
    echo ERREUR: La publication a echoue
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Publication reussie !
echo ========================================
echo.
echo Votre package est maintenant disponible sur:
echo https://www.npmjs.com/package/@cosmospark/best-code
echo.
echo Installation:
echo npm install @cosmospark/best-code
echo.
pause
