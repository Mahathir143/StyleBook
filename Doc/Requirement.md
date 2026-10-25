# StyleBook - Enterprise Salon & On-Demand Grooming Platform
## Software Requirements Specification (SRS)

---

## 1. Executive Summary
**StyleBook** is an enterprise-grade salon management and on-demand grooming platform tailored for regional and multi-branch operations, independent doorstep and home-studio beauty professionals, and end-customer appointment booking. It features real-time slot synchronization, interactive price bargaining, dynamic coupon code discounts, strict territorial role-based access control (RBAC), and fraud-proof 6-digit OTP verification.

The platform is designed to be cloud-agnostic (deployable seamlessly on **AWS** or **Azure**) while offering effortless local developer orchestration via a single `run-all.bat` script and cleanup via `stop-all.bat`.

---

## 2. Multi-Region Global Geography & Tamil Nadu Seeding
The platform supports hierarchical global scaling from **Country → State → Zone → District**:
- **Country Level:** Global territory entity created exclusively by Level 1 (Super Admin).
- **State Level:** Regional entity created by Country-level administrators (e.g., Tamil Nadu, Karnataka).
- **Zone Level:** Sub-state territory (e.g., South Zone, North Zone, Madurai Division).
- **District / Town Level:** Operational territory created by regional administrators (e.g., Ramanathapuram, Madurai, Chennai).
- **Seeded Regional Focus (Tamil Nadu):**
  - **Ramnad Town:** Commercial hub, premium physical salons and unisex studios (e.g., *Royal Classic Unisex Salon & Spa* at Vandikkara Street).
  - **Puduvalasai:** Coastal locality, home-studio and on-demand doorstep grooming specialists.
  - **Panaikulam:** Bustling town center with doorstep bridal and specialized hair care (e.g., *Kavitha Doorstep Bridal & Beauty Care*).
  - **Sakkarakottai:** Heritage salon hub (e.g., *Sakkarakottai Heritage Salon*).

---

## 3. Hierarchical RBAC & User Downgrade Provisioning

```
Level 1: SUPER ADMIN (Global Platform Master)
   └── Level 2: STATE / COUNTRY ADMIN (State Jurisdiction e.g. Tamil Nadu)
         └── Level 3: ZONAL MANAGER (Zone Jurisdiction e.g. South Zone Ramnad)
               └── Level 4: SALON SHOP OWNER / INDEPENDENT OWNER (Branches & Stylists)
                     └── Level 5: STYLIST / BARBER / BEAUTICIAN (Shifts & Appointments)
```

### 3.1 Role Hierarchy & Creation Rules
1. **Level 1: Super Admin:**
   - Full global visibility and operations across all countries, states, zones, and districts.
   - Creates Countries in Master Geographies.
   - Can provision strictly downgrade users: State Admins (Level 2), Zonal Managers (Level 3), Salon Owners (Level 4), and Stylists (Level 5).
   - Has authority to add Master Services and set Minimum Floor Prices.
2. **Level 2: State / Country Admin:**
   - Full oversight within their allocated state (e.g., Tamil Nadu).
   - Creates States, Zones, and Districts in Master Geographies.
   - Can provision strictly downgrade users: Zonal Managers (Level 3), Salon Owners (Level 4), and Stylists (Level 5) within their territory.
   - Can set Minimum Floor Prices of services in their jurisdiction.
   - Can Make Active or DeActive any Services, Stylists, or Branches; only **Active** items reflect in Customer and Management portals.
3. **Level 3: Zonal Manager:**
   - Full oversight within their assigned zone (e.g., South Zone - Ramanathapuram).
   - Can provision strictly downgrade users: Salon Owners (Level 4) and Stylists (Level 5) within their zone.
   - Can approve or reject salon onboarding applications strictly within their zone.
   - Can set Minimum Floor Prices of services and toggle Active / DeActive on Services, Stylists, and Branches in their zone.
4. **Level 4: Salon Shop Owner / Independent Owner:**
   - Onboarded by Zonal Managers; owns branch and stylist operational management.
   - Chooses Country → State → Zone → District when creating new branches.
   - Selects which services are offered in each branch.
   - Multi-selects services (skill sets) for Stylists during onboarding and can transfer Stylists between branches.
   - Assigns stylists for "Any Stylist" customer booking requests.
   - Exclusively conducts Booking Management ("Verify and Start" via 6-digit OTP) and Shift Timing Adjustments with Stylists.
