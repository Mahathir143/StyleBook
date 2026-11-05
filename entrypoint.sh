#!/bin/bash
PORT=${PORT:-5000}
echo "=== Starting StyleBook Unified Cloud API on port $PORT ==="
exec dotnet StyleBook.ApiGateway.dll --urls "http://0.0.0.0:$PORT"
