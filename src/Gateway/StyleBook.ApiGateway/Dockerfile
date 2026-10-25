FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Gateway/StyleBook.ApiGateway/StyleBook.ApiGateway.csproj", "src/Gateway/StyleBook.ApiGateway/"]
RUN dotnet restore "src/Gateway/StyleBook.ApiGateway/StyleBook.ApiGateway.csproj"
COPY . .
WORKDIR "/src/src/Gateway/StyleBook.ApiGateway"
RUN dotnet build "StyleBook.ApiGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "StyleBook.ApiGateway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StyleBook.ApiGateway.dll"]
