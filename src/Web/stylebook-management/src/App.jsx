import React, { useState } from 'react';
import { 
  ShieldCheck, Store, Scissors, Calendar, Tag, Bell, CheckCircle2, 
  XCircle, Clock, MapPin, UserCheck, Phone, DollarSign, LogOut, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw, Smartphone, Key, Plus, Lock, User,
  FileText, AlertTriangle, Users, Building, Send, Check, ShieldAlert, Globe, ArrowLeftRight, HelpCircle, Mail,
  Wallet, CreditCard, CheckSquare, XSquare, Eye
} from 'lucide-react';

// Pre-configured Test Users with Strict Hierarchy & Territorial Scoping
const PRESET_USERS = [
  { 
    username: 'superadmin', 
    label: '1. Super Admin (Global Platform Master)', 
    role: 'SUPER_ADMIN', 
    type: 'MANAGEMENT', 
    name: 'Global Platform Admin', 
    jurisdiction: 'Global (All Countries & Regions)',
    hierarchyLevel: 1,
    zoneId: null
  },
  { 
    username: 'admin_tamilnadu', 
    label: '2. Regional Admin (Tamil Nadu State)', 
    role: 'ADMIN', 
    type: 'MANAGEMENT', 
    name: 'Selvakumar (State Admin)', 
    jurisdiction: 'Tamil Nadu State (All Zones & Districts)',
    hierarchyLevel: 2,
    zoneId: null
  },
  { 
    username: 'zonal_ramnad', 
    label: '3. Zonal Manager - Zone 1 (Ramanathapuram)', 
    role: 'ZONAL_MANAGER', 
    type: 'MANAGEMENT', 
    name: 'Murugan (Zonal Officer)', 
    jurisdiction: 'Zone 1 - Ramanathapuram (Ramnad Town, Puduvalasai, Panaikulam, Sakkarakottai)',
    hierarchyLevel: 3,
    zoneId: 1
  },
  { 
    username: 'owner_anwar', 
    label: '4. Shop Owner (Royal Classic Studios)', 
    role: 'SHOP_OWNER', 
    type: 'OWNER', 
    name: 'Anwar Hussain', 
    salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
    salon: 'Royal Classic Unisex Salon & Spa (Ramnad Town & Puduvalasai)',
    hierarchyLevel: 4,
    zoneId: 1
  },
  { 
    username: 'owner_kavitha', 
    label: '4. Independent Doorstep Beautician', 
    role: 'INDEPENDENT_OWNER', 
    type: 'OWNER', 
    name: 'Kavitha Praveen', 
    salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
    salon: 'Kavitha Doorstep Bridal & Beauty Care (Panaikulam / Sakkarakottai)',
    hierarchyLevel: 4,
    zoneId: 1
  },
  { 
    username: 'stylist_karthik', 
    label: '5. Stylist (Royal Classic Ramnad)', 
    role: 'STYLIST', 
    type: 'STYLIST', 
    name: 'Karthik Raja', 
    stylistId: 'c1111111-1111-1111-1111-111111111111',
    salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
    salon: 'Royal Classic - Ramnad Town Branch',
    hierarchyLevel: 5,
    zoneId: 1
  },
  { 
    username: 'zonal_madurai', 
    label: '3. Zonal Manager - Zone 2 (Madurai)', 
    role: 'ZONAL_MANAGER', 
    type: 'MANAGEMENT', 
    name: 'Sundar (Madurai Zonal Officer)', 
    jurisdiction: 'Zone 2 - Madurai & South Zone',
    hierarchyLevel: 3,
    zoneId: 2
  }
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isDevMode, setIsDevMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Modals
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showAddStylistModal, setShowAddStylistModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showShiftAdjustmentModal, setShowShiftAdjustmentModal] = useState(false);
  const [showTransferStylistModal, setShowTransferStylistModal] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showIssueNoticeModal, setShowIssueNoticeModal] = useState(false);
  const [showOwnerReplyModal, setShowOwnerReplyModal] = useState(null);
  const [showCreateGeoModal, setShowCreateGeoModal] = useState(false);
  const [showTopUpWalletModal, setShowTopUpWalletModal] = useState(false);

  // 1. Master Geographies
  const [countries, setCountries] = useState([
    { id: 1, name: 'India', iso: 'IND', phoneCode: '+91' },
    { id: 2, name: 'United Arab Emirates', iso: 'ARE', phoneCode: '+971' },
    { id: 3, name: 'United Kingdom', iso: 'GBR', phoneCode: '+44' }
  ]);

  const [states, setStates] = useState([
    { id: 1, countryId: 1, name: 'Tamil Nadu', code: 'TN' },
    { id: 2, countryId: 1, name: 'Karnataka', code: 'KA' },
    { id: 3, countryId: 1, name: 'Maharashtra', code: 'MH' }
  ]);

  const [zones, setZones] = useState([
    { id: 1, stateId: 1, name: 'Zone 1 - Ramanathapuram Zone' },
    { id: 2, stateId: 1, name: 'Zone 2 - Madurai & South Zone' },
    { id: 3, stateId: 1, name: 'Zone 3 - Chennai Metro' }
  ]);

  const [districts, setDistricts] = useState([
    { id: 1, zoneId: 1, name: 'Ramnad Town' },
    { id: 2, zoneId: 1, name: 'Puduvalasai' },
    { id: 3, zoneId: 1, name: 'Panaikulam' },
    { id: 4, zoneId: 1, name: 'Sakkarakottai' },
    { id: 5, zoneId: 1, name: 'Mandapam / Rameswaram' },
    { id: 6, zoneId: 2, name: 'Madurai Central' }
  ]);

  // Master & Custom Services Catalog (Includes Owner Custom Services with Approval Status)
  const [masterServices, setMasterServices] = useState([
    { id: 1, name: 'Royal Precision Haircut & Wash', category: 'Hair Care', duration: 30, basePrice: 200, minFloorPrice: 150, approvalStatus: 'Approved', isActive: true },
    { id: 2, name: 'Herbal Hair Spa & Dandruff Care', category: 'Hair Care', duration: 45, basePrice: 650, minFloorPrice: 500, approvalStatus: 'Approved', isActive: true },
    { id: 3, name: 'Royal Hot Towel Shave', category: 'Shave & Beard', duration: 25, basePrice: 150, minFloorPrice: 100, approvalStatus: 'Approved', isActive: true },
    { id: 4, name: 'Beard Shape & Designer Trim', category: 'Shave & Beard', duration: 20, basePrice: 120, minFloorPrice: 90, approvalStatus: 'Approved', isActive: true },
    { id: 5, name: 'Kesar Gold Glow Facial', category: 'Facial & Glow', duration: 45, basePrice: 800, minFloorPrice: 650, approvalStatus: 'Approved', isActive: true },
    { id: 6, name: 'Traditional South Bridal Makeover', category: 'Bridal', duration: 90, basePrice: 3000, minFloorPrice: 2000, approvalStatus: 'Approved', isActive: true },
    { id: 7, name: 'Ayurvedic Head & Shoulder Massage', category: 'Head Massage', duration: 30, basePrice: 400, minFloorPrice: 300, approvalStatus: 'Approved', isActive: true },
    // Custom Service submitted by Owner (Pending Zonal Manager Review!)
    { 
      id: 8, 
      name: 'Moroccan Argan Oil Hair Keratin Repair', 
      category: 'Hair Care', 
      duration: 60, 
      basePrice: 1200, 
      minFloorPrice: 950, 
      customPrice: 1100, 
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111', 
      submittedBy: 'Anwar Hussain (Royal Classic)',
      targetBranchName: 'Ramnad Town Branch',
      approvalStatus: 'Pending_Approval', 
      isActive: true 
    }
  ]);

  // Salons (Includes Pending Salon in Sakkarakottai)
  const [salons, setSalons] = useState([
    {
      id: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      brandName: 'Royal Classic Unisex Salon & Spa',
      businessType: 'SHOP_OWNER',
      ownerUserId: '33333333-3333-3333-3333-333333333333',
      ownerName: 'Anwar Hussain',
      zoneId: 1,
      zoneName: 'Zone 1 - Ramanathapuram',
      locality: 'Ramnad Town & Puduvalasai',
      status: 'Approved',
      isActive: true,
      pocName: 'Anwar Hussain',
      pocPhone: '+91 94431 88990',
      pocEmail: 'poc.ramnad@royalclassic.in'
    },
    {
      id: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      brandName: 'Kavitha Doorstep Bridal & Beauty Care',
      businessType: 'INDEPENDENT',
      ownerUserId: '44444444-4444-4444-4444-444444444444',
      ownerName: 'Kavitha Praveen',
      zoneId: 1,
      zoneName: 'Zone 1 - Ramanathapuram',
      locality: 'Panaikulam & Sakkarakottai (Doorstep)',
      status: 'Approved',
      isActive: true,
      pocName: 'Kavitha Praveen',
      pocPhone: '+91 94431 88991',
      pocEmail: 'kavitha.beauty@gmail.com'
    },
    {
      id: 'cccc3333-cccc-3333-cccc-333333333333',
      brandName: 'Sakkarakottai Heritage Salon & Spa',
      businessType: 'SHOP_OWNER',
      ownerUserId: '88888888-8888-8888-8888-888888888888',
      ownerName: 'Saravanan Natarajan',
      zoneId: 1,
      zoneName: 'Zone 1 - Ramanathapuram',
      locality: 'Sakkarakottai Main Road',
      status: 'Pending',
      rejectionReason: null,
      isActive: true,
      pocName: 'Saravanan Natarajan',
      pocPhone: '+91 94431 88992',
      pocEmail: 'saravanan.sakkarakottai@gmail.com'
    },
    {
      id: 'dddd4444-dddd-4444-dddd-444444444444',
      brandName: 'Madurai Meenakshi Luxury Salon',
      businessType: 'SHOP_OWNER',
      ownerUserId: '11111111-1111-1111-1111-111111111111',
      ownerName: 'Sundar Rajan',
      zoneId: 2,
      zoneName: 'Zone 2 - Madurai & South Zone',
      locality: 'Madurai Central',
      status: 'Approved',
      isActive: true,
      pocName: 'Sundar Rajan',
      pocPhone: '+91 94431 88993',
      pocEmail: 'poc.madurai@meenakshisalon.in'
    }
  ]);

  // Branches
  const [branches, setBranches] = useState([
    {
      id: 'b1111111-1111-1111-1111-111111111111',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      branchName: 'Royal Classic - Ramnad Town Branch',
      countryId: 1, stateId: 1, zoneId: 1, districtId: 1,
      country: 'India', state: 'Tamil Nadu', zone: 'Zone 1 - Ramanathapuram', district: 'Ramnad Town',
      locality: 'Ramnad Town',
      addressLine: 'Opposite Bus Stand, Vandikkara Street, Ramnad Town 623501',
      phoneContact: '+91 98421 00111',
      isDoorstepEnabled: true,
      status: 'Approved',
      isActive: true,
      pocName: 'Senthil Nathan',
      pocPhone: '+91 94431 77111',
      pocEmail: 'poc.town@royalclassic.in',
      pocRole: 'Site Operations Head',
      offeredServiceIds: [1, 2, 3, 4, 5]
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      branchName: 'Royal Classic - Puduvalasai Branch',
      countryId: 1, stateId: 1, zoneId: 1, districtId: 2,
      country: 'India', state: 'Tamil Nadu', zone: 'Zone 1 - Ramanathapuram', district: 'Puduvalasai',
      locality: 'Puduvalasai',
      addressLine: 'East Coast Road Junction, Near Post Office, Puduvalasai 623505',
      phoneContact: '+91 98421 00222',
      isDoorstepEnabled: true,
      status: 'Approved',
      isActive: true,
      pocName: 'Ilyas Raja',
      pocPhone: '+91 94431 77222',
      pocEmail: 'poc.puduvalasai@royalclassic.in',
      pocRole: 'Branch In-Charge',
      offeredServiceIds: [1, 3, 4]
    },
    {
      id: 'b3333333-3333-3333-3333-333333333333',
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      salonName: 'Kavitha Doorstep Bridal & Beauty Care',
      branchName: 'Kavitha Doorstep Studio (Panaikulam / Sakkarakottai)',
      countryId: 1, stateId: 1, zoneId: 1, districtId: 3,
      country: 'India', state: 'Tamil Nadu', zone: 'Zone 1 - Ramanathapuram', district: 'Panaikulam',
      locality: 'Panaikulam',
      addressLine: 'Doorstep Mobile Service, Covering Panaikulam, Sakkarakottai & Ramnad',
      phoneContact: '+91 98421 00333',
      isDoorstepEnabled: true,
      status: 'Approved',
      isActive: true,
      pocName: 'Kavitha Praveen',
      pocPhone: '+91 94431 88991',
      pocEmail: 'kavitha.beauty@gmail.com',
      pocRole: 'Lead Beautician & POC',
      offeredServiceIds: [5, 6, 7]
    },
    {
      id: 'b4444444-4444-4444-4444-444444444444',
      salonId: 'cccc3333-cccc-3333-cccc-333333333333',
      salonName: 'Sakkarakottai Heritage Salon & Spa',
      branchName: 'Sakkarakottai Main Branch',
      countryId: 1, stateId: 1, zoneId: 1, districtId: 4,
      country: 'India', state: 'Tamil Nadu', zone: 'Zone 1 - Ramanathapuram', district: 'Sakkarakottai',
      locality: 'Sakkarakottai',
      addressLine: 'Main Bazar Road, Near Govt Higher Secondary School, Sakkarakottai 623504',
      phoneContact: '+91 98421 00444',
      isDoorstepEnabled: false,
      status: 'Pending',
      isActive: true,
      pocName: 'Saravanan Natarajan',
      pocPhone: '+91 94431 88992',
      pocEmail: 'saravanan.sakkarakottai@gmail.com',
      pocRole: 'Store Manager & POC',
      offeredServiceIds: [1, 3, 4]
    }
  ]);

  // Stylists
  const [stylists, setStylists] = useState([
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: 'Karthik Raja',
      specialization: 'Master Stylist & Herbal Hair Care Expert',
      branchId: 'b1111111-1111-1111-1111-111111111111',
      branch: 'Royal Classic - Ramnad Town Branch',
      supportedServiceIds: [1, 2, 3, 4],
      doorstepEnabled: true,
      doorstepRadiusKm: 12,
      shiftToday: '09:00 AM - 08:00 PM (Lunch 01:00 PM - 02:00 PM)',
      rating: 4.90,
      totalReviews: 68,
      isActive: true
    },
    {
      id: 'c2222222-2222-2222-2222-222222222222',
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      name: 'Kavitha Praveen',
      specialization: 'Bridal Makeup, Gold Facial & Doorstep Beautician',
      branchId: 'b3333333-3333-3333-3333-333333333333',
      branch: 'Kavitha Doorstep Studio (Panaikulam)',
      supportedServiceIds: [5, 6, 7],
      doorstepEnabled: true,
      doorstepRadiusKm: 15,
      shiftToday: '10:00 AM - 07:00 PM (Lunch 01:30 PM - 02:30 PM)',
      rating: 4.95,
      totalReviews: 52,
      isActive: true
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: 'Muthu Kumar',
      specialization: 'Senior Hair & Beard Specialist',
      branchId: 'b1111111-1111-1111-1111-111111111111',
      branch: 'Royal Classic - Ramnad Town Branch',
      supportedServiceIds: [1, 3, 4],
      doorstepEnabled: false,
      doorstepRadiusKm: 0,
      shiftToday: '10:00 AM - 09:00 PM (Lunch 02:00 PM - 03:00 PM)',
      rating: 4.85,
      totalReviews: 34,
      isActive: true
    }
  ]);

  // Bookings with Flow State: PendingConfirmation -> Confirmed (OTP Unlocked) -> InProgress -> Completed
  const [bookings, setBookings] = useState([
    {
      id: 'bk-201',
      reference: 'SB-RAMNAD-01',
      customer: 'Mohamed Irfan',
      phone: '+91 99999 00006',
      service: 'Herbal Hair Spa & Dandruff Care',
      serviceId: 2,
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      branchId: 'b1111111-1111-1111-1111-111111111111',
      branch: 'Royal Classic - Ramnad Town Branch',
      stylistId: 'c1111111-1111-1111-1111-111111111111',
      stylist: 'Karthik Raja',
      bookedStylistSpecific: true,
      confirmationStatus: 'Confirmed',
      date: 'Today, 25 Oct 2026',
      slot: '02:00 PM - 02:45 PM',
      netAmount: 600,
      paymentMode: 'PAY_AT_SALON_CASH',
      status: 'Completed',
      otp: '482910',
      isOtpVerified: true
    },
    {
      id: 'bk-202',
      reference: 'SB-RAMNAD-02',
      customer: 'Fathima Begum',
      phone: '+91 99999 00008',
      service: 'Traditional South Bridal Makeover',
      serviceId: 6,
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      branchId: 'b3333333-3333-3333-3333-333333333333',
      branch: 'Kavitha Doorstep Studio (Panaikulam)',
      stylistId: 'c2222222-2222-2222-2222-222222222222',
      stylist: 'Kavitha Praveen',
      bookedStylistSpecific: true,
      confirmationStatus: 'Confirmed',
      date: 'Today, 25 Oct 2026',
      slot: '04:00 PM - 05:30 PM',
      netAmount: 2380,
      paymentMode: 'ONLINE_ESCROW',
      status: 'Confirmed',
      otp: '915234',
      isOtpVerified: false
    },
    {
      id: 'bk-203',
      reference: 'SB-RAMNAD-03',
      customer: 'Suresh Kumar',
      phone: '+91 99999 00010',
      service: 'Royal Precision Haircut & Wash',
      serviceId: 1,
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      branchId: 'b1111111-1111-1111-1111-111111111111',
      branch: 'Royal Classic - Ramnad Town Branch',
      stylistId: null, // Customer chose "Any Stylist"
      stylist: 'Unassigned (Awaiting Owner Allocation)',
      bookedStylistSpecific: false,
      confirmationStatus: 'PendingConfirmation',
      date: 'Tomorrow, 26 Oct 2026',
      slot: '11:00 AM - 11:30 AM',
      netAmount: 200,
      paymentMode: 'PAY_AT_SALON_CASH',
      status: 'PendingConfirmation',
      otp: '782194',
      isOtpVerified: false
    },
    {
      id: 'bk-204',
      reference: 'SB-RAMNAD-04',
      customer: 'Anandhan Raj',
      phone: '+91 98421 11223',
      service: 'Royal Precision Haircut & Wash',
      serviceId: 1,
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      branchId: 'b1111111-1111-1111-1111-111111111111',
      branch: 'Royal Classic - Ramnad Town Branch',
      stylistId: 'c1111111-1111-1111-1111-111111111111',
      stylist: 'Karthik Raja',
      bookedStylistSpecific: true,
      confirmationStatus: 'PendingConfirmation',
      date: 'Today, 06:00 PM',
      slot: '06:00 PM - 06:30 PM',
      netAmount: 200,
      paymentMode: 'PAY_AT_SALON_CASH',
      status: 'PendingConfirmation',
      otp: '654321',
      isOtpVerified: false
    }
  ]);

  // Salon Owner Wallets & Membership (Accounting Schema)
  const [wallets, setWallets] = useState({
    'aaaa1111-aaaa-1111-aaaa-111111111111': {
      salonName: 'Royal Classic Unisex Salon & Spa',
      balance: 4500.00,
      pendingClearance: 1200.00,
      membershipPlan: 'Pro Growth (Up to 3 Branches)',
      membershipFee: '₹2,499 / month',
      commissionRate: 8,
      negativeCreditLimit: -2000.00,
      isPayoutBlocked: false
    },
    'bbbb2222-bbbb-2222-bbbb-222222222222': {
      salonName: 'Kavitha Doorstep Bridal & Beauty Care',
      balance: 1850.00,
      pendingClearance: 600.00,
      membershipPlan: 'Starter Solo (Independent Beautician)',
      membershipFee: '₹799 / month',
      commissionRate: 12,
      negativeCreditLimit: -1500.00,
      isPayoutBlocked: false
    }
  });

  const [walletLedger, setWalletLedger] = useState([
    { id: 'tx-101', salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111', type: 'CASH_COMMISSION_DEBIT', amount: -70.80, desc: 'Commission (10%) + 18% GST for Completed Cash Booking SB-RAMNAD-01 (₹600)', date: 'Today, 02:45 PM' },
    { id: 'tx-102', salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111', type: 'WALLET_TOPUP', amount: 2000.00, desc: 'Security Wallet Deposit via UPI (Ref: UPI/2026/89401)', date: 'Yesterday, 10:15 AM' },
    { id: 'tx-103', salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222', type: 'ONLINE_ESCROW_CREDIT', amount: 2099.16, desc: 'Net Earnings Credit for Online Booking SB-RAMNAD-02 (₹2,380)', date: 'Today, 05:30 PM' }
  ]);

  // Governance & Compliance Notices
  const [complianceNotices, setComplianceNotices] = useState([
    {
      id: 'not-01',
      targetType: 'BRANCH',
      targetName: 'Royal Classic - Puduvalasai Branch',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      branchId: 'b2222222-2222-2222-2222-222222222222',
      issuedBy: 'Murugan (Zonal Officer)',
      category: 'Sanitation & Staff Certification',
      subject: 'Stylist Certification & Sanitation License Upload Needed',
      description: 'Stylist onboarded at Puduvalasai branch requires state sanitation license copy within 48 hours.',
      gracePeriodHours: 48,
      status: 'NOTICE_ISSUED',
      ownerReply: null,
      issuedDate: '25 Oct 2026, 11:30 AM'
    }
  ]);

  // Verified Customer Reviews
  const [reviews, setReviews] = useState([
    {
      id: 'rev-01',
      bookingRef: 'SB-RAMNAD-01',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      branchName: 'Ramnad Town Branch',
      customerName: 'Mohamed Irfan',
      date: '25 Oct 2026',
      branchRating: 5,
      branchComment: 'Spotless cleanliness, excellent AC ambiance, and negligible waiting time.',
      stylistName: 'Karthik Raja',
      stylistRating: 5,
      stylistComment: 'Karthik gave a superb herbal hair spa. Very attentive and skilled with scissors.',
      ownerReply: 'Thank you Irfan! We take pride in our organic herbal hair spa standards. Visit again!'
    }
  ]);

  // Users Directory for Downgrade Provisioning
  const [usersList, setUsersList] = useState([
    { id: 'u1', username: 'superadmin', role: 'SUPER_ADMIN', name: 'Global Platform Admin', hierarchyLevel: 1, jurisdiction: 'Global' },
    { id: 'u2', username: 'admin_tamilnadu', role: 'ADMIN', name: 'Selvakumar', hierarchyLevel: 2, jurisdiction: 'Tamil Nadu State' },
    { id: 'u3', username: 'zonal_ramnad', role: 'ZONAL_MANAGER', name: 'Murugan', hierarchyLevel: 3, jurisdiction: 'Zone 1 - Ramanathapuram' },
    { id: 'u4', username: 'owner_anwar', role: 'SHOP_OWNER', name: 'Anwar Hussain', hierarchyLevel: 4, jurisdiction: 'Ramnad Town & Puduvalasai' },
    { id: 'u5', username: 'owner_kavitha', role: 'INDEPENDENT_OWNER', name: 'Kavitha Praveen', hierarchyLevel: 4, jurisdiction: 'Panaikulam & Sakkarakottai' },
    { id: 'u6', username: 'stylist_karthik', role: 'STYLIST', name: 'Karthik Raja', hierarchyLevel: 5, jurisdiction: 'Ramnad Town Branch' }
  ]);

  // Form States
  const [newBranchForm, setNewBranchForm] = useState({
    branchName: '', countryId: 1, stateId: 1, zoneId: 1, districtId: 1,
    addressLine: '', phoneContact: '', isDoorstepEnabled: false,
    pocName: '', pocPhone: '', pocEmail: '', pocRole: 'Branch In-Charge',
    selectedServices: [1, 2, 3]
  });

  const [newStylistForm, setNewStylistForm] = useState({
    name: '', specialization: 'Hair & Beard Stylist', branchId: '',
    supportedServices: [1, 3], doorstepEnabled: false, doorstepRadiusKm: 10
  });

  const [newServiceForm, setNewServiceForm] = useState({
    name: '', category: 'Hair Care', duration: 30, basePrice: 200, minFloorPrice: 150,
    customPrice: 200, isDoorstepEligible: true, targetBranchId: ''
  });

  const [newNoticeForm, setNewNoticeForm] = useState({
    targetType: 'BRANCH', targetName: '', salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
    branchId: '', category: 'Hygiene & Cleanliness', subject: '', description: '', gracePeriodHours: 48
  });

  const [newUserForm, setNewUserForm] = useState({
    fullName: '', username: '', role: 'STYLIST', territoryZone: 'Zone 1 - Ramanathapuram'
  });

  const [newGeoForm, setNewGeoForm] = useState({
    entityType: 'DISTRICT', parentId: 1, name: '', code: ''
  });

  const [shiftAdjustmentForm, setShiftAdjustmentForm] = useState({
    stylistId: '', newStartTime: '09:00 AM', newEndTime: '08:00 PM',
    newLunchStart: '01:00 PM', newLunchEnd: '02:00 PM', reason: 'Personal buffer request'
  });

  const [ownerReplyText, setOwnerReplyText] = useState('');
  const [rejectionModalData, setRejectionModalData] = useState(null); // { type: 'SALON'|'BRANCH'|'SERVICE', id: string, name: string }
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Login handler
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setLoginError('');

    const found = PRESET_USERS.find(u => u.username === loginForm.username);
    if (!found) {
      setLoginError('Invalid username. Please select one of the pre-configured hierarchy accounts below.');
      return;
    }

    if (loginForm.password !== 'Admin@12345' && loginForm.password !== 'Zone@12345' && loginForm.password !== 'Owner@12345' && loginForm.password !== 'Stylist@12345' && loginForm.password !== 'test1234') {
      // Allow any password in dev mode
    }

    setCurrentUser(found);
    setIsAuthenticated(true);
    // If Zonal Manager logs in, set default to approvals tab if pending items exist
    if (found.role === 'ZONAL_MANAGER' || found.hierarchyLevel <= 3) {
      setActiveTab('approvals');
    } else {
      setActiveTab('overview');
    }
    showToast(`Welcome ${found.name}! Signed in as Level ${found.hierarchyLevel} (${found.role}).`);
  };

  const handleSelectPreset = (preset) => {
    setCurrentUser(preset);
    setIsAuthenticated(true);
    setLoginForm({ username: preset.username, password: '' });
    if (preset.role === 'ZONAL_MANAGER' || preset.hierarchyLevel <= 3) {
      setActiveTab('approvals');
    } else {
      setActiveTab('overview');
    }
    showToast(`Switched user to ${preset.name} (${preset.role})`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
  };

  // Scope Filtering
  const visibleSalons = salons.filter(s => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 2) return true; // Super & State Admin see all
    if (currentUser.role === 'ZONAL_MANAGER') return s.zoneId === currentUser.zoneId;
    if (currentUser.type === 'OWNER') return s.id === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return s.id === currentUser.salonId;
    return false;
  });

  const visibleBranches = branches.filter(b => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 2) return true;
    if (currentUser.role === 'ZONAL_MANAGER') return b.zoneId === currentUser.zoneId;
    if (currentUser.type === 'OWNER') return b.salonId === currentUser.salonId;
    if (currentUser.type === 'STYLIST') {
      const st = stylists.find(s => s.id === currentUser.stylistId);
      return st ? b.id === st.branchId : false;
    }
    return false;
  });

  const visibleStylists = stylists.filter(st => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 3) return true;
    if (currentUser.type === 'OWNER') return st.salonId === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return st.id === currentUser.stylistId;
    return false;
  });

  const visibleBookings = bookings.filter(b => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 3) {
      // Zonal Manager territorial scoping!
      if (currentUser.role === 'ZONAL_MANAGER') {
        const br = branches.find(branch => branch.id === b.branchId);
        return br ? br.zoneId === currentUser.zoneId : true;
      }
      return true; // Super Admin & State Admin
    }
    if (currentUser.type === 'OWNER') return b.salonId === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return b.stylistId === currentUser.stylistId;
    return false;
  });

  // Approvals items in scope for current management user
  const pendingSalonsInScope = visibleSalons.filter(s => s.status === 'Pending');
  const pendingBranchesInScope = visibleBranches.filter(b => b.status === 'Pending');
  const pendingServicesInScope = masterServices.filter(s => s.approvalStatus === 'Pending_Approval');
  const totalPendingApprovals = pendingSalonsInScope.length + pendingBranchesInScope.length + pendingServicesInScope.length;

  // Strict Downgrade Users List
  const visibleDowngradeUsers = usersList.filter(u => {
    if (!currentUser) return false;
    return u.hierarchyLevel > currentUser.hierarchyLevel;
  });

  // Governance notices
  const relevantNotices = complianceNotices.filter(n => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 3) return true;
    if (currentUser.type === 'OWNER') return n.salonId === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return n.targetType === 'STYLIST' && n.targetName.includes(currentUser.name);
    return false;
  });

  // ==========================================
  // APPROVALS ACTIONS (MANAGEMENT LEVEL 1-3 ONLY)
  // ==========================================
  const handleApproveSalon = (salonId) => {
    if (currentUser.hierarchyLevel > 3) {
      showToast('Permission Denied: Only Zonal Managers and Admins can approve salon onboarding.');
      return;
    }
    setSalons(prev => prev.map(s => s.id === salonId ? { ...s, status: 'Approved', rejectionReason: null } : s));
    showToast('Salon registration APPROVED! Marketplace listing is now live.');
  };

  const handleOpenRejectModal = (type, id, name) => {
    setRejectionModalData({ type, id, name });
    setRejectionReasonInput('');
  };

  const handleConfirmRejection = () => {
    if (!rejectionModalData) return;
    const { type, id } = rejectionModalData;
    const reason = rejectionReasonInput.trim() || 'Criteria not met or documents incomplete.';

    if (type === 'SALON') {
      setSalons(prev => prev.map(s => s.id === id ? { ...s, status: 'Rejected', rejectionReason: reason } : s));
      showToast(`Salon registration rejected. Feedback delivered to applicant.`);
    } else if (type === 'BRANCH') {
      setBranches(prev => prev.map(b => b.id === id ? { ...b, status: 'Rejected', rejectionReason: reason } : b));
      showToast(`Branch proposal rejected.`);
    } else if (type === 'SERVICE') {
      setMasterServices(prev => prev.map(svc => svc.id === id ? { ...svc, approvalStatus: 'Rejected', rejectionReason: reason } : svc));
      showToast(`Custom service proposal rejected.`);
    }
    setRejectionModalData(null);
  };

  const handleApproveBranch = (branchId) => {
    if (currentUser.hierarchyLevel > 3) {
      showToast('Permission Denied: Only Management can approve branches.');
      return;
    }
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, status: 'Approved' } : b));
    showToast('Branch APPROVED! Now publicly discoverable.');
  };

  const handleApproveService = (serviceId) => {
    if (currentUser.hierarchyLevel > 3) {
      showToast('Permission Denied: Only Management can approve services.');
      return;
    }
    setMasterServices(prev => prev.map(svc => svc.id === serviceId ? { ...svc, approvalStatus: 'Approved' } : svc));
    showToast('Service APPROVED! Live in customer catalog.');
  };

  // Toggle Active/DeActive (L1, L2, L3)
  const handleToggleServiceActive = (serviceId) => {
    if (currentUser.hierarchyLevel > 3) {
      showToast('Permission Denied: Only Level 1, 2, and 3 users can toggle service status.');
      return;
    }
    setMasterServices(prev => prev.map(s => s.id === serviceId ? { ...s, isActive: !s.isActive } : s));
    showToast('Service Active/DeActive status updated successfully!');
  };

  const handleToggleBranchActive = (branchId) => {
    if (currentUser.hierarchyLevel > 3) {
      showToast('Permission Denied: Only Level 2 and 3 users can toggle branch active status.');
      return;
    }
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, isActive: !b.isActive } : b));
    showToast('Branch Active/DeActive status updated.');
  };

  const handleToggleStylistActive = (stylistId) => {
    if (currentUser.hierarchyLevel > 3) {
      showToast('Permission Denied: Only Level 2 and 3 users can toggle stylist active status.');
      return;
    }
    setStylists(prev => prev.map(st => st.id === stylistId ? { ...st, isActive: !st.isActive } : st));
    showToast('Stylist Active/DeActive status updated.');
  };

  // ==========================================
  // BOOKING LIFECYCLE ACTIONS (STRICT SCOPE)
  // ==========================================

  // 1. Accept & Confirm Booking (Owner or Stylist Only!)
  const handleAcceptBooking = (bookingId) => {
    if (currentUser.hierarchyLevel <= 3) {
      showToast('Scope Error: Management cannot accept/reject bookings. Only Salon Owner or Assigned Stylist can accept.');
      return;
    }
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Confirmed',
          confirmationStatus: 'Confirmed'
        };
      }
      return b;
    }));
    showToast('Booking CONFIRMED! 6-digit Arrival OTP is now active for customer.');
  };

  // 2. Reject Booking (Owner or Stylist Only!)
  const handleRejectBooking = (bookingId) => {
    if (currentUser.hierarchyLevel <= 3) {
      showToast('Scope Error: Only Salon Owner or Assigned Stylist can reject appointments.');
      return;
    }
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Cancelled',
          confirmationStatus: 'Rejected'
        };
      }
      return b;
    }));
    showToast('Booking rejected. Customer notified and slot released.');
  };

  // 3. Owner Assigns Stylist to "Any Stylist" Booking
  const handleOwnerAssignStylist = (bookingId, chosenStylistId) => {
    const st = stylists.find(s => s.id === chosenStylistId);
    if (!st) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          stylistId: st.id,
          stylist: st.name,
          confirmationStatus: 'Confirmed',
          status: 'Confirmed'
        };
      }
      return b;
    }));
    showToast(`Stylist ${st.name} assigned! Booking confirmed and OTP unlocked.`);
  };

  // 4. OTP Verification (Owner & Stylist ONLY!)
  const handleVerifyOtp = (bookingId, enteredOtp) => {
    if (currentUser.hierarchyLevel <= 3) {
      showToast('Permission Denied: Management users cannot verify check-in OTP. Only Salon Owner or Stylist can do this.');
      return;
    }
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (booking.otp === enteredOtp.trim()) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'InProgress', isOtpVerified: true } : b));
      showToast('OTP Verified! Service status updated to In-Progress.');
    } else {
      showToast('Invalid OTP. Please check code with customer.');
    }
  };

  // 5. Complete Service & Execute Financial Ledger (Commission / Wallet)
  const handleCompleteService = (bookingId) => {
    if (currentUser.hierarchyLevel <= 3) {
      showToast('Scope Error: Only Salon Owner or Stylist can mark appointment completed.');
      return;
    }
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));

    // Financial Execution: If Cash, deduct commission from Owner Wallet!
    if (targetBooking.paymentMode === 'PAY_AT_SALON_CASH') {
      const commission = targetBooking.netAmount * 0.10; // 10%
      const gst = commission * 0.18; // 18% GST
      const totalDebit = Number((commission + gst).toFixed(2));

      setWallets(prev => {
        const ownerSalId = targetBooking.salonId;
        const currentW = prev[ownerSalId] || { balance: 2000 };
        return {
          ...prev,
          [ownerSalId]: {
            ...currentW,
            balance: Number((currentW.balance - totalDebit).toFixed(2))
          }
        };
      });

      const newTx = {
        id: `tx-${Date.now()}`,
        salonId: targetBooking.salonId,
        type: 'CASH_COMMISSION_DEBIT',
        amount: -totalDebit,
        desc: `Auto Commission (10% + 18% GST) for Cash Booking ${targetBooking.reference} (₹${targetBooking.netAmount})`,
        date: 'Just now'
      };
      setWalletLedger(prev => [newTx, ...prev]);
      showToast(`Appointment Completed! ₹${totalDebit} platform commission deducted from Owner Wallet.`);
    } else {
      showToast('Appointment Completed! Net earnings credited to Owner Escrow Ledger.');
    }
  };

  // ==========================================
  // SERVICE CREATION (BOTH ADMIN & OWNER)
  // ==========================================
  const handleCreateService = (e) => {
    if (e) e.preventDefault();
    if (!newServiceForm.name) {
      showToast('Please enter service name.');
      return;
    }

    const isManagement = currentUser.hierarchyLevel <= 3;
    const baseP = Number(newServiceForm.basePrice) || 200;
    const minP = Number(newServiceForm.minFloorPrice) || (baseP * 0.75);
    const customP = Number(newServiceForm.customPrice) || baseP;

    const svcObj = {
      id: Date.now(),
      name: newServiceForm.name,
      category: newServiceForm.category,
      duration: Number(newServiceForm.duration) || 30,
      basePrice: baseP,
      minFloorPrice: minP,
      customPrice: customP,
      salonId: isManagement ? null : currentUser.salonId,
      submittedBy: isManagement ? `${currentUser.name} (Management)` : `${currentUser.name} (Owner)`,
      targetBranchName: isManagement ? 'All Branches' : (branches.find(b => b.salonId === currentUser.salonId)?.branchName || 'Owner Branch'),
      approvalStatus: isManagement ? 'Approved' : 'Pending_Approval', // Owners require Zonal Manager Approval!
      isActive: true
    };

    setMasterServices([...masterServices, svcObj]);
    setShowAddServiceModal(false);

    if (isManagement) {
      showToast(`Master Service "${svcObj.name}" created and live with floor price ₹${svcObj.minFloorPrice}!`);
    } else {
      showToast(`Custom Service "${svcObj.name}" submitted! Awaiting Zonal Manager approval before going live.`);
    }
  };

  // Create Branch
  const handleCreateBranch = (e) => {
    if (e) e.preventDefault();
    if (!newBranchForm.branchName || !newBranchForm.pocName || !newBranchForm.pocPhone) {
      showToast('Please fill branch name and POC details.');
      return;
    }

    const selCountry = countries.find(c => c.id === Number(newBranchForm.countryId)) || countries[0];
    const selState = states.find(s => s.id === Number(newBranchForm.stateId)) || states[0];
    const selZone = zones.find(z => z.id === Number(newBranchForm.zoneId)) || zones[0];
    const selDistrict = districts.find(d => d.id === Number(newBranchForm.districtId)) || districts[0];

    const branchObj = {
      id: `b-${Date.now()}`,
      salonId: currentUser.salonId || 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: currentUser.salon || 'Royal Classic Unisex Salon',
      branchName: newBranchForm.branchName,
      countryId: selCountry.id, stateId: selState.id, zoneId: selZone.id, districtId: selDistrict.id,
      country: selCountry.name, state: selState.name, zone: selZone.name, district: selDistrict.name,
      locality: selDistrict.name,
      addressLine: newBranchForm.addressLine || `${selDistrict.name} Main Road`,
      phoneContact: newBranchForm.phoneContact || '+91 98421 99999',
      isDoorstepEnabled: newBranchForm.isDoorstepEnabled,
      status: currentUser.hierarchyLevel <= 3 ? 'Approved' : 'Pending', // Requires approval if created by owner
      isActive: true,
      pocName: newBranchForm.pocName,
      pocPhone: newBranchForm.pocPhone,
      pocEmail: newBranchForm.pocEmail || 'poc@stylebook.in',
      pocRole: newBranchForm.pocRole || 'Branch In-Charge',
      offeredServiceIds: newBranchForm.selectedServices
    };

    setBranches([...branches, branchObj]);
    setShowAddBranchModal(false);
    showToast(`Branch "${branchObj.branchName}" created! ${branchObj.status === 'Pending' ? 'Awaiting Zonal Manager approval.' : 'Now live.'}`);
  };

  // Top Up Wallet
  const handleTopUpWallet = (amount) => {
    const salId = currentUser.salonId || 'aaaa1111-aaaa-1111-aaaa-111111111111';
    setWallets(prev => {
      const cur = prev[salId] || { balance: 0 };
      return {
        ...prev,
        [salId]: { ...cur, balance: cur.balance + amount }
      };
    });
    const tx = {
      id: `tx-${Date.now()}`,
      salonId: salId,
      type: 'WALLET_TOPUP',
      amount: amount,
      desc: `Prepaid Security Wallet Top-up of ₹${amount} via UPI`,
      date: 'Just now'
    };
    setWalletLedger(prev => [tx, ...prev]);
    setShowTopUpWalletModal(false);
    showToast(`Wallet successfully topped up with ₹${amount}!`);
  };

  // Transfer Stylist (Owner Action)
  const handleTransferStylist = (stylistId, newBranchId) => {
    const targetBranch = branches.find(b => b.id === newBranchId);
    if (!targetBranch) return;

    setStylists(prev => prev.map(st => {
      if (st.id === stylistId) {
        return {
          ...st,
          branchId: targetBranch.id,
          branch: targetBranch.branchName
        };
      }
      return st;
    }));

    setShowTransferStylistModal(null);
    showToast(`Stylist transferred to ${targetBranch.branchName} successfully!`);
  };

  // ==========================================
  // RENDER LOGIN SCREEN (IF NOT AUTHENTICATED)
  // ==========================================
  if (!isAuthenticated || !currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'system-ui, sans-serif', color: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: 480, background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 32, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, background: '#7c3aed', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Scissors size={28} color="#fff" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>StyleBook Management Portal</h1>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
              Multi-Scope Governance, Approvals & Operations Engine
            </p>
          </div>

          {loginError && (
            <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', color: '#fecaca', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {loginError}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
              Quick One-Click Test Role Login:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              {PRESET_USERS.map(user => (
                <button
                  key={user.username}
                  onClick={() => handleSelectPreset(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: user.role === 'ZONAL_MANAGER' ? '#1e1b4b' : (user.type === 'OWNER' ? '#0f2922' : '#1f2937'),
                    border: user.role === 'ZONAL_MANAGER' ? '1px solid #6366f1' : '1px solid #374151',
                    borderRadius: 8,
                    color: '#f8fafc',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600
                  }}
                >
                  <div>
                    <div>{user.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{user.jurisdiction}</div>
                  </div>
                  <ArrowRight size={14} color="#a5b4fc" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Salon Wallet Data for current owner
  const currentOwnerWallet = currentUser.salonId ? (wallets[currentUser.salonId] || { balance: 2500, membershipPlan: 'Pro Growth', commissionRate: 8, negativeCreditLimit: -2000 }) : null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0b1120', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 8, fontWeight: 700, zIndex: 99999, boxShadow: '0 10px 25px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {notificationMsg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: 280, background: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        
        {/* Brand Header */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#7c3aed', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scissors size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#fff' }}>StyleBook</h2>
            <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>
              {currentUser.role} (Level {currentUser.hierarchyLevel})
            </span>
          </div>
        </div>

        {/* Current User Pill */}
        <div style={{ padding: '12px 16px', background: '#1e293b', margin: 12, borderRadius: 8, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{currentUser.name}</div>
          <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>{currentUser.jurisdiction}</div>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          
          <button 
            onClick={() => setActiveTab('overview')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'overview' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Building size={18} /> Dashboard Overview
          </button>

          {/* APPROVALS TAB (MANAGEMENT LEVEL 1-3) */}
          {currentUser.hierarchyLevel <= 3 && (
            <button 
              onClick={() => setActiveTab('approvals')} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'approvals' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckSquare size={18} /> Approvals & Reviews
              </div>
              {totalPendingApprovals > 0 && (
                <span style={{ background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                  {totalPendingApprovals}
                </span>
              )}
            </button>
          )}

          {/* Services & Custom Catalog */}
          <button 
            onClick={() => setActiveTab('pricing')} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'pricing' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Tag size={18} /> Services & Pricing
            </div>
            {masterServices.filter(s => s.approvalStatus === 'Pending_Approval').length > 0 && (
              <span style={{ background: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: 8, fontSize: 10, fontWeight: 700 }}>
                {masterServices.filter(s => s.approvalStatus === 'Pending_Approval').length} Req
              </span>
            )}
          </button>

          {/* Branches & Salons */}
          <button 
            onClick={() => setActiveTab('branches')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'branches' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Store size={18} /> Branches & Salons ({visibleBranches.length})
          </button>

          {/* Stylists & Rosters */}
          <button 
            onClick={() => setActiveTab('stylists')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'stylists' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Scissors size={18} /> Stylists & Skills ({visibleStylists.length})
          </button>

          {/* Bookings & Check-in OTP */}
          <button 
            onClick={() => setActiveTab('bookings')} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'bookings' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Calendar size={18} /> Bookings & Check-in
            </div>
            <span style={{ background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
              {visibleBookings.length}
            </span>
          </button>

          {/* WALLET & FINANCIAL ACCOUNTING TAB */}
          <button 
            onClick={() => setActiveTab('wallet')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'wallet' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Wallet size={18} /> Wallets & Financials
          </button>

          {/* Governance & Notices */}
          <button 
            onClick={() => setActiveTab('governance')} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'governance' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldAlert size={18} /> Governance & Notices
            </div>
            {relevantNotices.filter(n => n.status !== 'RESOLVED').length > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                {relevantNotices.filter(n => n.status !== 'RESOLVED').length}
              </span>
            )}
          </button>

          {/* Help Desk & POC Directory */}
          <button 
            onClick={() => setActiveTab('helpdesk')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'helpdesk' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <HelpCircle size={18} /> Help Desk & POCs
          </button>

        </div>

        {/* User Signout */}
        <div style={{ padding: 16, borderTop: '1px solid #1e293b' }}>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: '#1f2937', color: '#f87171', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={16} /> Sign Out of Platform
          </button>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Operational Dashboard</h1>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  Territorial Scope: <strong>{currentUser.jurisdiction}</strong> &bull; User: <strong>{currentUser.name}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {currentUser.type === 'OWNER' && (
                  <button 
                    onClick={() => setShowAddServiceModal(true)}
                    style={{ background: '#7c3aed', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={16} /> Request Custom Service
                  </button>
                )}
                {currentUser.hierarchyLevel <= 3 && (
                  <button 
                    onClick={() => setActiveTab('approvals')}
                    style={{ background: '#f59e0b', color: '#000', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <CheckSquare size={16} /> Pending Approvals ({totalPendingApprovals})
                  </button>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              <div style={{ background: '#1e293b', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Salons in Scope</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#38bdf8' }}>{visibleSalons.length}</h3>
                <span style={{ fontSize: 11, color: '#10b981' }}>{visibleSalons.filter(s => s.status === 'Approved').length} Approved & Live</span>
              </div>
              <div style={{ background: '#1e293b', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Branches</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#a78bfa' }}>{visibleBranches.length}</h3>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Physical & Doorstep</span>
              </div>
              <div style={{ background: '#1e293b', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Staff Stylists</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#f472b6' }}>{visibleStylists.length}</h3>
                <span style={{ fontSize: 11, color: '#10b981' }}>Rostered & Active</span>
              </div>
              <div style={{ background: '#1e293b', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Bookings</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#34d399' }}>{visibleBookings.length}</h3>
                <span style={{ fontSize: 11, color: '#f59e0b' }}>{visibleBookings.filter(b => b.status === 'PendingConfirmation').length} Awaiting Confirmation</span>
              </div>
            </div>

            {/* Quick Action Alerts */}
            {currentUser.hierarchyLevel <= 3 && totalPendingApprovals > 0 && (
              <div style={{ background: '#2e1065', border: '1px solid #a855f7', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, color: '#f3e8ff' }}>Action Required: {totalPendingApprovals} Pending Items Awaiting Zonal Review</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#d8b4fe' }}>
                    {pendingSalonsInScope.length} Salons, {pendingBranchesInScope.length} Branches, and {pendingServicesInScope.length} Custom Services need verification.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('approvals')}
                  style={{ background: '#a855f7', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Review Approvals Queue &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPROVALS & REVIEWS QUEUE (MANAGEMENT LEVEL 1-3) */}
        {activeTab === 'approvals' && currentUser.hierarchyLevel <= 3 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Management Approvals & Verification Queue</h1>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                Review, approve, or reject onboarding applications for Salons, Branches, and Custom Services within <strong>{currentUser.jurisdiction}</strong>.
              </p>
            </div>

            {/* SECTION 1: PENDING SALONS */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Store size={20} color="#38bdf8" /> Pending Salon Registrations ({pendingSalonsInScope.length})
              </h3>
              {pendingSalonsInScope.length === 0 ? (
                <div style={{ background: '#1e293b', padding: 20, borderRadius: 10, color: '#94a3b8', fontSize: 13 }}>
                  No pending salon applications in your assigned zone.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
                  {pendingSalonsInScope.map(sal => (
                    <div key={sal.id} style={{ background: '#1e293b', border: '1px solid #f59e0b', borderRadius: 12, padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h4 style={{ margin: 0, fontSize: 18, color: '#fff' }}>{sal.brandName}</h4>
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                            PENDING ONBOARDING REVIEW
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                          Owner: <strong>{sal.ownerName}</strong> &bull; Locality: <strong>{sal.locality}</strong> &bull; Type: <strong>{sal.businessType}</strong>
                        </p>
                        <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>
                          Point of Contact (POC): <strong>{sal.pocName}</strong> ({sal.pocPhone}) &bull; Email: {sal.pocEmail}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => handleApproveSalon(sal.id)}
                          style={{ background: '#059669', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <CheckCircle2 size={16} /> Approve Salon
                        </button>
                        <button 
                          onClick={() => handleOpenRejectModal('SALON', sal.id, sal.brandName)}
                          style={{ background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <XCircle size={16} /> Reject with Reason
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: PENDING CUSTOM SERVICES & PRICE OVERRIDES */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag size={20} color="#a78bfa" /> Pending Custom Services Proposed by Owners ({pendingServicesInScope.length})
              </h3>
              {pendingServicesInScope.length === 0 ? (
                <div style={{ background: '#1e293b', padding: 20, borderRadius: 10, color: '#94a3b8', fontSize: 13 }}>
                  No custom service proposals awaiting review.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
                  {pendingServicesInScope.map(svc => (
                    <div key={svc.id} style={{ background: '#1e293b', border: '1px solid #8b5cf6', borderRadius: 12, padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h4 style={{ margin: 0, fontSize: 18, color: '#fff' }}>{svc.name}</h4>
                          <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                            AWAITING PRICE APPROVAL
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                          Proposed by: <strong>{svc.submittedBy}</strong> &bull; Target Branch: <strong>{svc.targetBranchName}</strong> &bull; Category: <strong>{svc.category}</strong>
                        </p>
                        <p style={{ fontSize: 13, color: '#f8fafc', marginTop: 2 }}>
                          Proposed Custom Price: <strong style={{ color: '#34d399' }}>₹{svc.customPrice}</strong> &bull; Regional Minimum Floor Price: <strong style={{ color: '#f59e0b' }}>₹{svc.minFloorPrice}</strong> &bull; Duration: <strong>{svc.duration} mins</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => handleApproveService(svc.id)}
                          style={{ background: '#059669', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <CheckCircle2 size={16} /> Approve Service
                        </button>
                        <button 
                          onClick={() => handleOpenRejectModal('SERVICE', svc.id, svc.name)}
                          style={{ background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <XCircle size={16} /> Reject Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: PENDING BRANCHES */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building size={20} color="#34d399" /> Pending Physical / Doorstep Branches ({pendingBranchesInScope.length})
              </h3>
              {pendingBranchesInScope.length === 0 ? (
                <div style={{ background: '#1e293b', padding: 20, borderRadius: 10, color: '#94a3b8', fontSize: 13 }}>
                  All registered branches in your zone are approved and active.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
                  {pendingBranchesInScope.map(br => (
                    <div key={br.id} style={{ background: '#1e293b', border: '1px solid #10b981', borderRadius: 12, padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h4 style={{ margin: 0, fontSize: 18, color: '#fff' }}>{br.branchName}</h4>
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                            PENDING BRANCH INSPECTION
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                          Salon Brand: <strong>{br.salonName}</strong> &bull; Locality: <strong>{br.locality}</strong> &bull; Address: <strong>{br.addressLine}</strong>
                        </p>
                        <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>
                          Branch POC: <strong>{br.pocName}</strong> ({br.pocPhone}) &bull; Doorstep Enabled: <strong>{br.isDoorstepEnabled ? 'Yes' : 'No'}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => handleApproveBranch(br.id)}
                          style={{ background: '#059669', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
                        >
                          Approve Branch
                        </button>
                        <button 
                          onClick={() => handleOpenRejectModal('BRANCH', br.id, br.branchName)}
                          style={{ background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES & PRICING (BOTH ADMINS & SALON OWNERS CAN ADD) */}
        {activeTab === 'pricing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Service Catalog & Floor Pricing Authority</h1>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  {currentUser.hierarchyLevel <= 3 
                    ? 'Management sets baseline minimum floor prices. Owners cannot undercut these thresholds.'
                    : 'Salon Owners can request new custom services for their branches (subject to Zonal Manager approval).'}
                </p>
              </div>

              <button 
                onClick={() => setShowAddServiceModal(true)}
                style={{ background: '#7c3aed', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
              >
                <Plus size={16} /> {currentUser.hierarchyLevel <= 3 ? 'Add Master Service & Floor Price' : '+ Request / Add Custom Service'}
              </button>
            </div>

            <div style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '14px 18px' }}>Service Name</th>
                    <th style={{ padding: '14px 18px' }}>Category</th>
                    <th style={{ padding: '14px 18px' }}>Duration</th>
                    <th style={{ padding: '14px 18px' }}>Market Price</th>
                    <th style={{ padding: '14px 18px' }}>Minimum Floor Price</th>
                    <th style={{ padding: '14px 18px' }}>Approval Status</th>
                    <th style={{ padding: '14px 18px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {masterServices.map(svc => (
                    <tr key={svc.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                        {svc.name}
                        {svc.submittedBy && (
                          <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 500 }}>
                            Custom proposed by {svc.submittedBy}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#38bdf8' }}>{svc.category}</td>
                      <td style={{ padding: '14px 18px' }}>{svc.duration} mins</td>
                      <td style={{ padding: '14px 18px', fontWeight: 800 }}>₹{svc.basePrice}</td>
                      <td style={{ padding: '14px 18px', color: '#f59e0b', fontWeight: 800 }}>₹{svc.minFloorPrice}</td>
                      <td style={{ padding: '14px 18px' }}>
                        {svc.approvalStatus === 'Approved' ? (
                          <span style={{ background: '#065f46', color: '#a7f3d0', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                            Approved / Live
                          </span>
                        ) : svc.approvalStatus === 'Pending_Approval' ? (
                          <span style={{ background: '#78350f', color: '#fde68a', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                            Pending Zonal Review
                          </span>
                        ) : (
                          <span style={{ background: '#7f1d1d', color: '#fecaca', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                            Rejected
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {currentUser.hierarchyLevel <= 3 ? (
                          <button 
                            onClick={() => handleToggleServiceActive(svc.id)}
                            style={{
                              background: svc.isActive ? '#1f2937' : '#059669',
                              color: svc.isActive ? '#f87171' : '#fff',
                              padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer'
                            }}
                          >
                            {svc.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 12 }}>Offered at Branch</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS & CHECK-IN OTP (STRICT SCOPE ENFORCEMENT!) */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Appointment Bookings & Arrival Verification</h1>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  {currentUser.hierarchyLevel <= 3 ? (
                    <strong style={{ color: '#818cf8' }}>
                      Territorial Audit Mode: You are viewing bookings in {currentUser.jurisdiction}. Check-in OTP verification is strictly restricted to Salon Owner & Stylist.
                    </strong>
                  ) : (
                    'Owners and Stylists can Accept/Reject incoming requests and perform 6-digit OTP verification upon customer arrival.'
                  )}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {visibleBookings.map(b => (
                <div key={b.id} style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ background: '#312e81', color: '#a5b4fc', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                          {b.reference}
                        </span>
                        <span style={{
                          background: b.status === 'Completed' ? '#065f46' : (b.status === 'InProgress' ? '#5b21b6' : (b.status === 'Confirmed' ? '#0369a1' : '#78350f')),
                          color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700
                        }}>
                          {b.status === 'PendingConfirmation' ? '⏳ Waiting for Salon Confirmation' : b.status}
                        </span>
                        <span style={{ background: b.paymentMode === 'PAY_AT_SALON_CASH' ? '#14532d' : '#1e3a8a', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                          {b.paymentMode === 'PAY_AT_SALON_CASH' ? 'Pay-at-Salon (Cash)' : 'Online (Escrow)'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>{b.service}</h3>
                      <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                        Customer: <strong>{b.customer}</strong> ({b.phone}) &bull; Slot: <strong>{b.slot}</strong> ({b.branch})
                      </p>
                      <p style={{ fontSize: 12, color: b.bookedStylistSpecific ? '#34d399' : '#f59e0b', marginTop: 2, fontWeight: 600 }}>
                        {b.bookedStylistSpecific ? `Assigned Stylist: ${b.stylist}` : `Customer requested "Any Available Stylist" - ${b.stylist}`}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8' }}>₹{b.netAmount}</div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Total Payable</span>
                    </div>
                  </div>

                  {/* STAGE 1: CONFIRMATION ACTIONS (FOR PENDING BOOKINGS) */}
                  {b.status === 'PendingConfirmation' && (
                    <div style={{ marginTop: 16, background: '#0f172a', padding: 14, borderRadius: 8, border: '1px dashed #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 600 }}>
                        {currentUser.hierarchyLevel <= 3 
                          ? '⏳ Awaiting confirmation from salon owner or stylist.'
                          : 'Action Required: Confirm customer appointment request:'}
                      </span>

                      {currentUser.hierarchyLevel > 3 ? (
                        <div style={{ display: 'flex', gap: 10 }}>
                          {!b.bookedStylistSpecific && (
                            <div style={{ display: 'flex', gap: 6 }}>
                              {stylists.filter(s => s.branchId === b.branchId && s.isActive).map(st => (
                                <button 
                                  key={st.id}
                                  onClick={() => handleOwnerAssignStylist(b.id, st.id)}
                                  style={{ background: '#7c3aed', color: '#fff', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                                >
                                  Assign {st.name} & Confirm
                                </button>
                              ))}
                            </div>
                          )}

                          {b.bookedStylistSpecific && (
                            <>
                              <button 
                                onClick={() => handleAcceptBooking(b.id)}
                                style={{ background: '#059669', color: '#fff', padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                              >
                                <Check size={14} /> Accept & Confirm Booking
                              </button>
                              <button 
                                onClick={() => handleRejectBooking(b.id)}
                                style={{ background: '#dc2626', color: '#fff', padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 700 }}>
                          🔒 Territorial Audit View (Accept/Reject restricted to Owner/Stylist)
                        </span>
                      )}
                    </div>
                  )}

                  {/* STAGE 2: CHECK-IN OTP VERIFICATION (STRICT SCOPE: OWNER & STYLIST ONLY!) */}
                  {b.status === 'Confirmed' && (
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Smartphone size={18} color="#38bdf8" />
                        <span style={{ fontSize: 13, color: '#cbd5e1' }}>Arrival Check-in 6-Digit OTP:</span>

                        {currentUser.hierarchyLevel <= 3 ? (
                          // MANAGEMENT VIEW: NO OTP KEYPAD!
                          <span style={{ background: '#312e81', color: '#c7d2fe', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                            🔒 Restricted: OTP Check-in Verification is strictly restricted to Salon Owner or Assigned Stylist.
                          </span>
                        ) : (
                          // OWNER OR STYLIST VIEW: CAN INPUT OTP!
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input 
                              type="text" 
                              id={`otp-input-${b.id}`}
                              placeholder="6-digit code"
                              maxLength={6}
                              style={{ width: 110, padding: '6px 10px', background: '#0f172a', border: '1px solid #475569', borderRadius: 6, color: '#fff', textAlign: 'center', fontWeight: 800 }}
                            />
                            <button 
                              onClick={() => {
                                const val = document.getElementById(`otp-input-${b.id}`).value;
                                handleVerifyOtp(b.id, val);
                              }}
                              style={{ background: '#7c3aed', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                            >
                              Verify & Start
                            </button>
                          </div>
                        )}
                      </div>

                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Demo Customer OTP: <strong>{b.otp}</strong></span>
                    </div>
                  )}

                  {/* STAGE 3: IN PROGRESS / COMPLETION */}
                  {b.status === 'InProgress' && (
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 700 }}>
                        ⏱️ Service In-Progress (Verified via OTP)
                      </span>
                      {currentUser.hierarchyLevel > 3 ? (
                        <button 
                          onClick={() => handleCompleteService(b.id)}
                          style={{ background: '#059669', color: '#fff', padding: '8px 18px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                        >
                          Mark Completed (Process Ledger)
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>In Progress (Salon performing service)</span>
                      )}
                    </div>
                  )}

                  {/* STAGE 4: COMPLETED */}
                  {b.status === 'Completed' && (
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#34d399', fontSize: 12, fontWeight: 700 }}>
                        ✓ Appointment Completed & Verified &bull; Financial Ledger Settled
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        OTP: {b.otp} &bull; Check-in Validated
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: WALLET, BILLING & FINANCIAL ACCOUNTING */}
        {activeTab === 'wallet' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Financial Accounting & Owner Wallets</h1>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  Double-entry escrow ledger, SaaS membership billing, and automated commission collection on cash bookings.
                </p>
              </div>

              {currentUser.type === 'OWNER' && (
                <button 
                  onClick={() => setShowTopUpWalletModal(true)}
                  style={{ background: '#059669', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <CreditCard size={16} /> Top-Up Security Wallet
                </button>
              )}
            </div>

            {/* Wallet Summary Cards */}
            {currentUser.type === 'OWNER' && currentOwnerWallet ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                <div style={{ background: '#1e293b', padding: 22, borderRadius: 12, border: '1px solid #334155' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Prepaid Security Wallet</span>
                  <h3 style={{ fontSize: 32, fontWeight: 900, marginTop: 8, color: currentOwnerWallet.balance >= 0 ? '#34d399' : '#f87171' }}>
                    ₹{currentOwnerWallet.balance.toFixed(2)}
                  </h3>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    Negative Limit: ₹{currentOwnerWallet.negativeCreditLimit}
                  </span>
                </div>

                <div style={{ background: '#1e293b', padding: 22, borderRadius: 12, border: '1px solid #334155' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active SaaS Membership</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 8, color: '#a78bfa' }}>
                    {currentOwnerWallet.membershipPlan}
                  </h3>
                  <span style={{ fontSize: 11, color: '#38bdf8' }}>
                    Fee: {currentOwnerWallet.membershipFee} &bull; Commission Rate: {currentOwnerWallet.commissionRate}%
                  </span>
                </div>

                <div style={{ background: '#1e293b', padding: 22, borderRadius: 12, border: '1px solid #334155' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Commission Take-Rate Model</span>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8, lineHeight: 1.5 }}>
                    When customers pay cash, StyleBook automatically deducts <strong>{currentOwnerWallet.commissionRate}% commission + 18% GST</strong> from your prepaid wallet upon OTP check-in.
                  </p>
                </div>
              </div>
            ) : (
              // MANAGEMENT OVERVIEW OF ALL SALON WALLETS
              <div style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', padding: 20, marginBottom: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px 0' }}>Salon Wallets Overview in {currentUser.jurisdiction}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  {Object.entries(wallets).map(([salId, w]) => (
                    <div key={salId} style={{ background: '#0f172a', padding: 16, borderRadius: 8, border: '1px solid #334155' }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{w.salonName}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Plan: {w.membershipPlan}</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#34d399', marginTop: 6 }}>Wallet: ₹{w.balance.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Ledger History */}
            <div style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', fontWeight: 800, fontSize: 15 }}>
                Double-Entry Ledger Transactions
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '12px 18px' }}>Date</th>
                    <th style={{ padding: '12px 18px' }}>Transaction Type</th>
                    <th style={{ padding: '12px 18px' }}>Description</th>
                    <th style={{ padding: '12px 18px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {walletLedger.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{tx.date}</td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{
                          background: tx.amount < 0 ? '#7f1d1d' : '#065f46',
                          color: tx.amount < 0 ? '#fecaca' : '#a7f3d0',
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700
                        }}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px' }}>{tx.desc}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 800, color: tx.amount < 0 ? '#f87171' : '#34d399' }}>
                        {tx.amount > 0 ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: BRANCHES & POCS */}
        {activeTab === 'branches' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Salon Branches & Site POCs</h1>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  Multi-branch footprint across districts with Doorstep support toggles.
                </p>
              </div>

              {currentUser.type !== 'STYLIST' && (
                <button 
                  onClick={() => setShowAddBranchModal(true)}
                  style={{ background: '#7c3aed', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={16} /> Add New Branch
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {visibleBranches.map(br => (
                <div key={br.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: '#fff' }}>{br.branchName}</h3>
                    <span style={{ background: br.status === 'Approved' ? '#065f46' : '#78350f', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                      {br.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
                    Locality: <strong>{br.locality}</strong> &bull; Address: {br.addressLine}
                  </p>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                    Site POC: <strong>{br.pocName}</strong> ({br.pocRole}) &bull; Phone: {br.phoneContact}
                  </p>
                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: 12 }}>
                    <span style={{ fontSize: 12, color: br.isDoorstepEnabled ? '#34d399' : '#94a3b8', fontWeight: 600 }}>
                      {br.isDoorstepEnabled ? '✓ Doorstep Home Visits Enabled' : 'In-Salon Only'}
                    </span>
                    {currentUser.hierarchyLevel <= 3 && (
                      <button 
                        onClick={() => handleToggleBranchActive(br.id)}
                        style={{ background: '#374151', color: '#cbd5e1', padding: '4px 10px', borderRadius: 6, fontSize: 11, border: 'none', cursor: 'pointer' }}
                      >
                        {br.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: STYLISTS & ROSTERS */}
        {activeTab === 'stylists' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Stylist Rosters, Skills & Shift Timings</h1>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  Manage certified service capabilities, shift hours, and branch transfers.
                </p>
              </div>

              {currentUser.type === 'OWNER' && (
                <button 
                  onClick={() => setShowAddStylistModal(true)}
                  style={{ background: '#7c3aed', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={16} /> Onboard Stylist
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {visibleStylists.map(st => (
                <div key={st.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: '#fff' }}>{st.name}</h3>
                    <span style={{ background: '#312e81', color: '#a5b4fc', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                      ★ {st.rating} ({st.totalReviews} reviews)
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#38bdf8', marginTop: 4 }}>{st.specialization}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Branch Station: <strong>{st.branch}</strong></p>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>Shift: <strong>{st.shiftToday}</strong></p>
                  
                  {currentUser.type === 'OWNER' && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button 
                        onClick={() => setShowTransferStylistModal(st.id)}
                        style={{ background: '#374151', color: '#cbd5e1', padding: '6px 12px', borderRadius: 6, fontSize: 11, border: 'none', cursor: 'pointer' }}
                      >
                        Transfer Branch &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: GOVERNANCE & NOTICES */}
        {activeTab === 'governance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Governance, Compliance & Targeted Notices</h1>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  Issue territorial compliance notices to Stylists, Owners, Branches, or Customers.
                </p>
              </div>

              {currentUser.hierarchyLevel <= 3 && (
                <button 
                  onClick={() => setShowIssueNoticeModal(true)}
                  style={{ background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <ShieldAlert size={16} /> Issue Compliance Notice
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {relevantNotices.map(n => (
                <div key={n.id} style={{ background: '#1e293b', border: '1px solid #ef4444', borderRadius: 12, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ background: '#7f1d1d', color: '#fecaca', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                        {n.targetType}: {n.targetName}
                      </span>
                      <h4 style={{ margin: 0, fontSize: 16, color: '#fff' }}>{n.subject}</h4>
                    </div>
                    <span style={{ color: '#f87171', fontSize: 12, fontWeight: 700 }}>Grace Period: {n.gracePeriodHours} Hours</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8 }}>{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: HELP DESK & POCS */}
        {activeTab === 'helpdesk' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Help Desk & Point of Contact (POC) Directory</h1>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                Direct operational and escalation contact details for platform managers, admins, and branch heads.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 22 }}>
                <h4 style={{ margin: 0, fontSize: 16, color: '#38bdf8' }}>Zonal Operations Manager (POC)</h4>
                <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 6 }}>Murugan (Zonal Officer)</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Phone: +91 98421 00002</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Scope: Zone 1 - Ramanathapuram</p>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 22 }}>
                <h4 style={{ margin: 0, fontSize: 16, color: '#a78bfa' }}>Regional State Admin (POC)</h4>
                <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 6 }}>Selvakumar (State Admin)</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Phone: +91 98421 00001</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Scope: Tamil Nadu State</p>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 22 }}>
                <h4 style={{ margin: 0, fontSize: 16, color: '#34d399' }}>Accounts & Billing Desk (POC)</h4>
                <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 6 }}>Finance & Settlement Desk</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Phone: +91 98421 00015</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Email: finance@stylebook.in</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD / REQUEST CUSTOM SERVICE (FOR OWNERS & ADMINS) */}
      {showAddServiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 14, width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
              {currentUser.hierarchyLevel <= 3 ? 'Add Master Service & Set Floor Price' : 'Request / Add Custom Service for Your Salon'}
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              {currentUser.hierarchyLevel <= 3 
                ? 'Adds to global master catalog with immediate effect.'
                : 'Custom services require Zonal Manager approval before appearing on the customer marketplace.'}
            </p>

            <form onSubmit={handleCreateService} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input 
                type="text" placeholder="Service Name (e.g. Keratin Hair Treatment)"
                value={newServiceForm.name}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <select 
                  value={newServiceForm.category}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                  style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
                >
                  <option value="Hair Care">Hair Care</option>
                  <option value="Shave & Beard">Shave & Beard</option>
                  <option value="Facial & Glow">Facial & Glow</option>
                  <option value="Bridal">Bridal</option>
                  <option value="Head Massage">Head Massage</option>
                </select>

                <input 
                  type="number" placeholder="Duration (mins)"
                  value={newServiceForm.duration}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, duration: e.target.value })}
                  style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <input 
                  type="number" placeholder="Proposed Custom Price (₹)"
                  value={newServiceForm.customPrice}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, customPrice: e.target.value, basePrice: e.target.value })}
                  style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
                />
                <input 
                  type="number" placeholder="Minimum Floor Price (₹)"
                  value={newServiceForm.minFloorPrice}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, minFloorPrice: e.target.value })}
                  style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddServiceModal(false)} style={{ background: '#374151', color: '#cbd5e1', padding: '9px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#7c3aed', color: '#fff', padding: '9px 18px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {currentUser.hierarchyLevel <= 3 ? 'Save Master Service' : 'Submit for Zonal Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TOP UP WALLET */}
      {showTopUpWalletModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 14, width: '100%', maxWidth: 420, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Top-Up Prepaid Security Wallet</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Maintains your balance to accept Pay-at-Salon cash appointments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <button 
                onClick={() => handleTopUpWallet(1000)}
                style={{ padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#34d399', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
              >
                + ₹1,000 (Quick Top-Up via UPI)
              </button>
              <button 
                onClick={() => handleTopUpWallet(2500)}
                style={{ padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#34d399', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
              >
                + ₹2,500 (Recommended Monthly Buffer)
              </button>
              <button 
                onClick={() => handleTopUpWallet(5000)}
                style={{ padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#34d399', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
              >
                + ₹5,000 (High Volume Multi-Branch)
              </button>
            </div>

            <div style={{ marginTop: 18, textAlign: 'right' }}>
              <button onClick={() => setShowTopUpWalletModal(false)} style={{ background: '#374151', color: '#cbd5e1', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECTION REASON */}
      {rejectionModalData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#1e293b', border: '1px solid #dc2626', borderRadius: 14, width: '100%', maxWidth: 440, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#f87171' }}>
              Reject {rejectionModalData.type}: {rejectionModalData.name}
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Provide clear feedback so the applicant can submit corrective details:
            </p>

            <textarea 
              rows={4}
              placeholder="e.g. Sanitation license missing, or proposed price is below the regional minimum floor price of ₹950."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #475569', borderRadius: 8, color: '#fff', fontSize: 13, marginTop: 14, boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button onClick={() => setRejectionModalData(null)} style={{ background: '#374151', color: '#cbd5e1', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleConfirmRejection} style={{ background: '#dc2626', color: '#fff', padding: '8px 18px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD BRANCH */}
      {showAddBranchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 14, width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Create New Branch Profile</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Branches created by owners enter Pending review before going live.</p>

            <form onSubmit={handleCreateBranch} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input 
                type="text" placeholder="Branch Name (e.g. Royal Classic - Puduvalasai)"
                value={newBranchForm.branchName}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, branchName: e.target.value })}
                style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
              />
              <input 
                type="text" placeholder="Address Line"
                value={newBranchForm.addressLine}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, addressLine: e.target.value })}
                style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <input 
                  type="text" placeholder="Site POC Name"
                  value={newBranchForm.pocName}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, pocName: e.target.value })}
                  style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
                />
                <input 
                  type="text" placeholder="Site POC Phone"
                  value={newBranchForm.pocPhone}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, pocPhone: e.target.value })}
                  style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cbd5e1', cursor: 'pointer', marginTop: 4 }}>
                <input 
                  type="checkbox" 
                  checked={newBranchForm.isDoorstepEnabled}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, isDoorstepEnabled: e.target.checked })}
                />
                Enable Doorstep Mobile Service for this Branch
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddBranchModal(false)} style={{ background: '#374151', color: '#cbd5e1', padding: '9px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#7c3aed', color: '#fff', padding: '9px 18px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TRANSFER STYLIST */}
      {showTransferStylistModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 14, width: '100%', maxWidth: 420, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Transfer Stylist to Branch</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Select target branch for reassignment:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleTransferStylist(showTransferStylistModal, b.id)}
                  style={{ background: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', padding: '10px 14px', borderRadius: 8, textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                >
                  📍 {b.branchName} ({b.locality})
                </button>
              ))}
            </div>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button onClick={() => setShowTransferStylistModal(null)} style={{ background: '#374151', color: '#cbd5e1', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
