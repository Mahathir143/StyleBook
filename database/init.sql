-- =============================================================================
-- StyleBook PostgreSQL Database Initialization Script
-- Database: stylebook_db
-- Region: Tamil Nadu (Ramanathapuram, Puduvalasai, Panaikulam, Ramnad Town, Sakkarakottai)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schemas
DROP SCHEMA IF EXISTS marketing CASCADE;
DROP SCHEMA IF EXISTS booking CASCADE;
DROP SCHEMA IF EXISTS salon CASCADE;
DROP SCHEMA IF EXISTS identity CASCADE;
DROP SCHEMA IF EXISTS master CASCADE;

CREATE SCHEMA IF NOT EXISTS master;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS salon;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS marketing;

-- =============================================================================
-- 1. MASTER SCHEMA
-- =============================================================================

CREATE TABLE IF NOT EXISTS master.countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    iso_code VARCHAR(3) UNIQUE NOT NULL,
    phone_code VARCHAR(10) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master.states (
    id SERIAL PRIMARY KEY,
    country_id INT REFERENCES master.countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS master.zones (
    id SERIAL PRIMARY KEY,
    state_id INT REFERENCES master.states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    zone_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS master.districts (
    id SERIAL PRIMARY KEY,
    zone_id INT REFERENCES master.zones(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS master.service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(500),
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS master.services (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES master.service_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    target_gender VARCHAR(20) DEFAULT 'Unisex', -- Men, Women, Unisex, Kids
    default_duration_minutes INT NOT NULL DEFAULT 30,
    base_market_price NUMERIC(10, 2) DEFAULT 0.00,
    minimum_floor_price NUMERIC(10, 2) DEFAULT 0.00,
    is_doorstep_eligible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS master.work_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- 'IN_SALON', 'DOORSTEP'
    name VARCHAR(100) NOT NULL
);

-- =============================================================================
-- 2. IDENTITY SCHEMA
-- =============================================================================

CREATE TABLE IF NOT EXISTS identity.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(500) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    user_type VARCHAR(50) NOT NULL, -- 'MANAGEMENT', 'OWNER', 'STYLIST', 'CUSTOMER'
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_phone_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS identity.roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS identity.user_roles (
    user_id UUID REFERENCES identity.users(id) ON DELETE CASCADE,
    role_id INT REFERENCES identity.roles(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS identity.user_territory_allocations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES identity.users(id) ON DELETE CASCADE,
    country_id INT REFERENCES master.countries(id),
    state_id INT REFERENCES master.states(id),
    zone_id INT REFERENCES master.zones(id),
    district_id INT REFERENCES master.districts(id),
    brand_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. SALON & STYLIST SCHEMA
-- =============================================================================

CREATE TABLE IF NOT EXISTS salon.salons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES identity.users(id),
    zone_id INT REFERENCES master.zones(id),
    business_type VARCHAR(50) NOT NULL, -- 'SHOP_OWNER', 'INDEPENDENT'
    brand_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100),
    approval_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    approved_by UUID REFERENCES identity.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    poc_name VARCHAR(150),
    poc_phone VARCHAR(20),
    poc_email VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salon.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID REFERENCES salon.salons(id) ON DELETE CASCADE,
    branch_name VARCHAR(200) NOT NULL,
    district_id INT REFERENCES master.districts(id),
    locality VARCHAR(100) NOT NULL, -- Puduvalasai, Panaikulam, Ramnad Town, Sakkarakottai
    address_line TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone_contact VARCHAR(20),
    is_doorstep_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    poc_name VARCHAR(150),
    poc_phone VARCHAR(20),
    poc_email VARCHAR(150),
    poc_role VARCHAR(100) DEFAULT 'Branch In-Charge',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salon.compliance_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID REFERENCES salon.salons(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES salon.branches(id) ON DELETE SET NULL,
    issued_by UUID REFERENCES identity.users(id),
    target_type VARCHAR(50) NOT NULL DEFAULT 'BRANCH', -- 'STYLIST', 'OWNER', 'BRANCH', 'CUSTOMER'
    target_id UUID,
    target_name VARCHAR(150),
    notice_type VARCHAR(50) NOT NULL, -- 'HYGIENE_COMPLAINT', 'PRICE_DISPUTE', 'UNVERIFIED_STAFF', 'OPERATIONAL_VIOLATION'
    subject VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,
    grace_period_hours INT DEFAULT 48,
    status VARCHAR(50) DEFAULT 'NOTICE_ISSUED', -- 'NOTICE_ISSUED', 'OWNER_REPLIED', 'RESOLVED', 'ACTION_TAKEN_INACTIVE'
    owner_reply TEXT,
    owner_replied_at TIMESTAMPTZ,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    action_taken_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS salon.stylist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES identity.users(id) ON DELETE CASCADE,
    salon_id UUID REFERENCES salon.salons(id),
    current_branch_id UUID REFERENCES salon.branches(id),
    is_independent BOOLEAN DEFAULT FALSE,
    specialization VARCHAR(200),
    doorstep_radius_km NUMERIC(5, 2) DEFAULT 0.00,
    doorstep_enabled BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS salon.branch_service_pricing (
    id SERIAL PRIMARY KEY,
    branch_id UUID REFERENCES salon.branches(id) ON DELETE CASCADE,
    service_id INT REFERENCES master.services(id),
    custom_price NUMERIC(10, 2) NOT NULL,
    is_negotiable BOOLEAN DEFAULT FALSE,
    minimum_negotiable_price NUMERIC(10, 2),
    is_offered BOOLEAN DEFAULT TRUE,
    UNIQUE(branch_id, service_id)
);

CREATE TABLE IF NOT EXISTS salon.stylist_service_durations (
    id SERIAL PRIMARY KEY,
    stylist_id UUID REFERENCES salon.stylist_profiles(id) ON DELETE CASCADE,
    service_id INT REFERENCES master.services(id),
    duration_minutes INT NOT NULL,
    is_approved_by_owner BOOLEAN DEFAULT TRUE,
    UNIQUE(stylist_id, service_id)
);

CREATE TABLE IF NOT EXISTS salon.stylist_working_hours (
    id SERIAL PRIMARY KEY,
    stylist_id UUID REFERENCES salon.stylist_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    is_off_day BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS salon.stylist_daily_exceptions (
    id SERIAL PRIMARY KEY,
    stylist_id UUID REFERENCES salon.stylist_profiles(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    lunch_break_start TIME,
    lunch_break_end TIME,
    reason VARCHAR(255),
    is_approved_by_owner BOOLEAN DEFAULT FALSE,
    is_leave BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- 4. BOOKING SCHEMA
-- =============================================================================

CREATE TABLE IF NOT EXISTS booking.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    customer_user_id UUID REFERENCES identity.users(id),
    branch_id UUID REFERENCES salon.branches(id),
    stylist_id UUID REFERENCES salon.stylist_profiles(id),
    work_type VARCHAR(50) NOT NULL, -- 'IN_SALON', 'DOORSTEP'
    customer_doorstep_address TEXT,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    net_payable NUMERIC(10, 2) NOT NULL,
    pricing_model VARCHAR(50) DEFAULT 'FIXED', -- 'FIXED', 'NEGOTIATED'
    status VARCHAR(50) NOT NULL DEFAULT 'PendingConfirmation',
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking.booking_items (
    id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES booking.bookings(id) ON DELETE CASCADE,
    service_id INT REFERENCES master.services(id),
    service_name VARCHAR(150) NOT NULL,
    applied_price NUMERIC(10, 2) NOT NULL,
    duration_minutes INT NOT NULL
);

CREATE TABLE IF NOT EXISTS booking.booking_otps (
    booking_id UUID PRIMARY KEY REFERENCES booking.bookings(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    otp_hash VARCHAR(256) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    retry_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS booking.booking_negotiations (
    id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES booking.bookings(id) ON DELETE CASCADE,
    original_price NUMERIC(10, 2) NOT NULL,
    customer_offer_price NUMERIC(10, 2) NOT NULL,
    owner_counter_price NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'Proposed', -- 'Proposed', 'Accepted', 'Countered', 'Declined'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES booking.bookings(id) ON DELETE CASCADE,
    customer_user_id UUID REFERENCES identity.users(id),
    salon_id UUID REFERENCES salon.salons(id),
    branch_id UUID REFERENCES salon.branches(id),
    stylist_id UUID REFERENCES salon.stylist_profiles(id),
    branch_rating INT CHECK (branch_rating >= 1 AND branch_rating <= 5),
    branch_comment TEXT,
    stylist_rating INT CHECK (stylist_rating >= 1 AND stylist_rating <= 5),
    stylist_comment TEXT,
    owner_reply TEXT,
    is_moderated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. MARKETING & PROMOTIONS SCHEMA
-- =============================================================================

CREATE TABLE IF NOT EXISTS marketing.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_type VARCHAR(50) NOT NULL, -- 'MANAGEMENT', 'SALON_OWNER'
    creator_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL, -- 'PERCENTAGE', 'FLAT'
    discount_value NUMERIC(10, 2) NOT NULL,
    target_audience VARCHAR(50) NOT NULL,
    min_branches_required INT DEFAULT 0,
    promo_code VARCHAR(50),
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_user_id UUID REFERENCES identity.users(id),
    salon_id UUID,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    banner_image_url VARCHAR(500),
    target_audience VARCHAR(50) NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. TAMIL NADU & RAMANATHAPURAM SEED DATA
-- =============================================================================

-- Master Country
INSERT INTO master.countries (id, name, iso_code, phone_code, currency) VALUES 
(1, 'India', 'IND', '+91', 'INR');

-- Master States
INSERT INTO master.states (id, country_id, name, state_code) VALUES 
(1, 1, 'Tamil Nadu', 'TN'),
(2, 1, 'Karnataka', 'KA');

-- Master Zones in Tamil Nadu
INSERT INTO master.zones (id, state_id, name, zone_code) VALUES 
(1, 1, 'Zone 1 - Ramanathapuram Zone', 'ZONE_1_RAMNAD'),
(2, 1, 'Zone 2 - Madurai & South Zone', 'ZONE_2_MADURAI');

-- Master Districts & Towns under Zone 1 (Ramanathapuram)
INSERT INTO master.districts (id, zone_id, name) VALUES 
(1, 1, 'Ramnad Town'),
(2, 1, 'Puduvalasai'),
(3, 1, 'Panaikulam'),
(4, 1, 'Sakkarakottai'),
(5, 1, 'Mandapam / Rameswaram'),
(6, 2, 'Madurai Central');

-- Master Work Types
INSERT INTO master.work_types (id, code, name) VALUES 
(1, 'IN_SALON', 'In-Salon Service (At Branch)'),
(2, 'DOORSTEP', 'Doorstep Service (At Customer Home)');

-- Master Service Categories
INSERT INTO master.service_categories (id, name, icon_url, sort_order) VALUES 
(1, 'Hair Care & Haircut', 'scissors', 1),
(2, 'Shave & Beard Grooming', 'razor', 2),
(3, 'Facial & Skin Whitening', 'sparkles', 3),
(4, 'Bridal Makeup & Mehandi', 'heart', 4),
(5, 'Head & Body Massage', 'heart-pulse', 5);

-- Master Services
INSERT INTO master.services (id, category_id, name, description, target_gender, default_duration_minutes, base_market_price, is_doorstep_eligible) VALUES 
(1, 1, 'Royal Precision Haircut & Wash', 'Professional haircut, cooling shampoo wash and herbal hair tonic.', 'Unisex', 30, 200.00, true),
(2, 1, 'Herbal Hair Spa & Dandruff Care', 'Traditional Tamil Nadu herbal scalp massage, deep steam, and nourishment.', 'Unisex', 45, 650.00, true),
(3, 2, 'Royal Hot Towel Shave', 'Pre-shave sandalwood oil, hot steam towel, precision razor shave & balm.', 'Men', 25, 150.00, true),
(4, 2, 'Beard Shape & Designer Trim', 'Beard styling, contour alignment, and organic oil gloss.', 'Men', 20, 120.00, true),
(5, 3, 'Kesar Gold Glow Facial', 'Saffron & gold leaf herbal extract facial for long-lasting natural radiance.', 'Unisex', 45, 800.00, true),
(6, 4, 'Traditional South Bridal Makeover', 'Complete bridal makeover, saree draping, floral hair styling & mehandi.', 'Women', 90, 3000.00, true),
(7, 5, 'Ayurvedic Head & Shoulder Massage', 'Relaxing warm sesame and brahmi oil massage for stress relief.', 'Unisex', 30, 400.00, true);

-- Roles
INSERT INTO identity.roles (id, code, name, description) VALUES 
(1, 'SUPER_ADMIN', 'Super Admin', 'Platform master administrator with global privileges'),
(2, 'ZONAL_MANAGER', 'Zonal Manager', 'Approves/rejects salons strictly in assigned zone'),
(3, 'SHOP_OWNER', 'Salon Shop Owner', 'Manages physical branches, stylists & pricing'),
(4, 'INDEPENDENT_OWNER', 'Independent Stylist', 'Operates solo home studio or doorstep appointments'),
(5, 'STYLIST', 'Hair Stylist / Barber', 'Executes bookings, adjusts shift timings & verifies customer OTP'),
(6, 'CUSTOMER', 'End Customer', 'Browses salons, books slots, uses coupons, bargains'),
(7, 'ADMIN', 'Regional / State Admin', 'State administrator managing territories, zonal managers and compliance');

-- Seed Users (Password for all: 'Password@123')
INSERT INTO identity.users (id, username, email, phone_number, password_hash, first_name, last_name, user_type) VALUES 
('11111111-1111-1111-1111-111111111111', 'superadmin', 'admin@stylebook.com', '+919999900001', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Super', 'Admin', 'MANAGEMENT'),
('99999999-9999-9999-9999-999999999999', 'admin_tamilnadu', 'admin.tn@stylebook.com', '+919999900009', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Selvakumar', 'State Admin', 'MANAGEMENT'),
('22222222-2222-2222-2222-222222222222', 'zonal_ramnad', 'zonal.ramnad@stylebook.com', '+919999900002', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Murugan', 'Zonal Officer', 'MANAGEMENT'),
('33333333-3333-3333-3333-333333333333', 'owner_anwar', 'anwar.salons@gmail.com', '+919999900003', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Anwar', 'Hussain', 'OWNER'),
('44444444-4444-4444-4444-444444444444', 'owner_kavitha', 'kavitha.beauty@gmail.com', '+919999900004', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Kavitha', 'Praveen', 'OWNER'),
('55555555-5555-5555-5555-555555555555', 'stylist_karthik', 'karthik.barber@gmail.com', '+919999900005', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Karthik', 'Raja', 'STYLIST'),
('66666666-6666-6666-6666-666666666666', 'customer_mohamed', 'mohamed.ramnad@gmail.com', '+919999900006', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Mohamed', 'Irfan', 'CUSTOMER'),
('77777777-7777-7777-7777-777777777777', 'zonal_madurai', 'zonal.madurai@stylebook.com', '+919999900007', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Sundar', 'Madurai Officer', 'MANAGEMENT'),
('88888888-8888-8888-8888-888888888888', 'owner_saravanan', 'saravanan.sakkarakottai@gmail.com', '+919999900008', 'AQAAAAIAAYagAAAAENK60q615v6eL/3n8J+Qf3B30V8y9f6lF5J7rU7p7C4=', 'Saravanan', 'Natarajan', 'OWNER');

-- User Roles Mapping
INSERT INTO identity.user_roles (user_id, role_id) VALUES 
('11111111-1111-1111-1111-111111111111', 1), -- Super Admin
('99999999-9999-9999-9999-999999999999', 7), -- Regional Admin (Tamil Nadu)
('22222222-2222-2222-2222-222222222222', 2), -- Zonal Manager (Zone 1 - Ramanathapuram)
('33333333-3333-3333-3333-333333333333', 3), -- Shop Owner (Anwar)
('44444444-4444-4444-4444-444444444444', 4), -- Independent Owner (Kavitha)
('55555555-5555-5555-5555-555555555555', 5), -- Stylist (Karthik)
('66666666-6666-6666-6666-666666666666', 6), -- Customer (Mohamed)
('77777777-7777-7777-7777-777777777777', 2), -- Zonal Manager (Zone 2 - Madurai)
('88888888-8888-8888-8888-888888888888', 3); -- Shop Owner (Saravanan - Sakkarakottai)

-- Territorial Scoping Allocation:
INSERT INTO identity.user_territory_allocations (user_id, country_id, state_id, zone_id, district_id) VALUES 
('99999999-9999-9999-9999-999999999999', 1, 1, NULL, NULL), -- State Admin: Tamil Nadu
('22222222-2222-2222-2222-222222222222', 1, 1, 1, NULL),    -- Zonal Manager: Zone 1 (Ramanathapuram Zone)
('77777777-7777-7777-7777-777777777777', 1, 1, 2, NULL);    -- Zonal Manager: Zone 2 (Madurai Zone)

-- Seed Salons in Ramanathapuram Zone (Zone 1)
INSERT INTO salon.salons (id, owner_user_id, zone_id, business_type, brand_name, registration_number, approval_status, approved_by, approved_at, rating, total_reviews, is_active, poc_name, poc_phone, poc_email) VALUES 
('aaaa1111-aaaa-1111-aaaa-111111111111', '33333333-3333-3333-3333-333333333333', 1, 'SHOP_OWNER', 'Royal Classic Unisex Salon & Spa', 'TN-RMD-2024-101', 'Approved', '22222222-2222-2222-2222-222222222222', NOW(), 4.90, 86, true, 'Anwar Hussain', '+919443188990', 'poc.ramnad@royalclassic.in'),
('bbbb2222-bbbb-2222-bbbb-222222222222', '44444444-4444-4444-4444-444444444444', 1, 'INDEPENDENT', 'Kavitha Doorstep Bridal & Beauty Care', 'TN-RMD-IND-202', 'Approved', '22222222-2222-2222-2222-222222222222', NOW(), 4.95, 52, true, 'Kavitha Praveen', '+919443188991', 'kavitha.beauty@gmail.com'),
('cccc3333-cccc-3333-cccc-333333333333', '88888888-8888-8888-8888-888888888888', 1, 'SHOP_OWNER', 'Sakkarakottai Heritage Salon & Spa', 'TN-RMD-SKT-303', 'Pending', NULL, NULL, 5.0, 0, true, 'Saravanan Natarajan', '+919443188992', 'saravanan.sakkarakottai@gmail.com');

-- Seed Salon in Zone 2 (Madurai) - Notice: Zonal Officer Murugan will NOT see this!
INSERT INTO salon.salons (id, owner_user_id, zone_id, business_type, brand_name, registration_number, approval_status, approved_by, approved_at, rating, total_reviews, is_active, poc_name, poc_phone, poc_email) VALUES 
('dddd4444-dddd-4444-dddd-444444444444', '11111111-1111-1111-1111-111111111111', 2, 'SHOP_OWNER', 'Madurai Meenakshi Luxury Salon', 'TN-MDU-2024-404', 'Approved', '77777777-7777-7777-7777-777777777777', NOW(), 4.80, 114, true, 'Sundar Rajan', '+919443188993', 'poc.madurai@meenakshisalon.in');

-- Seed Branches for Royal Classic (Ramnad Town & Puduvalasai) with POC Info
INSERT INTO salon.branches (id, salon_id, branch_name, district_id, locality, address_line, latitude, longitude, phone_contact, is_doorstep_enabled, is_active, poc_name, poc_phone, poc_email, poc_role) VALUES 
('b1111111-1111-1111-1111-111111111111', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Royal Classic - Ramnad Town Branch', 1, 'Ramnad Town', 'Opposite Bus Stand, Vandikkara Street, Ramnad Town 623501', 9.3639, 78.8395, '+919842100111', true, true, 'Senthil Nathan', '+919443177111', 'poc.town@royalclassic.in', 'Site Operations Head'),
('b2222222-2222-2222-2222-222222222222', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Royal Classic - Puduvalasai Branch', 2, 'Puduvalasai', 'East Coast Road Junction, Near Post Office, Puduvalasai 623505', 9.4120, 78.8780, '+919842100222', true, true, 'Ilyas Raja', '+919443177222', 'poc.puduvalasai@royalclassic.in', 'Branch In-Charge');

-- Seed Branch for Independent Doorstep (Panaikulam & Sakkarakottai coverage) with POC Info
INSERT INTO salon.branches (id, salon_id, branch_name, district_id, locality, address_line, latitude, longitude, phone_contact, is_doorstep_enabled, is_active, poc_name, poc_phone, poc_email, poc_role) VALUES 
('b3333333-3333-3333-3333-333333333333', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'Kavitha Doorstep Studio (Panaikulam / Sakkarakottai)', 3, 'Panaikulam', 'Doorstep Mobile Service, Covering Panaikulam, Sakkarakottai & Ramnad', 9.3900, 78.8500, '+919842100333', true, true, 'Kavitha Praveen', '+919443188991', 'kavitha.beauty@gmail.com', 'Lead Beautician & POC');

-- Seed Branch for Pending Salon in Sakkarakottai with POC Info
INSERT INTO salon.branches (id, salon_id, branch_name, district_id, locality, address_line, latitude, longitude, phone_contact, is_doorstep_enabled, is_active, poc_name, poc_phone, poc_email, poc_role) VALUES 
('b4444444-4444-4444-4444-444444444444', 'cccc3333-cccc-3333-cccc-333333333333', 'Sakkarakottai Main Branch', 4, 'Sakkarakottai', 'Main Bazar Road, Near Govt Higher Secondary School, Sakkarakottai 623504', 9.3450, 78.8250, '+919842100444', false, true, 'Saravanan Natarajan', '+919443188992', 'saravanan.sakkarakottai@gmail.com', 'Store Manager & POC');

-- Seed Sample Compliance Notice (Management Notice to Owner before Action)
INSERT INTO salon.compliance_notices (id, salon_id, branch_id, issued_by, notice_type, subject, description, grace_period_hours, status, issued_at) VALUES 
('e1111111-1111-1111-1111-111111111111', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'UNVERIFIED_STAFF', 'Stylist Certification & Sanitation Audit', 'Stylist onboarded at Puduvalasai branch requires state sanitation license upload within 48 hours.', 48, 'NOTICE_ISSUED', NOW());

-- Seed Stylist Profiles
INSERT INTO salon.stylist_profiles (id, user_id, salon_id, current_branch_id, is_independent, specialization, doorstep_radius_km, doorstep_enabled, rating, total_reviews) VALUES 
('c1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'b1111111-1111-1111-1111-111111111111', false, 'Master Stylist & Herbal Hair Care Expert', 12.0, true, 4.90, 68),
('c2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'b3333333-3333-3333-3333-333333333333', true, 'Bridal Makeup, Gold Facial & Doorstep Beautician', 15.0, true, 4.95, 52);

-- Branch Pricing Configuration (Fixed vs Negotiable)
INSERT INTO salon.branch_service_pricing (branch_id, service_id, custom_price, is_negotiable, minimum_negotiable_price, is_offered) VALUES 
('b1111111-1111-1111-1111-111111111111', 1, 200.00, false, NULL, true),
('b1111111-1111-1111-1111-111111111111', 2, 700.00, true, 550.00, true),
('b1111111-1111-1111-1111-111111111111', 3, 150.00, false, NULL, true),
('b1111111-1111-1111-1111-111111111111', 4, 120.00, false, NULL, true),
('b1111111-1111-1111-1111-111111111111', 5, 850.00, true, 700.00, true),
('b3333333-3333-3333-3333-333333333333', 6, 2800.00, true, 2200.00, true),
('b3333333-3333-3333-3333-333333333333', 5, 800.00, true, 650.00, true);

-- Stylist Service Duration Overrides (Karthik completes haircut in 25 mins)
INSERT INTO salon.stylist_service_durations (stylist_id, service_id, duration_minutes, is_approved_by_owner) VALUES 
('c1111111-1111-1111-1111-111111111111', 1, 25, true),
('c1111111-1111-1111-1111-111111111111', 2, 40, true);

-- Stylist Working Hours
INSERT INTO salon.stylist_working_hours (stylist_id, day_of_week, start_time, end_time, break_start, break_end, is_off_day) VALUES 
('c1111111-1111-1111-1111-111111111111', 1, '09:00:00', '20:00:00', '13:00:00', '14:00:00', false),
('c1111111-1111-1111-1111-111111111111', 2, '09:00:00', '20:00:00', '13:00:00', '14:00:00', false),
('c1111111-1111-1111-1111-111111111111', 3, '09:00:00', '20:00:00', '13:00:00', '14:00:00', false),
('c1111111-1111-1111-1111-111111111111', 4, '09:00:00', '20:00:00', '13:00:00', '14:00:00', false),
('c1111111-1111-1111-1111-111111111111', 5, '09:00:00', '20:00:00', '13:00:00', '14:00:00', false),
('c1111111-1111-1111-1111-111111111111', 6, '09:00:00', '21:00:00', '14:00:00', '15:00:00', false),
('c1111111-1111-1111-1111-111111111111', 0, '10:00:00', '18:00:00', '13:30:00', '14:30:00', false);

-- Promotional Offers with Coupons
INSERT INTO marketing.offers (creator_type, creator_id, title, description, discount_type, discount_value, target_audience, promo_code, valid_from, valid_to) VALUES 
('MANAGEMENT', '11111111-1111-1111-1111-111111111111', 'Tamil Nadu Launch Special', 'Flat ₹50 OFF on any salon or doorstep appointment across Ramnad district!', 'FLAT', 50.0, 'ALL_CUSTOMERS', 'RAMNAD50', NOW(), NOW() + INTERVAL '60 days'),
('MANAGEMENT', '11111111-1111-1111-1111-111111111111', 'Festive Doorstep Glow', 'Get 15% OFF on doorstep bridal makeover & facials in Puduvalasai & Panaikulam.', 'PERCENTAGE', 15.0, 'ALL_CUSTOMERS', 'FESTIVE15', NOW(), NOW() + INTERVAL '45 days'),
('SALON_OWNER', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Puduvalasai Branch Grand Opening', 'Flat ₹100 discount on herbal hair spa treatment at Royal Classic!', 'FLAT', 100.0, 'ALL_CUSTOMERS', 'ROYAL100', NOW(), NOW() + INTERVAL '30 days');

-- Seed Announcements
INSERT INTO marketing.announcements (sender_user_id, salon_id, title, content, target_audience) VALUES 
('11111111-1111-1111-1111-111111111111', NULL, 'StyleBook Live in Ramanathapuram!', 'We are delighted to bring on-demand salon and doorstep grooming services to Ramnad Town, Puduvalasai, Panaikulam, and Sakkarakottai.', 'GLOBAL');
