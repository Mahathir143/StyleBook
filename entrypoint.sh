#!/bin/bash
set -e

PORT=${PORT:-5000}

echo "=== Starting StyleBook Unified Backend Services ==="

dotnet /app/Identity/StyleBook.Identity.Api.dll --urls "http://127.0.0.1:5001" &
dotnet /app/MasterData/StyleBook.MasterData.Api.dll --urls "http://127.0.0.1:5002" &
dotnet /app/Salon/StyleBook.Salon.Api.dll --urls "http://127.0.0.1:5003" &
dotnet /app/Booking/StyleBook.Booking.Api.dll --urls "http://127.0.0.1:5004" &
dotnet /app/Marketing/StyleBook.Marketing.Api.dll --urls "http://127.0.0.1:5005" &

sleep 3

echo "Starting Ocelot API Gateway on public port $PORT..."
exec dotnet /app/Gateway/StyleBook.ApiGateway.dll --urls "http://0.0.0.0:$PORT"
