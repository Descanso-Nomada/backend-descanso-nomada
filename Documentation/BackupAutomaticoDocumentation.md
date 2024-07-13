# Documentación del Script de Backup

Este script en Batch se utiliza para realizar una copia de seguridad de una base de datos PostgreSQL. A continuación se detalla cada sección del script:

## 1. Definir Variables

```batch
set BACKUP_DIR=C:\backups
set DB_NAME=descanso_nomada
set DB_USER=postgres
set DB_PASSWORD=root
set DB_HOST=localhost
```
- BACKUP_DIR: Directorio donde se almacenarán las copias de seguridad.
- DB_NAME: Nombre de la base de datos que se va a respaldar.
- DB_USER: Usuario de la base de datos.
- DB_PASSWORD: Contraseña del usuario de la base de datos.
- DB_HOST: Host donde está alojada la base de datos.

## 2. Formatear la Fecha y la Hora Correctamente

```batch
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
```

- Esta sección obtiene la fecha y hora actual para usar en el nombre del archivo de la copia de seguridad.
- Se extraen el año, mes y día de la variable %date%.
- Se extraen la hora, minuto y segundo de la variable %time%.
- La variable DATE se establece en el formato YYYYMMDD_HHMMSS.
- La variable FILENAME define el nombre completo del archivo de respaldo, combinando el directorio, el nombre de la base de datos y la fecha/hora.

## 3. Crear el Directorio de Backup si No Existe

```batch
if not exist %BACKUP_DIR% (
    mkdir %BACKUP_DIR%
)
```

Este bloque verifica si el directorio de backup especificado en BACKUP_DIR no existe.
Si el directorio no existe, lo crea usando el comando mkdir.

## 4. Establecer la Variable de Entorno PGPASSWORD

```batch
set PGPASSWORD=%DB_PASSWORD%
```

Establece la variable de entorno PGPASSWORD para evitar que pg_dump solicite la contraseña interactivamente.

## 5. Comando de Backup

```batch
echo Running pg_dump...
pg_dump -U %DB_USER% -h %DB_HOST% %DB_NAME% > %FILENAME%
if %ERRORLEVEL% neq 0 (
    echo pg_dump failed with error code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)
```

El comando pg_dump realiza el respaldo de la base de datos especificada.
La salida del comando se redirige al archivo definido en FILENAME.
Si pg_dump falla (es decir, si ERRORLEVEL no es 0), se muestra un mensaje de error y el script se detiene, mostrando el código de error.

## 6. Limpiar la Variable de Entorno PGPASSWORD

```batch
set PGPASSWORD
```

Limpia la variable de entorno PGPASSWORD para mejorar la seguridad después de que se haya completado el respaldo.

## 7. Mensaje de Confirmación

```batch
echo Backup completed successfully.
```

Muestra un mensaje en la consola indicando que la copia de seguridad se ha completado con éxito.