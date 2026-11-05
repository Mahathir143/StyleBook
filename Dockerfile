FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY StyleBook.sln ./
COPY src/BuildingBlocks/StyleBook.Shared/*.csproj src/BuildingBlocks/StyleBook.Shared/
COPY src/Gateway/StyleBook.ApiGateway/*.csproj src/Gateway/StyleBook.ApiGateway/
COPY src/Services/Identity/StyleBook.Identity.Api/*.csproj src/Services/Identity/StyleBook.Identity.Api/
COPY src/Services/MasterData/StyleBook.MasterData.Api/*.csproj src/Services/MasterData/StyleBook.MasterData.Api/
COPY src/Services/Salon/StyleBook.Salon.Api/*.csproj src/Services/Salon/StyleBook.Salon.Api/
COPY src/Services/Booking/StyleBook.Booking.Api/*.csproj src/Services/Booking/StyleBook.Booking.Api/
COPY src/Services/Marketing/StyleBook.Marketing.Api/*.csproj src/Services/Marketing/StyleBook.Marketing.Api/

RUN dotnet restore StyleBook.sln

# Copy everything and publish all services
COPY . .
RUN dotnet publish src/Services/Identity/StyleBook.Identity.Api/StyleBook.Identity.Api.csproj -c Release -o /app/Identity
RUN dotnet publish src/Services/MasterData/StyleBook.MasterData.Api/StyleBook.MasterData.Api.csproj -c Release -o /app/MasterData
RUN dotnet publish src/Services/Salon/StyleBook.Salon.Api/StyleBook.Salon.Api.csproj -c Release -o /app/Salon
RUN dotnet publish src/Services/Booking/StyleBook.Booking.Api/StyleBook.Booking.Api.csproj -c Release -o /app/Booking
RUN dotnet publish src/Services/Marketing/StyleBook.Marketing.Api/StyleBook.Marketing.Api.csproj -c Release -o /app/Marketing
RUN dotnet publish src/Gateway/StyleBook.ApiGateway/StyleBook.ApiGateway.csproj -c Release -o /app/Gateway

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y curl bash && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 5000 8080

ENTRYPOINT ["/app/entrypoint.sh"]
