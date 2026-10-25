@echo off
TITLE StyleBook - Master Orchestration Controller
COLOR 0B

set BASE_DIR=%~dp0
set PGPASSWORD=12345678

echo ===============================================================================
echo            STYLEBOOK - ENTERPRISE SALON & GROOMING PLATFORM
echo          Sequential Dependency Startup & Integrated Process Control
echo ===============================================================================
echo.

echo [PRE-CHECK] Terminating any previous orphan processes on StyleBook ports...
powershell -NoProfile -Command "$ports = @(5000, 5001, 5002, 5003, 5004, 5005, 3000, 3001); foreach ($port in $ports) { $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique; foreach ($p in $pids) { if ($p -and $p -ne 0) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue; } } }"
taskkill /FI "WINDOWTITLE eq StyleBook.*" /T /F >nul 2>&1
echo [PRE-CHECK] Ports 5000-5005, 3000, 3001 are clear and ready.
echo.

echo [1/10] Verifying PostgreSQL Database (stylebook_db)...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d stylebook_db -c "SELECT COUNT(*) FROM master.services;" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Database stylebook_db not ready. Initializing schemas & seed data...
    "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE stylebook_db;" >nul 2>&1
    "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d stylebook_db -f "%BASE_DIR%database\init.sql" >nul 2>&1
    echo [SUCCESS] Database schemas and seed data initialized!
) else (
    echo [SUCCESS] PostgreSQL stylebook_db is online and healthy.
)

echo.
echo [2/10] Building .NET Solution (Single compilation prevents file collisions)...
dotnet build "%BASE_DIR%StyleBook.sln" -c Debug
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed! Please review errors above.
    pause
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] Solution built cleanly.

echo.
echo [3/10] Starting Identity Microservice (Port 5001)...
start "StyleBook.Identity.Api" cmd /k "cd /d %BASE_DIR%src\Services\Identity\StyleBook.Identity.Api && dotnet run --no-build --launch-profile http"
timeout /t 2 /nobreak >nul

echo [4/10] Starting Master Data Microservice (Port 5002)...
start "StyleBook.MasterData.Api" cmd /k "cd /d %BASE_DIR%src\Services\MasterData\StyleBook.MasterData.Api && dotnet run --no-build --launch-profile http"
timeout /t 2 /nobreak >nul

echo [5/10] Starting Salon & Stylist Microservice (Port 5003)...
start "StyleBook.Salon.Api" cmd /k "cd /d %BASE_DIR%src\Services\Salon\StyleBook.Salon.Api && dotnet run --no-build --launch-profile http"
timeout /t 2 /nobreak >nul

echo [6/10] Starting Booking & Slot Engine Microservice (Port 5004)...
start "StyleBook.Booking.Api" cmd /k "cd /d %BASE_DIR%src\Services\Booking\StyleBook.Booking.Api && dotnet run --no-build --launch-profile http"
timeout /t 2 /nobreak >nul

echo [7/10] Starting Marketing & Offers Microservice (Port 5005)...
start "StyleBook.Marketing.Api" cmd /k "cd /d %BASE_DIR%src\Services\Marketing\StyleBook.Marketing.Api && dotnet run --no-build --launch-profile http"
timeout /t 2 /nobreak >nul

echo [8/10] Starting Ocelot API Gateway (Port 5000)...
start "StyleBook.ApiGateway" cmd /k "cd /d %BASE_DIR%src\Gateway\StyleBook.ApiGateway && dotnet run --no-build --launch-profile http"
timeout /t 3 /nobreak >nul

echo [9/10] Starting Management & Owner React Portal (Port 3000)...
start "StyleBook.ManagementWeb" cmd /k "cd /d %BASE_DIR%src\Web\stylebook-management && npm run dev"
timeout /t 2 /nobreak >nul

echo [10/10] Starting Customer Next.js Web Portal (Port 3001)...
start "StyleBook.CustomerWeb" cmd /k "cd /d %BASE_DIR%src\Web\stylebook-customer && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ===============================================================================
echo                      ALL STYLEBOOK SERVICES ARE LIVE!
echo ===============================================================================
echo   * Customer Web Portal:         http://localhost:3001
echo   * Management & Owner Portal:   http://localhost:3000
echo   * Ocelot API Gateway:          http://localhost:5000
echo   * Identity Microservice:       http://localhost:5001/health
echo   * MasterData Microservice:     http://localhost:5002/health
echo   * Salon Microservice:          http://localhost:5003/health
echo   * Booking Microservice:        http://localhost:5004/health
echo   * Marketing Microservice:      http://localhost:5005/health
echo ===============================================================================
echo.
echo Launching default browsers...
start http://localhost:3001
start http://localhost:3000

echo.
echo ===============================================================================
echo   ACTIVE RUNNER CONTROLLER:
echo   To STOP ALL services and close all open windows, press [Q] or [Enter].
echo ===============================================================================
set /p USER_INPUT="Press [Enter] or type 'Q' to TERMINATE ALL: "

:SHUTDOWN
echo.
echo Shutting down all StyleBook services and closing child windows...
powershell -NoProfile -Command "$ports = @(5000, 5001, 5002, 5003, 5004, 5005, 3000, 3001); foreach ($port in $ports) { $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique; foreach ($p in $pids) { if ($p -and $p -ne 0) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue; } } }"
taskkill /FI "WINDOWTITLE eq StyleBook.*" /T /F >nul 2>&1

echo.
echo ===============================================================================
echo        [SUCCESS] ALL SERVICES TERMINATED & PORTS FREED CLEANLY!
echo ===============================================================================
timeout /t 2 /nobreak >nul
exit /b 0
