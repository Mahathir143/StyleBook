FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/BuildingBlocks/StyleBook.Shared/StyleBook.Shared.csproj", "src/BuildingBlocks/StyleBook.Shared/"]
COPY ["src/Services/Salon/StyleBook.Salon.Api/StyleBook.Salon.Api.csproj", "src/Services/Salon/StyleBook.Salon.Api/"]
RUN dotnet restore "src/Services/Salon/StyleBook.Salon.Api/StyleBook.Salon.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/Salon/StyleBook.Salon.Api"
RUN dotnet build "StyleBook.Salon.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "StyleBook.Salon.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StyleBook.Salon.Api.dll"]
