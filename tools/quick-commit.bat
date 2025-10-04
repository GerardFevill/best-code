@echo off
echo ⚡ Commit rapide...

:: Version rapide avec message automatique
git add . && git commit -m "feat: update @cosmospark/best-code" && git push

if %errorlevel% equ 0 (
    echo ✅ Push réussi !
) else (
    echo ❌ Erreur lors du commit/push
)

pause
