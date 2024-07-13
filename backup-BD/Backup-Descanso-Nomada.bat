@echo off

:: Definir Variables
set BACKUP_DIR=C:\backups
set DB_NAME=descanso_nomada
set DB_USER=postgres
set DB_PASSWORD=root
set DB_HOST=localhost

:: Formatear la fecha y la hora correctamente
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do (
    set YEAR=%%l
    set MONTH=%%j
    set DAY=%%k
)
for /f "tokens=1-3 delims=:." %%i in ("%time%") do (
    set HOUR=%%i
    set MINUTE=%%j
    set SECOND=%%k
)
set DATE=%YEAR%%MONTH%%DAY%_%HOUR%%MINUTE%%SECOND%
set FILENAME=%BACKUP_DIR%\%DB_NAME%-%DATE%.sql

:: Crear el directorio de backup si no existe
if not exist %BACKUP_DIR% (
    mkdir %BACKUP_DIR%
)

:: Establecer la variable de entorno PGPASSWORD para que pg_dump no solicite la contraseña
set PGPASSWORD=%DB_PASSWORD%

:: Comando de backup
echo Running pg_dump...
pg_dump -U %DB_USER% -h %DB_HOST% %DB_NAME% > %FILENAME%
if %ERRORLEVEL% neq 0 (
    echo pg_dump failed with error code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)

:: Limpiar la variable de entorno PGPASSWORD
set PGPASSWORD=

echo Backup completed successfully.
:: pause
