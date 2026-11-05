-- =============================================================================
-- StyleBook PostgreSQL Clean Scratch Initialization Script
-- Target: Neon PostgreSQL (stylebook-db)
-- Preserves ONLY: Master Architecture & Platform Super Admin
-- Deletes: All dummy salons, branches, stylists, services, bookings, wallets, notices
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schemas
CREATE SCHEMA IF NOT EXISTS master;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS salon;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS marketing;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS accounting;

-- Drop all existing tables cleanly with CASCADE
DROP TABLE IF EXISTS accounting.payout_batches CASCADE;
DROP TABLE IF EXISTS accounting.booking_financial_splits CASCADE;
DROP TABLE IF EXISTS accounting.wallet_transactions CASCADE;
DROP TABLE IF EXISTS accounting.owner_wallets CASCADE;
DROP TABLE IF EXISTS billing.owner_subscriptions CASCADE;
DROP TABLE IF EXISTS billing.membership_plans CASCADE;
DROP TABLE IF EXISTS marketing.announcements CASCADE;
DROP TABLE IF EXISTS marketing.offers CASCADE;
DROP TABLE IF EXISTS booking.cancellation_records CASCADE;
DROP TABLE IF EXISTS booking.reschedule_history CASCADE;
DROP TABLE IF EXISTS booking.reviews CASCADE;
DROP TABLE IF EXISTS booking.booking_negotiations CASCADE;
DROP TABLE IF EXISTS booking.booking_otps CASCADE;
DROP TABLE IF EXISTS booking.booking_items CASCADE;
DROP TABLE IF EXISTS booking.bookings CASCADE;
DROP TABLE IF EXISTS salon.entity_approvals CASCADE;
DROP TABLE IF EXISTS salon.stylist_daily_exceptions CASCADE;
DROP TABLE IF EXISTS salon.stylist_working_hours CASCADE;
DROP TABLE IF EXISTS salon.stylist_service_durations CASCADE;
DROP TABLE IF EXISTS salon.branch_service_pricing CASCADE;
DROP TABLE IF EXISTS salon.stylist_profiles CASCADE;
DROP TABLE IF EXISTS salon.compliance_notices CASCADE;
DROP TABLE IF EXISTS salon.branches CASCADE;
DROP TABLE IF EXISTS salon.salons CASCADE;
DROP TABLE IF EXISTS identity.user_territory_allocations CASCADE;
DROP TABLE IF EXISTS identity.user_roles CASCADE;
DROP TABLE IF EXISTS identity.roles CASCADE;
DROP TABLE IF EXISTS identity.users CASCADE;
DROP TABLE IF EXISTS master.services CASCADE;
DROP TABLE IF EXISTS master.service_categories CASCADE;
DROP TABLE IF EXISTS master.work_types CASCADE;
DROP TABLE IF EXISTS master.districts CASCADE;
DROP TABLE IF EXISTS master.zones CASCADE;
DROP TABLE IF EXISTS master.states CASCADE;
DROP TABLE IF EXISTS master.countries CASCADE;

-- -----------------------------------------------------------------------------
-- 1. MASTER TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE master.countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    iso_code VARCHAR(3) NOT NULL UNIQUE,
    phone_code VARCHAR(10) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE master.states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES master.countries(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_state_country UNIQUE (country_id, name)
);

