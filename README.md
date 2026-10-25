# StyleBook - Enterprise Salon & On-Demand Grooming Platform

An enterprise-grade, cloud-agnostic platform for Salon Chains, Independent Doorstep Stylists, and End Customers.

---

## 🏗️ Architecture & Tech Stack

- **Backend:** .NET 8 Microservices (Clean Architecture, MediatR CQRS, Repository Pattern & Unit of Work, Dependency Injection).
- **API Gateway:** Ocelot API Gateway (Port 5000).
- **Database:** PostgreSQL (`stylebook_db`) with separate relational schemas: `master`, `identity`, `salon`, `booking`, `marketing`.
- **Management & Owner Portal:** React.js (JSX) with Vite + Tailwind CSS (Port 3000).
- **Customer Facing Web:** Next.js (App Router) with SSR/SSG & LocalBusiness SEO schema optimization (Port 3001).
- **Mobile Application:** Cross-platform React Native / Expo for quick bookings and stylist OTP validation.
- **Security Handshake:** Encrypted 6-digit OTP verification upon customer arrival at salon or doorstep.

---

## 📂 Project Structure

```
StyleBook/
├── database/
│   └── init.sql                          <- Schemas & Seed Data (Users, Salons, Services)
├── Doc/
│   ├── Requirement.md                    <- Complete Software Requirements Specification
│   ├── Implementation.html               <- System Implementation Architecture
│   ├── Approach.html                     <- Engineering & Algorithmic Rationale
│   ├── UnitTest.html                     <- Test Matrix & Specifications
│   ├── DeveloperDocument.html            <- Developer Technical Manual
│   └── InitialSetupAndWalkthrowForTesting.html <- Step-by-Step Testing Scenarios
├── src/
│   ├── BuildingBlocks/
│   │   └── StyleBook.Shared/             <- Repositories, Unit of Work, DbContext, JWT Auth
│   ├── Gateway/
│   │   └── StyleBook.ApiGateway/         <- Ocelot API Gateway (Port 5000)
│   ├── Services/
│   │   ├── Identity/StyleBook.Identity.Api/   <- Auth & 3-Tier Scoping (Port 5001)
│   │   ├── MasterData/StyleBook.MasterData.Api/ <- Master Geo & Services (Port 5002)
│   │   ├── Salon/StyleBook.Salon.Api/         <- Salons, Branches, Stylists (Port 5003)
│   │   ├── Booking/StyleBook.Booking.Api/     <- Dynamic Slots, OTP & Bargaining (Port 5004)
│   │   └── Marketing/StyleBook.Marketing.Api/ <- Platform Offers & Announcements (Port 5005)
│   ├── Web/
│   │   ├── stylebook-management/         <- React.js Operations & Owner Portal (Port 3000)
│   │   └── stylebook-customer/           <- Next.js SEO Customer Web (Port 3001)
│   └── Mobile/
│       └── stylebook-mobile/             <- React Native / Expo Pocket App
├── docker-compose.yml                    <- Container orchestration for AWS / Azure
├── run-all.bat                           <- One-click Windows runner
└── README.md
```

---

## 🚀 Quick Start (Local Windows)

### 1-Click Execution:
Double-click `run-all.bat` or run:
```cmd
run-all.bat
```

This will automatically:
1. Verify PostgreSQL connection to `localhost:5432` (`stylebook_db`).
2. Start all 5 .NET microservices in dedicated terminal sessions.
3. Start the Ocelot API Gateway on port 5000.
4. Start the React Management Portal on port 3000.
5. Start the Next.js Customer Web on port 3001 and open them in your browser.

---

## 👥 Seed Test Accounts

All pre-configured seed accounts use the default password: `Password@123`

| Role | Username | Jurisdiction / Focus | Key Capability |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | Global | Complete oversight, commission audits, system configurations |
| **Zonal Manager** | `zonal_mumbai` | Mumbai & Pune | Approves/rejects salon applications, zonal performance |
| **Shop Owner** | `owner_raj` | Glamour Studios (2 Branches) | Add branches, transfer stylists, set negotiable pricing |
| **Independent Stylist**| `owner_priya` | Mumbai City (Doorstep) | Doorstep radius (15km), client booking |
| **Stylist / Barber** | `stylist_arjun` | Bandra West Branch | View schedule, shifts, verify customer check-in OTP |
| **Customer** | `customer_rahul` | Customer | Search, book slots, propose bargains, check-in OTP |

---

## ☁️ Cloud Deployment (AWS & Azure)

### Using Docker Compose
```bash
docker-compose up --build -d
```

### Deploying to AWS
- **Database:** Amazon RDS for PostgreSQL.
- **Compute:** AWS ECS (Fargate) or EKS using the provided multi-stage `Dockerfile`s.
- **Load Balancer:** AWS Application Load Balancer routing to Port 5000 (Ocelot) and Port 3001 (Next.js).

### Deploying to Azure
- **Database:** Azure Database for PostgreSQL Flexible Server.
- **Compute:** Azure Container Apps (ACA) or Azure Kubernetes Service (AKS).
- **Ingress:** Azure Front Door / Application Gateway.
