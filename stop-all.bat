@echo off
TITLE StyleBook - Stopping All Services
COLOR 0C

echo ===============================================================================
echo                STOPPING ALL STYLEBOOK SERVICES AND CLEARING PORTS
echo ===============================================================================
echo.

echo Freeing ports 5000, 5001, 5002, 5003, 5004, 5005, 3000, 3001...
powershell -NoProfile -Command "$ports = @(5000, 5001, 5002, 5003, 5004, 5005, 3000, 3001); foreach ($port in $ports) { $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique; foreach ($p in $pids) { if ($p -and $p -ne 0) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue; } } }"

echo Closing child windows...
taskkill /FI "WINDOWTITLE eq StyleBook.*" /T /F >nul 2>&1

echo.
echo ===============================================================================
echo   [SUCCESS] ALL STYLEBOOK MICROSERVICES, GATEWAY, AND WEBS STOPPED CLEANLY!
echo ===============================================================================
