FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files for fast restore caching
COPY StyleBook.sln ./
COPY src/BuildingBlocks/StyleBook.Shared/*.csproj src/BuildingBlocks/StyleBook.Shared/
COPY src/Gateway/StyleBook.ApiGateway/*.csproj src/Gateway/StyleBook.ApiGateway/

RUN dotnet restore src/Gateway/StyleBook.ApiGateway/StyleBook.ApiGateway.csproj

# Copy full source and publish
COPY src/BuildingBlocks/StyleBook.Shared/ src/BuildingBlocks/StyleBook.Shared/
COPY src/Gateway/StyleBook.ApiGateway/ src/Gateway/StyleBook.ApiGateway/

RUN dotnet publish src/Gateway/StyleBook.ApiGateway/StyleBook.ApiGateway.csproj -c Release -o /app/publish

# Lean runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Low memory optimizations for cloud free-tier hosting
ENV DOTNET_gcServer=0
ENV DOTNET_TieredPGO=0
ENV DOTNET_EnableWriteXorExecute=0
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 5000 8080 10000

ENTRYPOINT ["./entrypoint.sh"]