5. **Level 5: Stylist / Barber / Beautician:**
   - Can select or deselect their supported services (skill set).
   - Can request Shift Timing Adjustments.
   - Manages personal bookings and performs 6-digit OTP verification upon customer arrival.

---

## 4. Customer-Facing Discovery & Booking Architecture

### 4.1 Smart Search on Landing Page
- Unified global search engine querying across:
  - Brand name (e.g., *Royal Classic*, *Kavitha Beauty Studio*)
  - Salon / Branch name (e.g., *Ramnad Town Branch*, *Puduvalasai Branch*)
  - Stylist name (e.g., *Karthik Raja*, *Kavitha Praveen*, *Saravanan Natarajan*)
  - Country, State, District, Zone, City / Locality (*India*, *Tamil Nadu*, *Ramanathapuram*, *Ramnad Town*, *Puduvalasai*, *Panaikulam*, *Sakkarakottai*)
  - Service name (*Haircut*, *Herbal Hair Spa*, *Hot Towel Shave*, *Bridal Makeover*, *Facial*)
  - Service category (*Hair Care*, *Shave & Beard*, *Facial & Glow*, *Bridal*, *Head Massage*)
- Interactive filter combinations: In-Salon vs Doorstep / Home service, Locality chips, Category chips, and Budget price ranges.

### 4.2 Dynamic Discovery Sections (Horizontal Scrollable Carousels)
- **Trending Salons:** Top trending brands with rating, reviews count, doorstep radius, locality badges, and quick book button.
- **Top-Rated Branches:** Branch photos, address, assigned stylists count, rating, and "Book at Branch" button.
- **Popular Services:** Category tag, service title, duration, price, floor price / bargain indicator, and "Book Service" button.
- **Top-Rated Stylists:** Stylist avatar, designation, rating, reviews count, assigned branch locations, skill badges, and "Book Stylist" button.
- **Doorstep Service Providers:** Specialized home-visit beauticians with coverage radius and doorstep reservation.

### 4.3 Two Booking Entry Points & Strict Relational Matrix
1. **Entry Point 1: Choose a Branch (Branch-First Flow)**
   - Customer selects or views Branch Profile.
   - Displays *only* the services offered at that branch.
   - Stylist selection displays stylists assigned to that branch who can perform the selected service, PLUS an **"Any Available Stylist"** option.
   - *Confirmation Logic:* If customer chooses "Any Available Stylist", confirmation and stylist assignment are managed by the Salon Owner. If customer chooses a specific stylist, confirmation is handled directly by that stylist or the branch owner.
   - Selects Date & Time Slot -> Reviews Pricing & Coupons -> Confirms Booking -> 6-Digit OTP generated.
2. **Entry Point 2: Choose a Stylist (Stylist-First Flow)**
   - Customer selects or views Stylist Profile.
   - Displays *only* supported services that the stylist is certified to perform.
   - Displays *only* eligible branches where that stylist is currently assigned.
   - Selects Service Mode (In-Salon vs Doorstep) -> Selects Date & Slot -> Reviews Pricing & Coupons -> Confirms Booking.

---

## 5. Dual Customer Review & Rating System
- For completed appointments (`status === 'Completed'`), customer can click **"⭐ Leave Review / Rate"**.
- Form requires separate 1-5 star ratings and written comments for:
  1. **The Salon Branch** (cleanliness, ambiance, waiting time, equipment).
  2. **The Stylist** (cutting precision, friendliness, skill, attentiveness).
- **Duplicate Prevention:** Database enforces `UNIQUE(booking_id)` constraint on `booking.reviews` to guarantee that only one review is submitted per appointment.
- **Display:** Aggregated average ratings, total review counts, and customer feedback are displayed on Branch cards and Stylist cards.
- **Governance:** Supports verified customer badges, moderation status, and owner replies.

---

## 6. Targeted Governance, Compliance & Notices
- Compliance notices can be specifically targeted to:
  - `STYLIST`: Notice delivered directly to the stylist's dashboard.
  - `OWNER`: Notice delivered to the salon owner's management dashboard.
  - `BRANCH`: Operational directive displayed on the branch's page.
  - `CUSTOMER`: Public health, hygiene, and operating notice displayed on the customer home page.

---

## 7. Customer & Help Desk POC Directory
- Accessible via the **Contact Us** view:
  - **Store Operations Head (Manager POC):** Direct line for appointment assistance and shop inquiries.
  - **Territorial Admin POC:** Escalations, regional compliance, and safety inquiries.
  - **Accounts & Billing POC:** Invoices, refunds, and promo code support.
  - Direct telephone numbers and email addresses displayed with importance indicators.
