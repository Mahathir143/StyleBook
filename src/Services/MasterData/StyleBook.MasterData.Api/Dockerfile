FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/BuildingBlocks/StyleBook.Shared/StyleBook.Shared.csproj", "src/BuildingBlocks/StyleBook.Shared/"]
COPY ["src/Services/MasterData/StyleBook.MasterData.Api/StyleBook.MasterData.Api.csproj", "src/Services/MasterData/StyleBook.MasterData.Api/"]
RUN dotnet restore "src/Services/MasterData/StyleBook.MasterData.Api/StyleBook.MasterData.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/MasterData/StyleBook.MasterData.Api"
RUN dotnet build "StyleBook.MasterData.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "StyleBook.MasterData.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StyleBook.MasterData.Api.dll"]