CREATE TABLE master.zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID NOT NULL REFERENCES master.states(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    zone_code VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE master.districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID NOT NULL REFERENCES master.zones(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_district_zone UNIQUE (zone_id, name)
);

CREATE TABLE master.work_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE master.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(500),
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE master.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES master.service_categories(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    target_gender VARCHAR(20) NOT NULL DEFAULT 'UNISEX',
    default_duration_minutes INT NOT NULL DEFAULT 30,
    base_market_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_doorstep_eligible BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_service_category_name UNIQUE (category_id, name)
);

-- -----------------------------------------------------------------------------
-- 2. IDENTITY TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE identity.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE identity.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INT NOT NULL DEFAULT 99,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE identity.user_roles (
    user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES identity.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE identity.user_territory_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    country_id UUID REFERENCES master.countries(id) ON DELETE SET NULL,
    state_id UUID REFERENCES master.states(id) ON DELETE SET NULL,
    zone_id UUID REFERENCES master.zones(id) ON DELETE SET NULL,
    district_id UUID REFERENCES master.districts(id) ON DELETE SET NULL,
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. SALON & STYLIST TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE salon.salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
    zone_id UUID REFERENCES master.zones(id) ON DELETE SET NULL,
    business_type VARCHAR(50) NOT NULL DEFAULT 'SALON_CHAIN',
    brand_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100),
    approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    approved_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    poc_name VARCHAR(150),
    poc_phone VARCHAR(20),
    poc_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE salon.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salon.salons(id) ON DELETE CASCADE,
    branch_name VARCHAR(200) NOT NULL,
    district_id UUID REFERENCES master.districts(id) ON DELETE SET NULL,
    locality VARCHAR(150) NOT NULL,
    address_line TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    phone_contact VARCHAR(20),
    open_time TIME NOT NULL DEFAULT '09:00:00',
    close_time TIME NOT NULL DEFAULT '21:00:00',
    total_chairs INT NOT NULL DEFAULT 3,
    is_doorstep_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    doorstep_radius_km NUMERIC(5, 2) DEFAULT 5.0,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    poc_name VARCHAR(150),
    poc_phone VARCHAR(20),
    poc_email VARCHAR(255),
    poc_role VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE salon.compliance_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salon.salons(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES salon.branches(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES identity.users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL DEFAULT 'BRANCH',
    issued_by UUID NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
    notice_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    grace_period_hours INT NOT NULL DEFAULT 48,
    status VARCHAR(50) NOT NULL DEFAULT 'ISSUED',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE salon.stylist_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    salon_id UUID REFERENCES salon.salons(id) ON DELETE SET NULL,
    current_branch_id UUID REFERENCES salon.branches(id) ON DELETE SET NULL,
    is_independent BOOLEAN NOT NULL DEFAULT FALSE,
    specialization TEXT,
    proof_of_trust_doc VARCHAR(500),
    doorstep_radius_km NUMERIC(5, 2) DEFAULT 0.0,
    doorstep_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE salon.branch_service_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES salon.branches(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES master.services(id) ON DELETE CASCADE,
    custom_price NUMERIC(10, 2) NOT NULL,
    is_negotiable BOOLEAN NOT NULL DEFAULT FALSE,
    minimum_negotiable_price NUMERIC(10, 2) NOT NULL,
    is_offered BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_branch_service UNIQUE (branch_id, service_id)
);

CREATE TABLE salon.stylist_service_durations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stylist_id UUID NOT NULL REFERENCES salon.stylist_profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES master.services(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL DEFAULT 30,
    is_approved_by_owner BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_stylist_service UNIQUE (stylist_id, service_id)
);

CREATE TABLE salon.stylist_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stylist_id UUID NOT NULL REFERENCES salon.stylist_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL,
    start_time TIME NOT NULL DEFAULT '09:00:00',
    end_time TIME NOT NULL DEFAULT '19:00:00',
    break_start TIME DEFAULT '13:00:00',
    break_end TIME DEFAULT '14:00:00',
    is_off_day BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_stylist_day UNIQUE (stylist_id, day_of_week)
);

CREATE TABLE salon.stylist_daily_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stylist_id UUID NOT NULL REFERENCES salon.stylist_profiles(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    reason VARCHAR(255),
    is_available BOOLEAN NOT NULL DEFAULT FALSE,
    start_time TIME,
    end_time TIME
);

CREATE TABLE salon.entity_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    submitted_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. BOOKING TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE booking.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    customer_user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
    salon_id UUID REFERENCES salon.salons(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES salon.branches(id) ON DELETE RESTRICT,
    stylist_id UUID REFERENCES salon.stylist_profiles(id) ON DELETE SET NULL,
    service_mode VARCHAR(50) NOT NULL DEFAULT 'IN_SALON',
    doorstep_address TEXT,
    booking_date DATE NOT NULL,
    scheduled_start_time TIME NOT NULL,
    scheduled_end_time TIME NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    coupon_discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    negotiated_discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_payable_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    checkin_otp VARCHAR(6),
    is_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    otp_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking.booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES master.services(id) ON DELETE RESTRICT,
    price_charged NUMERIC(10, 2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30
);

CREATE TABLE booking.booking_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    otp_purpose VARCHAR(50) NOT NULL DEFAULT 'CHECKIN',
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking.booking_negotiations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(id) ON DELETE CASCADE,
    requested_discount NUMERIC(10, 2) NOT NULL,
    minimum_floor_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(id) ON DELETE CASCADE,
    customer_user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    salon_rating INT CHECK (salon_rating >= 1 AND salon_rating <= 5),
    stylist_rating INT CHECK (stylist_rating >= 1 AND stylist_rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking.reschedule_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(id) ON DELETE CASCADE,
    previous_date DATE NOT NULL,
    previous_start_time TIME NOT NULL,
    new_date DATE NOT NULL,
    new_start_time TIME NOT NULL,
    rescheduled_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    reason TEXT,
    rescheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking.cancellation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(id) ON DELETE CASCADE,
    cancelled_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    cancellation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    refund_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    reason TEXT,
    cancelled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. MARKETING TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE marketing.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_type VARCHAR(50) NOT NULL DEFAULT 'PLATFORM_SUPER_ADMIN',
    creator_id UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL DEFAULT 'FLAT',
    discount_value NUMERIC(10, 2) NOT NULL,
    target_audience VARCHAR(100) DEFAULT 'ALL',
    promo_code VARCHAR(50) NOT NULL UNIQUE,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE marketing.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_user_id UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    salon_id UUID REFERENCES salon.salons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(100) NOT NULL DEFAULT 'ALL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. BILLING & WALLET TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE billing.membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    annual_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_branches INT NOT NULL DEFAULT 1,
    max_stylists INT NOT NULL DEFAULT 5,
    commission_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    has_priority_listing BOOLEAN NOT NULL DEFAULT FALSE,
    has_doorstep_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE billing.owner_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salon.salons(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES billing.membership_plans(id) ON DELETE RESTRICT,
    billing_cycle VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
    amount_paid NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    next_billing_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accounting.owner_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL UNIQUE REFERENCES salon.salons(id) ON DELETE CASCADE,
    current_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pending_clearance_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    security_deposit_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    negative_credit_limit NUMERIC(12, 2) NOT NULL DEFAULT -5000.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accounting.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES accounting.owner_wallets(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES booking.bookings(id) ON DELETE SET NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT,
    counterparty_name VARCHAR(150),
    initiated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accounting.booking_financial_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES booking.bookings(id) ON DELETE CASCADE,
    gross_amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    gst_collected NUMERIC(10, 2) NOT NULL,
    salon_owner_net NUMERIC(10, 2) NOT NULL,
    stylist_commission NUMERIC(10, 2) NOT NULL,
    settlement_status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE accounting.payout_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(100) NOT NULL UNIQUE,
    batch_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    processed_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SEED DATA: MASTER SYSTEM ROLES & PLATFORM SUPER ADMIN ONLY
-- =============================================================================

-- Master Roles
INSERT INTO identity.roles (id, code, name, description, hierarchy_level) VALUES
('r0000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', 'Platform Super Admin', 'Full Global Governance and Operations Control', 1),
('r0000000-0000-0000-0000-000000000002', 'REGIONAL_ADMIN', 'Regional Admin', 'Territorial Administration across Allocated State/District', 2),
('r0000000-0000-0000-0000-000000000003', 'ZONAL_MANAGER', 'Zonal Operations Manager', 'Operational Supervision for Allocated Zone and Salons', 3),
('r0000000-0000-0000-0000-000000000004', 'FINANCE_OFFICER', 'Finance Officer', 'Wallets, Settlements, Ledger & Financial Compliance', 3),
('r0000000-0000-0000-0000-000000000005', 'SHOP_OWNER', 'Salon Shop Owner', 'Branch Management, Stylist Management & Booking Fulfillment', 4),
('r0000000-0000-0000-0000-000000000006', 'INDEPENDENT_OWNER', 'Independent Doorstep Beautician', 'Freelance & Doorstep Grooming Operations', 4),
('r0000000-0000-0000-0000-000000000007', 'STYLIST', 'Salon Stylist', 'Appointment Fulfillment & Client Check-ins', 5),
('r0000000-0000-0000-0000-000000000008', 'CUSTOMER', 'End Customer', 'Browsing, Reservations & Reviewing', 6)
ON CONFLICT (code) DO NOTHING;

-- Master Country & State
INSERT INTO master.countries (id, name, iso_code, phone_code, currency) VALUES
('c1111111-1111-1111-1111-111111111111', 'India', 'IND', '+91', 'INR')
ON CONFLICT (iso_code) DO NOTHING;

INSERT INTO master.states (id, country_id, name, state_code) VALUES
('s1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Tamil Nadu', 'TN')
ON CONFLICT DO NOTHING;

INSERT INTO master.zones (id, state_id, name, zone_code) VALUES
('z1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'South Zone - Zone 1', 'SZ-Z1')
ON CONFLICT DO NOTHING;

INSERT INTO master.districts (id, zone_id, name) VALUES
('d1111111-1111-1111-1111-111111111111', 'z1111111-1111-1111-1111-111111111111', 'Ramanathapuram')
ON CONFLICT DO NOTHING;

-- Master Service Categories
INSERT INTO master.service_categories (id, name, icon_url, sort_order) VALUES
('cat11111-1111-1111-1111-111111111111', 'Hair Care', 'scissors', 1),
('cat22222-2222-2222-2222-222222222222', 'Shave & Beard', 'smile', 2),
('cat33333-3333-3333-3333-333333333333', 'Facial & Glow', 'sparkles', 3),
('cat44444-4444-4444-4444-444444444444', 'Bridal & Makeup', 'heart', 4),
('cat55555-5555-5555-5555-555555555555', 'Head Massage', 'feather', 5)
ON CONFLICT (name) DO NOTHING;

-- Work Types
INSERT INTO master.work_types (id, code, name, description) VALUES
('wt111111-1111-1111-1111-111111111111', 'FULL_TIME', 'Full Time Staff', 'Standard shift hours with fixed salary/guarantee'),
('wt222222-2222-2222-2222-222222222222', 'COMMISSION_ONLY', 'Commission Based Stylist', 'Payout per booking percentage'),
('wt333333-3333-3333-3333-333333333333', 'FREELANCE_DOORSTEP', 'Independent Doorstep Partner', 'Mobile salon beautician with doorstep radius')
ON CONFLICT (code) DO NOTHING;

-- ONLY ONE USER: PLATFORM SUPER ADMIN
INSERT INTO identity.users (id, username, email, phone_number, password_hash, first_name, last_name, user_type, is_active, is_verified) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'superadmin',
  'superadmin@stylebook.io',
  '+919876543210',
  crypt('Super@Style2026!', gen_salt('bf')),
  'Super',
  'Admin',
  'PLATFORM_SUPER_ADMIN',
  TRUE,
  TRUE
)
ON CONFLICT (username) DO NOTHING;

-- Assign SUPER_ADMIN role to superadmin user
INSERT INTO identity.user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 'r0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- DONE: Database is clean and ready. 
-- All dummy salons, branches, stylists, bookings, wallets, and notices are cleared.
-- You can now create your entire hierarchy from scratch as Super Admin.
-- -----------------------------------------------------------------------------
