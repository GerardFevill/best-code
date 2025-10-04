@echo off
echo 🚀 Commit et Push automatique...

:: Vérifier si on est dans un repo git
if not exist ".git" (
    echo ❌ Pas de repository git trouvé
    echo Initialisez avec: git init
    pause
    exit /b 1
)

:: Ajouter tous les fichiers
echo 📁 Ajout des fichiers...
git add .

:: Demander le message de commit ou utiliser un par défaut
set /p "message=💬 Message de commit (ou Entrée pour défaut): "
if "%message%"=="" set message=feat: update package

:: Créer le commit
echo 📝 Création du commit...
git commit -m "%message%"
if %errorlevel% neq 0 (
    echo ⚠️ Aucun changement à commiter ou erreur
)

:: Push vers la branche distante
echo 🌐 Push vers la branche distante...
git push
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push
    echo Vérifiez votre connexion et la branche distante
    pause
    exit /b 1
)

echo ✅ Commit et push réussis !
pause
