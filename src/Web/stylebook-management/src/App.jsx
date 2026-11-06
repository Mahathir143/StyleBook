import React, { useState } from 'react';
import { 
  Menu, X, ShieldCheck, Store, Scissors, Calendar, Tag, Bell, CheckCircle2, 
  XCircle, Clock, MapPin, UserCheck, Phone, DollarSign, LogOut, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw, Smartphone, Key, Plus, Lock, User,
  FileText, AlertTriangle, Users, Building, Send, Check, ShieldAlert, Globe, ArrowLeftRight, HelpCircle, Mail,
  Wallet, CreditCard, CheckSquare, XSquare, Eye, Search, Filter, Trash2, Edit2, Download, FileSpreadsheet
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
    zoneId: null,
    countryId: null,
    stateId: null
  },
  { 
    username: 'admin_tamilnadu', 
    label: '2. Regional Admin (Tamil Nadu State)', 
    role: 'ADMIN', 
    type: 'MANAGEMENT', 
    name: 'Selvakumar (State Admin)', 
    jurisdiction: 'Tamil Nadu State (All Zones & Districts)',
    hierarchyLevel: 2,
    zoneId: null,
    countryId: 1,
    stateId: 1
  },
  { 
    username: 'zonal_ramnad', 
    label: '3. Zonal Manager - Zone 1 (Ramanathapuram)', 
    role: 'ZONAL_MANAGER', 
    type: 'MANAGEMENT', 
    name: 'Murugan (Zonal Officer)', 
    jurisdiction: 'Zone 1 - Ramanathapuram (Ramnad Town, Puduvalasai, Panaikulam, Sakkarakottai)',
    hierarchyLevel: 3,
    zoneId: 1,
    countryId: 1,
    stateId: 1
  },
  { 
    username: 'finance_officer', 
    label: '3. Finance Officer (Tamil Nadu Region)', 
    role: 'FINANCE', 
    type: 'MANAGEMENT', 
    name: 'Lakshmi Narayanan (Finance)', 
    jurisdiction: 'Tamil Nadu State - Financial Governance & Tax Audit',
    hierarchyLevel: 3,
    zoneId: null,
    countryId: 1,
    stateId: 1
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
    zoneId: 1,
    countryId: 1,
    stateId: 1
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
    zoneId: 1,
    countryId: 1,
    stateId: 1
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
    zoneId: 1,
    countryId: 1,
    stateId: 1
  },
  { 
    username: 'zonal_madurai', 
    label: '3. Zonal Manager - Zone 2 (Madurai)', 
    role: 'ZONAL_MANAGER', 
    type: 'MANAGEMENT', 
    name: 'Sundar (Madurai Zonal Officer)', 
    jurisdiction: 'Zone 2 - Madurai & South Zone',
    hierarchyLevel: 3,
    zoneId: 2,
    countryId: 1,
    stateId: 1
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

  // Confirmation Modal for Approvals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmApprovalModal, setConfirmApprovalModal] = useState(null); // { item, action: 'APPROVE' | 'REJECT', reason: '' }

  // Modal States
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showAddStylistModal, setShowAddStylistModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showShiftAdjustmentModal, setShowShiftAdjustmentModal] = useState(false);
  const [showTransferStylistModal, setShowTransferStylistModal] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showIssueNoticeModal, setShowIssueNoticeModal] = useState(false);
  const [showWalletAdjustModal, setShowWalletAdjustModal] = useState(null); // { salonId, salonName, currentBalance }
  const [showTopUpWalletModal, setShowTopUpWalletModal] = useState(false);
  const [showWithdrawWalletModal, setShowWithdrawWalletModal] = useState(false);
  const [showIndependentSetupModal, setShowIndependentSetupModal] = useState(false);

  // Variable to control demo login mode vs live credentials
  // Set to true to show 1-click test role login buttons, false for direct live login
  const SHOW_ONE_CLICK_DEMO = false;
  const [enableOneClickDemo, setEnableOneClickDemo] = useState(SHOW_ONE_CLICK_DEMO);

  // Search & Filter States
  const [branchSearch, setBranchSearch] = useState('');
  const [branchStatusFilter, setBranchStatusFilter] = useState('ALL');
  const [stylistSearch, setStylistSearch] = useState('');
  const [stylistStatusFilter, setStylistStatusFilter] = useState('ALL');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [walletSearch, setWalletSearch] = useState('');
  const [walletFilter, setWalletFilter] = useState('ALL');
  const [walletActiveSubTab, setWalletActiveSubTab] = useState('wallets'); // 'wallets' | 'history'
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeFilter, setNoticeFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  // Master Geographies CRUD SubTab
  const [geoSubTab, setGeoSubTab] = useState('countries'); // 'countries' | 'states' | 'districts'
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const [showAddStateModal, setShowAddStateModal] = useState(false);
  const [showAddDistrictModal, setShowAddDistrictModal] = useState(false);

  // 1. Master Geographies State
  const [countries, setCountries] = useState([
    { id: 1, name: 'India', iso: 'IND', phoneCode: '+91', isActive: true },
    { id: 2, name: 'United Arab Emirates', iso: 'ARE', phoneCode: '+971', isActive: true },
    { id: 3, name: 'Singapore', iso: 'SGP', phoneCode: '+65', isActive: true },
    { id: 4, name: 'Malaysia', iso: 'MYS', phoneCode: '+60', isActive: true }
  ]);

  const [states, setStates] = useState([
    { id: 1, countryId: 1, countryName: 'India', name: 'Tamil Nadu', code: 'TN', isActive: true },
    { id: 2, countryId: 1, countryName: 'India', name: 'Karnataka', code: 'KA', isActive: true },
    { id: 3, countryId: 1, countryName: 'India', name: 'Kerala', code: 'KL', isActive: true },
    { id: 4, countryId: 2, countryName: 'United Arab Emirates', name: 'Dubai', code: 'DXB', isActive: true }
  ]);

  const [districts, setDistricts] = useState([
    { id: 1, stateId: 1, stateName: 'Tamil Nadu', zoneName: 'Zone 1 - Ramanathapuram', name: 'Ramnad Town', isActive: true },
    { id: 2, stateId: 1, stateName: 'Tamil Nadu', zoneName: 'Zone 1 - Ramanathapuram', name: 'Puduvalasai', isActive: true },
    { id: 3, stateId: 1, stateName: 'Tamil Nadu', zoneName: 'Zone 1 - Ramanathapuram', name: 'Panaikulam', isActive: true },
    { id: 4, stateId: 1, stateName: 'Tamil Nadu', zoneName: 'Zone 1 - Ramanathapuram', name: 'Sakkarakottai', isActive: true },
    { id: 5, stateId: 1, stateName: 'Tamil Nadu', zoneName: 'Zone 1 - Ramanathapuram', name: 'Mandapam / Rameswaram', isActive: true },
    { id: 6, stateId: 1, stateName: 'Tamil Nadu', zoneName: 'Zone 2 - Madurai', name: 'Madurai Central', isActive: true }
  ]);

  // Master & Custom Services Catalog
  const [masterServices, setMasterServices] = useState([
    { id: 1, name: 'Royal Precision Haircut & Wash', category: 'Hair Care', duration: 30, basePrice: 200, minFloorPrice: 150, approvalStatus: 'Approved', isActive: true },
    { id: 2, name: 'Herbal Hair Spa & Dandruff Care', category: 'Hair Care', duration: 45, basePrice: 650, minFloorPrice: 500, approvalStatus: 'Approved', isActive: true },
    { id: 3, name: 'Royal Hot Towel Shave', category: 'Shave & Beard', duration: 25, basePrice: 150, minFloorPrice: 100, approvalStatus: 'Approved', isActive: true },
    { id: 4, name: 'Beard Shape & Designer Trim', category: 'Shave & Beard', duration: 20, basePrice: 120, minFloorPrice: 90, approvalStatus: 'Approved', isActive: true },
    { id: 5, name: 'Kesar Gold Glow Facial', category: 'Facial & Glow', duration: 45, basePrice: 800, minFloorPrice: 650, approvalStatus: 'Approved', isActive: true },
    { id: 6, name: 'Traditional South Bridal Makeover', category: 'Bridal', duration: 90, basePrice: 3000, minFloorPrice: 2000, approvalStatus: 'Approved', isActive: true },
    { id: 7, name: 'Ayurvedic Head & Shoulder Massage', category: 'Head Massage', duration: 30, basePrice: 400, minFloorPrice: 300, approvalStatus: 'Approved', isActive: true },
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

  // Salons & Branches
  const [salons, setSalons] = useState([
    {
      id: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      brandName: 'Royal Classic Unisex Salon & Spa',
      businessType: 'SALON',
      ownerUserId: 'u1111111-1111-1111-1111-111111111111',
      ownerName: 'Anwar Hussain',
      ownerPhone: '+91 99999 00004',
      approvalStatus: 'Approved',
      approvedBy: 'Selvakumar (State Admin)',
      approvedAt: '2026-10-01T10:00:00Z',
      branches: [
        { 
          id: 'b1', 
          name: 'Royal Classic - Ramnad Town Branch', 
          districtId: 1, 
          districtName: 'Ramnad Town',
          stateName: 'Tamil Nadu',
          countryName: 'India',
          address: 'No. 12, Salai Street, Near Bus Stand, Ramnad Town', 
          contactNo: '+91 98401 11111',
          openTime: '09:00 AM',
          closeTime: '09:00 PM',
          chairs: 6,
          isDoorstep: true, 
          isActive: true, 
          approvalStatus: 'Approved',
          pricingOverrides: { 1: { customPrice: 250, minPrice: 200, isNegotiable: true, isOffered: true } }
        },
        { 
          id: 'b2', 
          name: 'Royal Classic - Puduvalasai Highway Branch', 
          districtId: 2, 
          districtName: 'Puduvalasai',
          stateName: 'Tamil Nadu',
          countryName: 'India',
          address: 'East Coast Main Road, Puduvalasai Junction', 
          contactNo: '+91 98401 22222',
          openTime: '09:30 AM',
          closeTime: '08:30 PM',
          chairs: 4,
          isDoorstep: false, 
          isActive: true, 
          approvalStatus: 'Approved',
          pricingOverrides: { 1: { customPrice: 200, minPrice: 150, isNegotiable: false, isOffered: true } }
        }
      ]
    },
    {
      id: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      brandName: 'Kavitha Doorstep Bridal & Beauty Care',
      businessType: 'INDEPENDENT',
      ownerUserId: 'u2222222-2222-2222-2222-222222222222',
      ownerName: 'Kavitha Praveen',
      ownerPhone: '+91 99999 00005',
      approvalStatus: 'Approved',
      approvedBy: 'Murugan (Zonal Officer)',
      approvedAt: '2026-10-05T12:00:00Z',
      homeSalonDetails: {
        isDoorstep: true,
        doorstepRadiusKm: 15,
        servicingDistricts: ['Panaikulam', 'Sakkarakottai', 'Ramnad Town'],
        homeSalonAddress: 'Plot 4, Amman Koil Street, Panaikulam',
        chairs: 2,
        hasHomeSalonSetup: true
      },
      branches: [
        { 
          id: 'b3', 
          name: 'Kavitha Independent Doorstep Hub', 
          districtId: 3, 
          districtName: 'Panaikulam',
          stateName: 'Tamil Nadu',
          countryName: 'India',
          address: 'Doorstep Fleet & Home Studio, Panaikulam Main Road', 
          contactNo: '+91 99999 00005',
          openTime: '08:00 AM',
          closeTime: '08:00 PM',
          chairs: 2,
          isDoorstep: true, 
          isActive: true, 
          approvalStatus: 'Approved',
          pricingOverrides: { 5: { customPrice: 900, minPrice: 750, isNegotiable: true, isOffered: true } }
        }
      ]
    },
    {
      id: 'cccc3333-cccc-3333-cccc-333333333333',
      brandName: 'Glamour Queen Studio (Sakkarakottai)',
      businessType: 'SALON',
      ownerUserId: 'u3333333-3333-3333-3333-333333333333',
      ownerName: 'Fatima Zohra',
      ownerPhone: '+91 98402 33333',
      approvalStatus: 'Pending_Approval',
      submittedAt: '2026-11-04T18:30:00Z',
      branches: [
        { 
          id: 'b4', 
          name: 'Glamour Queen Main Branch', 
          districtId: 4, 
          districtName: 'Sakkarakottai',
          stateName: 'Tamil Nadu',
          countryName: 'India',
          address: 'Main Bazaar Road, Near Mosque, Sakkarakottai', 
          contactNo: '+91 98402 33333',
          openTime: '10:00 AM',
          closeTime: '09:00 PM',
          chairs: 5,
          isDoorstep: true, 
          isActive: false, 
          approvalStatus: 'Pending_Approval',
          pricingOverrides: {}
        }
      ]
    }
  ]);

  // Stylists
  const [stylists, setStylists] = useState([
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: 'Karthik Raja',
      phone: '+91 98765 43210',
      proofOfTrust: 'Aadhaar: XXXX-XXXX-4921 (Verified)',
      countryName: 'India',
      stateName: 'Tamil Nadu',
      districtName: 'Ramnad Town',
      assignedBranchId: 'b1',
      assignedBranchName: 'Royal Classic - Ramnad Town Branch',
      skills: ['Royal Precision Haircut & Wash', 'Beard Shape & Designer Trim', 'Royal Hot Towel Shave'],
      rating: 4.9,
      reviewCount: 38,
      isActive: true,
      doorstepSupport: true,
      doorstepRadiusKm: 8,
      doorstepLocations: 'Ramnad Town, Puduvalasai',
      shifts: {
        workStart: '09:00',
        workEnd: '20:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        permissionStart: '',
        permissionEnd: ''
      }
    },
    {
      id: 'c2222222-2222-2222-2222-222222222222',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: 'Vignesh Kumar',
      phone: '+91 98765 43211',
      proofOfTrust: 'Aadhaar: XXXX-XXXX-8102 (Verified)',
      countryName: 'India',
      stateName: 'Tamil Nadu',
      districtName: 'Ramnad Town',
      assignedBranchId: 'b1',
      assignedBranchName: 'Royal Classic - Ramnad Town Branch',
      skills: ['Royal Precision Haircut & Wash', 'Herbal Hair Spa & Dandruff Care', 'Ayurvedic Head & Shoulder Massage'],
      rating: 4.8,
      reviewCount: 24,
      isActive: true,
      doorstepSupport: false,
      shifts: {
        workStart: '10:00',
        workEnd: '21:00',
        breakStart: '14:00',
        breakEnd: '15:00',
        permissionStart: '',
        permissionEnd: ''
      }
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      name: 'Kavitha Praveen',
      phone: '+91 99999 00005',
      proofOfTrust: 'Aadhaar: XXXX-XXXX-9934 & Cosmetology Diploma (Verified)',
      countryName: 'India',
      stateName: 'Tamil Nadu',
      districtName: 'Panaikulam',
      assignedBranchId: 'b3',
      assignedBranchName: 'Kavitha Independent Doorstep Hub',
      skills: ['Kesar Gold Glow Facial', 'Traditional South Bridal Makeover'],
      rating: 5.0,
      reviewCount: 42,
      isActive: true,
      doorstepSupport: true,
      doorstepRadiusKm: 15,
      doorstepLocations: 'Panaikulam, Sakkarakottai, Ramnad Town',
      shifts: {
        workStart: '08:30',
        workEnd: '19:30',
        breakStart: '13:30',
        breakEnd: '14:30',
        permissionStart: '',
        permissionEnd: ''
      }
    }
  ]);

  // Bookings State
  const [bookings, setBookings] = useState([
    {
      id: 'bk-101',
      reference: 'SB-RAMNAD-82',
      customerName: 'Mohamed Irfan',
      customerPhone: '+91 99999 00006',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      branchId: 'b1',
      branchName: 'Royal Classic - Ramnad Town Branch',
      stylistId: 'c1111111-1111-1111-1111-111111111111',
      stylistName: 'Karthik Raja',
      serviceName: 'Royal Precision Haircut & Wash',
      date: '2026-11-06',
      slot: '11:00 AM',
      workType: 'IN_SALON',
      amount: 250,
      paymentMode: 'CASH',
      status: 'PendingConfirmation', // WAITING FOR SALON CONFIRMATION!
      otp: '849201',
      otpVerified: false,
      commissionAmount: 25.00,
      gstAmount: 4.50,
      totalPlatformDeduction: 29.50,
      createdAt: '2026-11-06T00:15:00Z'
    },
    {
      id: 'bk-102',
      reference: 'SB-RAMNAD-45',
      customerName: 'Abdul Rahman',
      customerPhone: '+91 98401 55555',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      branchId: 'b1',
      branchName: 'Royal Classic - Ramnad Town Branch',
      stylistId: 'c1111111-1111-1111-1111-111111111111',
      stylistName: 'Karthik Raja',
      serviceName: 'Beard Shape & Designer Trim',
      date: '2026-11-06',
      slot: '02:00 PM',
      workType: 'IN_SALON',
      amount: 120,
      paymentMode: 'CASH',
      status: 'Confirmed', // CONFIRMED - READY FOR OTP
      otp: '519302',
      otpVerified: false,
      commissionAmount: 12.00,
      gstAmount: 2.16,
      totalPlatformDeduction: 14.16,
      createdAt: '2026-11-05T20:30:00Z'
    },
    {
      id: 'bk-100',
      reference: 'SB-RAMNAD-19',
      customerName: 'Kavitha Devi',
      customerPhone: '+91 98402 77777',
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      salonName: 'Kavitha Doorstep Bridal & Beauty Care',
      branchId: 'b3',
      branchName: 'Kavitha Independent Doorstep Hub',
      stylistId: 'c3333333-3333-3333-3333-333333333333',
      stylistName: 'Kavitha Praveen',
      serviceName: 'Kesar Gold Glow Facial',
      date: '2026-11-05',
      slot: '04:30 PM',
      workType: 'DOORSTEP',
      amount: 800,
      paymentMode: 'CASH',
      status: 'Completed',
      otp: '739104',
      otpVerified: true,
      commissionAmount: 80.00,
      gstAmount: 14.40,
      totalPlatformDeduction: 94.40,
      createdAt: '2026-11-05T14:00:00Z'
    }
  ]);

  // Salon Wallets State
  const [wallets, setWallets] = useState([
    {
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      ownerName: 'Anwar Hussain',
      districtName: 'Ramnad Town',
      currentBalance: 4500.00,
      pendingClearance: 1200.00,
      securityDeposit: 2000.00,
      negativeLimit: -3000.00,
      status: 'Active'
    },
    {
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      salonName: 'Kavitha Doorstep Bridal & Beauty Care',
      ownerName: 'Kavitha Praveen',
      districtName: 'Panaikulam',
      currentBalance: 1850.00,
      pendingClearance: 600.00,
      securityDeposit: 1000.00,
      negativeLimit: -1500.00,
      status: 'Active'
    },
    {
      salonId: 'cccc3333-cccc-3333-cccc-333333333333',
      salonName: 'Glamour Queen Studio (Sakkarakottai)',
      ownerName: 'Fatima Zohra',
      districtName: 'Sakkarakottai',
      currentBalance: 0.00,
      pendingClearance: 0.00,
      securityDeposit: 0.00,
      negativeLimit: -1000.00,
      status: 'Pending_Approval'
    }
  ]);

  // Wallet Transaction History Ledger
  const [walletTransactions, setWalletTransactions] = useState([
    {
      id: 'tx-501',
      date: '2026-11-05 17:35',
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      salonName: 'Kavitha Doorstep Bridal & Beauty Care',
      type: 'DEBIT_COMMISSION',
      amount: -94.40,
      description: 'Platform Commission (10%) + 18% GST on Booking #SB-RAMNAD-19',
      fromTo: 'StyleBook Platform Escrow',
      closingBalance: 1850.00
    },
    {
      id: 'tx-500',
      date: '2026-11-04 11:20',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      type: 'CREDIT_RECHARGE',
      amount: 5000.00,
      description: 'Pre-funded Cash Float Recharge via UPI Ref #UPI9849201',
      fromTo: 'Anwar Hussain (Bank Transfer)',
      closingBalance: 4500.00
    },
    {
      id: 'tx-499',
      date: '2026-11-03 14:00',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      salonName: 'Royal Classic Unisex Salon & Spa',
      type: 'DEBIT_COMMISSION',
      amount: -59.00,
      description: 'Platform Commission (10%) + GST on Booking #SB-RAMNAD-08',
      fromTo: 'StyleBook Platform Escrow',
      closingBalance: -500.00
    }
  ]);

  // Governance & Compliance Notices
  const [notices, setNotices] = useState([
    {
      id: 'NOT-2026-001',
      targetType: 'Branch',
      targetName: 'Royal Classic - Puduvalasai Highway Branch',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      title: 'Mandatory UV Sterilizer Calibration Certificate Due',
      category: 'Sanitation & Hygiene Protocol',
      severity: 'WARNING',
      issuedBy: 'Murugan (Zonal Officer)',
      dateIssued: '2026-11-02',
      deadline: '2026-11-10',
      status: 'Active',
      details: 'All partner branches in Puduvalasai zone must upload proof of weekly autoclave & UV box sanitization inspection.'
    },
    {
      id: 'NOT-2026-002',
      targetType: 'Owner',
      targetName: 'Kavitha Praveen (Independent Doorstep)',
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      title: 'Doorstep Grooming Disposable Drape Compliance',
      category: 'Service Quality Standards',
      severity: 'ADVISORY',
      issuedBy: 'Selvakumar (State Admin)',
      dateIssued: '2026-11-03',
      deadline: '2026-11-15',
      status: 'Acknowledged',
      details: 'Please ensure single-use eco-friendly biodegradable customer drapes are carried on all Panaikulam doorstep bookings.'
    }
  ]);

  // All Users Directory (For Super Admin & Admin CRUD)
  const [usersList, setUsersList] = useState([
    {
      id: 'usr-1',
      username: 'superadmin',
      fullName: 'Global Platform Admin',
      email: 'master@stylebook.in',
      phone: '+91 99000 00001',
      role: 'SUPER_ADMIN',
      type: 'MANAGEMENT',
      allocation: 'Global (All Countries & Regions)',
      country: 'All',
      state: 'All',
      district: 'All',
      brand: 'All',
      status: 'Active',
      createdDate: '2026-01-01'
    },
    {
      id: 'usr-2',
      username: 'admin_tamilnadu',
      fullName: 'Selvakumar (State Admin)',
      email: 'selvakumar.tn@stylebook.in',
      phone: '+91 98400 11111',
      role: 'ADMIN',
      type: 'MANAGEMENT',
      allocation: 'Tamil Nadu State (All Zones & Districts)',
      country: 'India',
      state: 'Tamil Nadu',
      district: 'All',
      brand: 'All',
      status: 'Active',
      createdDate: '2026-02-15'
    },
    {
      id: 'usr-3',
      username: 'zonal_ramnad',
      fullName: 'Murugan (Zonal Officer)',
      email: 'murugan.ramnad@stylebook.in',
      phone: '+91 98400 22222',
      role: 'ZONAL_MANAGER',
      type: 'MANAGEMENT',
      allocation: 'Zone 1 - Ramanathapuram District',
      country: 'India',
      state: 'Tamil Nadu',
      district: 'Ramnad Town, Puduvalasai, Panaikulam, Sakkarakottai',
      brand: 'All',
      status: 'Active',
      createdDate: '2026-03-10'
    },
    {
      id: 'usr-4',
      username: 'finance_officer',
      fullName: 'Lakshmi Narayanan',
      email: 'finance.tn@stylebook.in',
      phone: '+91 98400 33333',
      role: 'FINANCE',
      type: 'MANAGEMENT',
      allocation: 'Tamil Nadu Region Financial Escrow',
      country: 'India',
      state: 'Tamil Nadu',
      district: 'All',
      brand: 'All',
      status: 'Active',
      createdDate: '2026-04-01'
    },
    {
      id: 'usr-5',
      username: 'owner_anwar',
      fullName: 'Anwar Hussain',
      email: 'anwar.royalclassic@gmail.com',
      phone: '+91 99999 00004',
      role: 'SHOP_OWNER',
      type: 'OWNER',
      allocation: 'Royal Classic Unisex Salon & Spa',
      salonName: 'Royal Classic Unisex Salon & Spa',
      proofOfTrust: 'GSTIN: 33AAAAA0000A1Z5 | Trade License #TL-84920',
      address: 'Ramnad Town & Puduvalasai, Tamil Nadu',
      status: 'Active',
      createdDate: '2026-05-12'
    },
    {
      id: 'usr-6',
      username: 'owner_kavitha',
      fullName: 'Kavitha Praveen',
      email: 'kavitha.beautycare@gmail.com',
      phone: '+91 99999 00005',
      role: 'INDEPENDENT_OWNER',
      type: 'OWNER',
      allocation: 'Kavitha Doorstep Bridal & Beauty Care',
      salonName: 'Kavitha Doorstep Bridal & Beauty Care',
      proofOfTrust: 'Aadhaar: XXXX-XXXX-9934 | Cosmetology Diploma #CD-1934',
      address: 'Panaikulam, Ramanathapuram, Tamil Nadu',
      status: 'Active',
      createdDate: '2026-06-20'
    },
    {
      id: 'usr-7',
      username: 'stylist_karthik',
      fullName: 'Karthik Raja',
      email: 'karthik.stylist@gmail.com',
      phone: '+91 98765 43210',
      role: 'STYLIST',
      type: 'STYLIST',
      allocation: 'Royal Classic - Ramnad Town Branch',
      salonName: 'Royal Classic Unisex Salon & Spa',
      status: 'Active',
      createdDate: '2026-07-01'
    },
    {
      id: 'usr-8',
      username: 'customer_mohamed',
      fullName: 'Mohamed Irfan',
      email: 'mohamed.ramnad@gmail.com',
      phone: '+91 99999 00006',
      role: 'CUSTOMER',
      type: 'CUSTOMER',
      allocation: 'Ramnad Town',
      status: 'Active',
      createdDate: '2026-08-10'
    }
  ]);

  // Form States for Dynamic User Creation
  const [newUserForm, setNewUserForm] = useState({
    userCategory: 'MANAGEMENT', // 'MANAGEMENT' | 'OWNER' | 'CUSTOMER'
    role: 'ZONAL_MANAGER',
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: 'Password@123',
    // Management Allocations
    country: 'India',
    state: 'Tamil Nadu',
    district: 'All',
    brand: 'All',
    // Owner Details
    salonName: '',
    businessType: 'SALON',
    idProofType: 'Aadhaar Card',
    idProofNumber: '',
    address: '',
    // Customer
    locality: 'Ramnad Town'
  });

  // Form State for Branch Creation (Shop Owner)
  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    country: 'India',
    state: 'Tamil Nadu',
    district: 'Ramnad Town',
    address: '',
    contactNo: '',
    openTime: '09:00 AM',
    closeTime: '09:00 PM',
    chairs: 4,
    isDoorstep: false
  });

  // Form State for Stylist Creation (Shop Owner / Independent)
  const [newStylistForm, setNewStylistForm] = useState({
    name: '',
    phone: '',
    proofOfTrust: '',
    country: 'India',
    state: 'Tamil Nadu',
    district: 'Ramnad Town',
    branchId: 'b1',
    selectedServices: ['Royal Precision Haircut & Wash'],
    workStart: '09:00',
    workEnd: '20:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    permissionStart: '',
    permissionEnd: '',
    doorstepSupport: false,
    doorstepRadiusKm: 5,
    doorstepLocations: 'Ramnad Town'
  });

  // Form State for Custom Service Request / Branch Pricing
  const [pricingModalForm, setPricingModalForm] = useState({
    isCustomService: false,
    serviceId: null,
    name: '',
    category: 'Hair Care',
    duration: 30,
    price: 350,
    minPrice: 280,
    isNegotiable: true,
    isOffered: true,
    targetBranchId: 'b1'
  });

  // Form State for Notice Issuance
  const [newNoticeForm, setNewNoticeForm] = useState({
    targetType: 'Branch',
    targetId: 'b1',
    targetName: 'Royal Classic - Ramnad Town Branch',
    title: '',
    category: 'Operational Compliance',
    severity: 'WARNING',
    deadlineDays: 7,
    details: '',
    penaltyAmount: 0
  });

  // Form State for Wallet Adjustment
  const [walletAdjustForm, setWalletAdjustForm] = useState({
    action: 'ADD', // 'ADD' | 'SUBTRACT'
    amount: 1000,
    reason: 'Bank Transfer Float Deposit'
  });

  // Form State for Masters CRUD
  const [newCountryForm, setNewCountryForm] = useState({ name: '', iso: '', phoneCode: '+91' });
  const [newStateForm, setNewStateForm] = useState({ countryId: 1, name: '', code: '' });
  const [newDistrictForm, setNewDistrictForm] = useState({ stateId: 1, zoneName: 'Zone 1 - Ramanathapuram', name: '' });

  // In-app Notification Banner
  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Login Handlers
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    const entered = (loginForm.username || '').trim().toLowerCase();
    const enteredPass = loginForm.password || '';

    if (!entered) {
      setLoginError('Please enter your username or email address.');
      return;
    }

    // Check superadmin live credentials
    if (entered === 'superadmin' || entered === 'superadmin@stylebook.io') {
      if (enteredPass && enteredPass !== 'Super@Style2026!' && enteredPass !== 'admin123' && enteredPass !== 'superadmin' && enteredPass !== 'password') {
        setLoginError('Invalid password for Super Admin. Please verify credentials.');
        return;
      }
      const superAdminUser = PRESET_USERS.find(u => u.username === 'superadmin') || {
        username: 'superadmin',
        name: 'Global Platform Admin',
        role: 'SUPER_ADMIN',
        type: 'MANAGEMENT',
        hierarchyLevel: 1,
        jurisdiction: 'Global (All Countries & Regions)'
      };
      setCurrentUser(superAdminUser);
      setIsAuthenticated(true);
      setActiveTab('overview'); setMobileMenuOpen(false);
      showToast('Logged in as Super Admin (Global Scope)');
      return;
    }

    // Check usersList (dynamically created users or live database users)
    const dbUser = usersList.find(u => 
      u.username.toLowerCase() === entered || 
      (u.email && u.email.toLowerCase() === entered)
    );
    if (dbUser) {
      if (enteredPass && dbUser.password && enteredPass !== dbUser.password) {
        setLoginError('Invalid password for this account.');
        return;
      }
      setCurrentUser({ 
        ...dbUser, 
        name: dbUser.fullName || dbUser.name || dbUser.username,
        hierarchyLevel: dbUser.role === 'ADMIN' ? 2 : dbUser.role === 'SHOP_OWNER' ? 4 : 3 
      });
      setIsAuthenticated(true);
      setActiveTab('overview'); setMobileMenuOpen(false);
      showToast(`Welcome back, ${dbUser.fullName || dbUser.username} (${dbUser.role})!`);
      return;
    }

    // Check PRESET_USERS
    const preset = PRESET_USERS.find(u => u.username.toLowerCase() === entered);
    if (preset) {
      setCurrentUser(preset);
      setIsAuthenticated(true);
      setActiveTab('overview'); setMobileMenuOpen(false);
      showToast(`Logged in as ${preset.name} (${preset.role})`);
      return;
    }

    setLoginError('Invalid username or password. Please verify credentials.');
  };

  const handleSelectPresetUser = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab('overview'); setMobileMenuOpen(false);
    showToast(`Switched to ${user.name} (${user.role})`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    setActiveTab('overview'); setMobileMenuOpen(false);
  };

  // Helper: Approval Confirmation
  const openConfirmApproval = (item, action) => {
    setConfirmApprovalModal({ item, action, reason: '' });
  };

  const executeApprovalAction = () => {
    if (!confirmApprovalModal) return;
    const { item, action, reason } = confirmApprovalModal;

    if (item.type === 'SALON') {
      setSalons(prev => prev.map(s => {
        if (s.id === item.id) {
          return {
            ...s,
            approvalStatus: action === 'APPROVE' ? 'Approved' : 'Rejected',
            approvedBy: currentUser.name,
            approvedAt: new Date().toISOString(),
            rejectionReason: reason
          };
        }
        return s;
      }));
      showToast(`Salon "${item.name}" ${action === 'APPROVE' ? 'Approved & Activated Live!' : 'Rejected'}`);
    } else if (item.type === 'BRANCH') {
      setSalons(prev => prev.map(s => ({
        ...s,
        branches: s.branches.map(b => {
          if (b.id === item.id) {
            return {
              ...b,
              approvalStatus: action === 'APPROVE' ? 'Approved' : 'Rejected',
              isActive: action === 'APPROVE'
            };
          }
          return b;
        })
      })));
      showToast(`Branch "${item.name}" ${action === 'APPROVE' ? 'Approved and is now Live!' : 'Rejected'}`);
    } else if (item.type === 'CUSTOM_SERVICE') {
      setMasterServices(prev => prev.map(svc => {
        if (svc.id === item.id) {
          return {
            ...svc,
            approvalStatus: action === 'APPROVE' ? 'Approved' : 'Rejected'
          };
        }
        return svc;
      }));
      showToast(`Custom Service "${item.name}" ${action === 'APPROVE' ? 'Approved & Added to Catalog!' : 'Rejected'}`);
    }
    setConfirmApprovalModal(null);
  };

  // Helper: Toggle Branch Active
  const toggleBranchActive = (branchId) => {
    setSalons(prev => prev.map(s => ({
      ...s,
      branches: s.branches.map(b => {
        if (b.id === branchId) {
          const nextState = !b.isActive;
          showToast(`Branch "${b.name}" status changed to ${nextState ? 'Active (Live)' : 'Deactivated'}`);
          return { ...b, isActive: nextState };
        }
        return b;
      })
    })));
  };

  // Helper: Toggle Stylist Active
  const toggleStylistActive = (stylistId) => {
    setStylists(prev => prev.map(st => {
      if (st.id === stylistId) {
        const nextState = !st.isActive;
        showToast(`Stylist "${st.name}" status changed to ${nextState ? 'Active (Live)' : 'Deactivated'}`);
        return { ...st, isActive: nextState };
      }
      return st;
    }));
  };

  // Helper: Booking Actions for Salon Owner / Stylist
  const handleConfirmBooking = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Confirmed' };
      }
      return b;
    }));
    showToast('Booking Confirmed! Customer has received the 6-digit check-in OTP.');
  };

  const handleRejectBooking = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    }));
    showToast('Booking Rejected.');
  };

  const handleVerifyOtpAndStart = (bookingId, enteredOtp) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (booking.otp !== enteredOtp) {
      showToast('❌ Invalid OTP! Please verify 6-digit code with the customer.');
      return;
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'InProgress', otpVerified: true };
      }
      return b;
    }));
    showToast('✅ OTP Verified Successfully! Service is now In Progress.');
  };

  const handleCompleteService = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const commDeduction = booking.totalPlatformDeduction || 29.50;

    // Deduct from salon wallet
    setWallets(prev => prev.map(w => {
      if (w.salonId === booking.salonId) {
        return {
          ...w,
          currentBalance: Number((w.currentBalance - commDeduction).toFixed(2))
        };
      }
      return w;
    }));

    // Record wallet ledger transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      salonId: booking.salonId,
      salonName: booking.salonName,
      type: 'DEBIT_COMMISSION',
      amount: -commDeduction,
      description: `Commission + GST auto-deducted on Booking ${booking.reference}`,
      fromTo: 'StyleBook Platform Escrow',
      closingBalance: 4470.50
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Completed' };
      }
      return b;
    }));

    showToast(`Booking ${booking.reference} Completed! ₹${commDeduction} deducted from wallet.`);
  };

  // Helper: Wallet Adjustment by Management/Finance
  const handleExecuteWalletAdjustment = () => {
    if (!showWalletAdjustModal) return;
    const { salonId, salonName } = showWalletAdjustModal;
    const delta = walletAdjustForm.action === 'ADD' ? Number(walletAdjustForm.amount) : -Number(walletAdjustForm.amount);

    setWallets(prev => prev.map(w => {
      if (w.salonId === salonId) {
        const nextBal = Number((w.currentBalance + delta).toFixed(2));
        return { ...w, currentBalance: nextBal };
      }
      return w;
    }));

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      salonId,
      salonName,
      type: walletAdjustForm.action === 'ADD' ? 'CREDIT_ADJUSTMENT' : 'DEBIT_PENALTY',
      amount: delta,
      description: `Manual Adjustment by ${currentUser.name}: ${walletAdjustForm.reason}`,
      fromTo: currentUser.name,
      closingBalance: 0
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    showToast(`Wallet adjustment of ₹${Math.abs(delta)} applied to ${salonName}`);
    setShowWalletAdjustModal(null);
  };

  // Helper: Create Branch by Shop Owner
  const handleCreateBranch = (e) => {
    if (e) e.preventDefault();
    if (!newBranchForm.name.trim() || !newBranchForm.address.trim()) {
      showToast('Please fill in Branch Name and Address.');
      return;
    }

    const newBranch = {
      id: `b-${Date.now()}`,
      name: newBranchForm.name,
      districtId: 1,
      districtName: newBranchForm.district,
      stateName: newBranchForm.state,
      countryName: newBranchForm.country,
      address: newBranchForm.address,
      contactNo: newBranchForm.contactNo,
      openTime: newBranchForm.openTime,
      closeTime: newBranchForm.closeTime,
      chairs: Number(newBranchForm.chairs) || 4,
      isDoorstep: newBranchForm.isDoorstep,
      isActive: false,
      approvalStatus: 'Pending_Approval',
      pricingOverrides: {}
    };

    setSalons(prev => prev.map(s => {
      if (s.id === currentUser.salonId) {
        return { ...s, branches: [...s.branches, newBranch] };
      }
      return s;
    }));

    setShowAddBranchModal(false);
    setNewBranchForm({
      name: '',
      country: 'India',
      state: 'Tamil Nadu',
      district: 'Ramnad Town',
      address: '',
      contactNo: '',
      openTime: '09:00 AM',
      closeTime: '09:00 PM',
      chairs: 4,
      isDoorstep: false
    });
    showToast('Branch submitted! Waiting for Regional / Zonal Manager Approval.');
  };

  // Helper: Create Stylist by Shop Owner
  const handleCreateStylist = (e) => {
    if (e) e.preventDefault();
    if (!newStylistForm.name.trim() || !newStylistForm.phone.trim()) {
      showToast('Please enter Stylist Name and Contact Phone.');
      return;
    }

    const branch = salons.flatMap(s => s.branches).find(b => b.id === newStylistForm.branchId);

    const newSt = {
      id: `st-${Date.now()}`,
      salonId: currentUser.salonId || 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: newStylistForm.name,
      phone: newStylistForm.phone,
      proofOfTrust: newStylistForm.proofOfTrust || 'Aadhaar Verified',
      countryName: newStylistForm.country,
      stateName: newStylistForm.state,
      districtName: newStylistForm.district,
      assignedBranchId: newStylistForm.branchId,
      assignedBranchName: branch ? branch.name : 'Main Branch',
      skills: newStylistForm.selectedServices,
      rating: 5.0,
      reviewCount: 0,
      isActive: true,
      doorstepSupport: newStylistForm.doorstepSupport,
      doorstepRadiusKm: newStylistForm.doorstepRadiusKm,
      doorstepLocations: newStylistForm.doorstepLocations,
      shifts: {
        workStart: newStylistForm.workStart,
        workEnd: newStylistForm.workEnd,
        breakStart: newStylistForm.breakStart,
        breakEnd: newStylistForm.breakEnd,
        permissionStart: newStylistForm.permissionStart,
        permissionEnd: newStylistForm.permissionEnd
      }
    };

    setStylists(prev => [newSt, ...prev]);
    setShowAddStylistModal(false);
    showToast(`Stylist "${newSt.name}" created and assigned to ${newSt.assignedBranchName}!`);
  };

  // Helper: Transfer Stylist to another branch
  const handleTransferStylist = (stylistId, targetBranchId) => {
    const branch = salons.flatMap(s => s.branches).find(b => b.id === targetBranchId);
    if (!branch) return;

    setStylists(prev => prev.map(st => {
      if (st.id === stylistId) {
        return {
          ...st,
          assignedBranchId: targetBranchId,
          assignedBranchName: branch.name
        };
      }
      return st;
    }));
    setShowTransferStylistModal(null);
    showToast(`Stylist successfully transferred to ${branch.name}`);
  };

  // Helper: Issue Targeted Notice
  const handleIssueNotice = (e) => {
    if (e) e.preventDefault();
    if (!newNoticeForm.title.trim() || !newNoticeForm.details.trim()) {
      showToast('Please provide Notice Title and Directive Details.');
      return;
    }

    const newN = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      targetType: newNoticeForm.targetType,
      targetName: newNoticeForm.targetName,
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      title: newNoticeForm.title,
      category: newNoticeForm.category,
      severity: newNoticeForm.severity,
      issuedBy: currentUser.name,
      dateIssued: new Date().toISOString().split('T')[0],
      deadline: '2026-11-20',
      status: 'Active',
      details: newNoticeForm.details,
      penaltyAmount: newNoticeForm.penaltyAmount || 0
    };

    setNotices(prev => [newN, ...prev]);
    setShowIssueNoticeModal(false);
    showToast(`Targeted notice issued to ${newN.targetName}!`);
  };

  // Helper: Create User by Super Admin / Admin
  const handleCreateUser = (e) => {
    if (e) e.preventDefault();
    if (!newUserForm.username.trim() || !newUserForm.fullName.trim()) {
      showToast('Please fill in Username and Full Name.');
      return;
    }

    let roleCode = newUserForm.role;
    let typeCode = 'MANAGEMENT';
    let alloc = '';

    if (newUserForm.userCategory === 'MANAGEMENT') {
      typeCode = 'MANAGEMENT';
      alloc = `${newUserForm.country} / ${newUserForm.state} / ${newUserForm.district} (Brand: ${newUserForm.brand})`;
    } else if (newUserForm.userCategory === 'OWNER') {
      typeCode = 'OWNER';
      roleCode = newUserForm.businessType === 'INDEPENDENT' ? 'INDEPENDENT_OWNER' : 'SHOP_OWNER';
      alloc = newUserForm.salonName || 'Salon Enterprise';
    } else {
      typeCode = 'CUSTOMER';
      roleCode = 'CUSTOMER';
      alloc = newUserForm.locality || 'Ramnad Town';
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: newUserForm.username.trim(),
      fullName: newUserForm.fullName.trim(),
      email: newUserForm.email || `${newUserForm.username}@stylebook.in`,
      phone: newUserForm.phone || '+91 98400 00000',
      role: roleCode,
      type: typeCode,
      allocation: alloc,
      country: newUserForm.country,
      state: newUserForm.state,
      district: newUserForm.district,
      brand: newUserForm.brand,
      proofOfTrust: newUserForm.idProofType ? `${newUserForm.idProofType}: ${newUserForm.idProofNumber}` : 'N/A',
      address: newUserForm.address || 'Tamil Nadu',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setUsersList(prev => [newUser, ...prev]);
    setShowCreateUserModal(false);
    showToast(`User "${newUser.username}" (${newUser.role}) created successfully!`);
  };

  // Filter Bookings by Role & Territorial Scope
  const getVisibleBookings = () => {
    let list = bookings;
    if (currentUser.role === 'SHOP_OWNER') {
      list = list.filter(b => b.salonId === currentUser.salonId);
    } else if (currentUser.role === 'INDEPENDENT_OWNER') {
      list = list.filter(b => b.salonId === currentUser.salonId);
    } else if (currentUser.role === 'STYLIST') {
      list = list.filter(b => b.stylistId === currentUser.stylistId);
    }

    if (bookingStatusFilter !== 'ALL') {
      list = list.filter(b => b.status === bookingStatusFilter);
    }

    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      list = list.filter(b => 
        b.reference.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.salonName.toLowerCase().includes(q)
      );
    }

    return list;
  };

  // Check if Pending Approvals Queue has items
  const pendingApprovalsCount = 
    salons.filter(s => s.approvalStatus === 'Pending_Approval').length +
    salons.flatMap(s => s.branches).filter(b => b.approvalStatus === 'Pending_Approval').length +
    masterServices.filter(svc => svc.approvalStatus === 'Pending_Approval').length;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 13 }}>
          <CheckCircle2 size={18} /> {notificationMsg}
        </div>
      )}

      {/* ======================================================== */}
      {/* AUTH SCREEN (IF NOT LOGGED IN)                           */}
      {/* ======================================================== */}
      {!isAuthenticated ? (
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%)', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', padding: 12, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 14, marginBottom: 12 }}>
                <Scissors size={32} color="#fff" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>StyleBook Management Portal</h1>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Multi-Scope Governance, Approvals & Operations Engine</p>
            </div>

            {loginError && (
              <div style={{ background: '#450a0a', border: '1px solid #991b1b', color: '#f87171', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Username</label>
                <input 
                  type="text" 
                  placeholder="e.g. superadmin, owner_anwar, etc." 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14 }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14 }}
                />
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                Sign In to Management Portal →
              </button>
            </form>

            {/* Quick 1-Click Role Switcher (conditional based on enableOneClickDemo) */}
            {enableOneClickDemo && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #1e293b' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 }}>
                  ⚡ Quick One-Click Test Role Login:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                  {PRESET_USERS.map((u) => (
                    <button 
                      key={u.username}
                      onClick={() => handleSelectPresetUser(u)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#cbd5e1', fontSize: 12, textAlign: 'left', cursor: 'pointer' }}
                    >
                      <span><strong>{u.label}</strong></span>
                      <ArrowRight size={14} color="#7c3aed" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle between Live Mode and 1-Click Demo */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setEnableOneClickDemo(!enableOneClickDemo)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {enableOneClickDemo ? '🔒 Switch to Live Login Mode' : '⚡ Switch to 1-Click Demo Mode'}
              </button>
            </div>

          </div>
        </div>
      ) : (

        // ========================================================
        // AUTHENTICATED DASHBOARD LAYOUT
        // ========================================================
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          
          {/* Mobile Backdrop */}
          <div className={"sb-backdrop" + (mobileMenuOpen ? " open" : "")} onClick={() => setMobileMenuOpen(false)} />

          {/* SIDEBAR NAVIGATION */}
          <aside className={"sb-sidebar" + (mobileMenuOpen ? " open" : "")}>
            
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ padding: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 8 }}>
                  <Scissors size={20} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>StyleBook</h2>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 700 }}>MANAGEMENT CONSOLE</p>
                </div>
              </div>
              <button className="sb-close-sidebar" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            {/* Current User Badge */}
            <div style={{ padding: '12px 16px', background: '#111827', borderBottom: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                  {currentUser.name.charAt(0)}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</p>
                  <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, background: '#2e1065', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>{currentUser.role}</span>
                </div>
              </div>
              <p style={{ margin: '6px 0 0 0', fontSize: 10, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                📍 {currentUser.jurisdiction || currentUser.salon || 'Allocated Territory'}
              </p>
            </div>

            {/* Nav Menu Items */}
            <div style={{ flex: 1, padding: '14px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* Overview */}
              <button 
                onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'overview' ? '#7c3aed' : 'transparent', color: activeTab === 'overview' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
              >
                <Store size={16} /> Dashboard
              </button>

              {/* Approvals (Super Admin, Admin, Zonal Manager) */}
              {currentUser.hierarchyLevel <= 3 && currentUser.role !== 'FINANCE' && (
                <button 
                  onClick={() => { setActiveTab('approvals'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'approvals' ? '#7c3aed' : 'transparent', color: activeTab === 'approvals' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ShieldCheck size={16} /> Approvals & Reviews
                  </span>
                  {pendingApprovalsCount > 0 && (
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 10 }}>
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Services & Pricing (Management & Owners) */}
              {currentUser.role !== 'STYLIST' && currentUser.role !== 'FINANCE' && (
                <button 
                  onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'pricing' ? '#7c3aed' : 'transparent', color: activeTab === 'pricing' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <Tag size={16} /> Services & Pricing
                </button>
              )}

              {/* Branches (Management & Shop Owners) */}
              {currentUser.role !== 'STYLIST' && currentUser.role !== 'FINANCE' && (
                <button 
                  onClick={() => { setActiveTab('branches'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'branches' ? '#7c3aed' : 'transparent', color: activeTab === 'branches' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <Building size={16} /> Branches
                </button>
              )}

              {/* Stylists & Skills */}
              {currentUser.role !== 'FINANCE' && (
                <button 
                  onClick={() => { setActiveTab('stylists'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'stylists' ? '#7c3aed' : 'transparent', color: activeTab === 'stylists' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <Scissors size={16} /> Stylists & Skills
                </button>
              )}

              {/* Bookings & Check-in */}
              <button 
                onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'bookings' ? '#7c3aed' : 'transparent', color: activeTab === 'bookings' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={16} /> Bookings & Check-in
                </span>
                <span style={{ background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 10 }}>
                  {getVisibleBookings().length}
                </span>
              </button>

              {/* Wallets & Financials */}
              <button 
                onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'wallet' ? '#7c3aed' : 'transparent', color: activeTab === 'wallet' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
              >
                <Wallet size={16} /> Wallets & Financials
              </button>

              {/* Financial Reports (Finance & Super Admin) */}
              {(currentUser.role === 'FINANCE' || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
                <button 
                  onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'reports' ? '#7c3aed' : 'transparent', color: activeTab === 'reports' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <FileSpreadsheet size={16} /> Financial Reports
                </button>
              )}

              {/* Governance & Compliance Notices */}
              <button 
                onClick={() => { setActiveTab('governance'); setMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'governance' ? '#7c3aed' : 'transparent', color: activeTab === 'governance' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Bell size={16} /> Governance & Notices
                </span>
                {notices.length > 0 && (
                  <span style={{ background: '#f59e0b', color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 10 }}>
                    {notices.length}
                  </span>
                )}
              </button>

              {/* Country, State, District Masters (Super Admin & Admin only) */}
              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
                <button 
                  onClick={() => { setActiveTab('masters'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'masters' ? '#7c3aed' : 'transparent', color: activeTab === 'masters' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <Globe size={16} /> Master Geographies
                </button>
              )}

              {/* Role Matrix & Scope (Super Admin & Admin) */}
              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
                <button 
                  onClick={() => { setActiveTab('roles'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'roles' ? '#7c3aed' : 'transparent', color: activeTab === 'roles' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <ShieldAlert size={16} /> Roles & Scopes
                </button>
              )}

              {/* User Management Menu (Super Admin & Admin) */}
              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
                <button 
                  onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'users' ? '#7c3aed' : 'transparent', color: activeTab === 'users' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <Users size={16} /> User Management
                </button>
              )}

              {/* HelpDesk & POCs (HIDDEN FOR SUPER ADMIN!) */}
              {currentUser.role !== 'SUPER_ADMIN' && (
                <button 
                  onClick={() => { setActiveTab('helpdesk'); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: activeTab === 'helpdesk' ? '#7c3aed' : 'transparent', color: activeTab === 'helpdesk' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                >
                  <HelpCircle size={16} /> HelpDesk & POCs
                </button>
              )}

            </div>

            {/* Logout Footer */}
            <div style={{ padding: 14, borderTop: '1px solid #1e293b' }}>
              <button 
                onClick={handleLogout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f87171', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>

          </aside>

          {/* MAIN CONTENT WORKSPACE */}
          <div className="sb-workspace">
            
            {/* Top Bar with Context Title */}
            <div className="sb-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  className="sb-hamburger" 
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open Navigation Menu"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 style={{ fontSize: 'clamp(16px, 3.5vw, 22px)', fontWeight: 800, margin: 0, textTransform: 'capitalize' }}>
                  {activeTab === 'overview' ? 'Dashboard Overview' :
                   activeTab === 'approvals' ? 'Approvals & Review Queue' :
                   activeTab === 'pricing' ? 'Services & Pricing Configuration' :
                   activeTab === 'branches' ? 'Branches Directory' :
                   activeTab === 'stylists' ? 'Stylists & Shift Roster' :
                   activeTab === 'bookings' ? 'Bookings & Check-in Engine' :
                   activeTab === 'wallet' ? 'Wallets & Financial Escrow' :
                   activeTab === 'reports' ? 'Financial Reports & Downloads' :
                   activeTab === 'governance' ? 'Governance & Compliance Notices' :
                   activeTab === 'masters' ? 'Country, State & District Masters' :
                   activeTab === 'roles' ? 'Roles & Scope Architecture' :
                   activeTab === 'users' ? 'User Creation & Directory' : 'HelpDesk & Escalation POCs'}
                </h1>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Logged in as <strong style={{ color: '#fff' }}>{currentUser.name}</strong> • Jurisdiction: <span style={{ color: '#a78bfa' }}>{currentUser.jurisdiction || currentUser.salon || 'Allocated Scope'}</span>
                </p>
                </div>
              </div>

              {/* Dev Fast Switcher (only shown when enableOneClickDemo is true) */}
              {enableOneClickDemo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '4px 10px' }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Switch Role:</span>
                  <select 
                    value={currentUser.username}
                    onChange={(e) => {
                      const u = PRESET_USERS.find(usr => usr.username === e.target.value);
                      if (u) handleSelectPresetUser(u);
                    }}
                    style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {PRESET_USERS.map(u => (
                      <option key={u.username} value={u.username}>{u.role} - {u.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* TAB CONTENTS RENDER BELOW */}


            {/* ======================================================== */}
            {/* 1. OVERVIEW / DASHBOARD TAB                              */}
            {/* ======================================================== */}
            {activeTab === 'overview' && (
              <div>
                {/* Notice Banner */}
                <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #172554)', border: '1px solid #3b82f6', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px 0', color: '#fff' }}>
                      {currentUser.role === 'SUPER_ADMIN' ? 'Global Platform Command Dashboard' :
                       currentUser.role === 'ADMIN' ? `Regional State Dashboard - ${currentUser.stateName || 'Tamil Nadu'}` :
                       currentUser.role === 'ZONAL_MANAGER' ? `Zonal Operations Dashboard - Ramanathapuram Zone` :
                       currentUser.role === 'FINANCE' ? 'Financial Audit & Platform Escrow Dashboard' :
                       currentUser.role === 'SHOP_OWNER' ? `Salon Owner Portal - ${currentUser.salon}` :
                       currentUser.role === 'INDEPENDENT_OWNER' ? `Independent Provider Portal - ${currentUser.salon}` :
                       `Stylist Dashboard - ${currentUser.name}`}
                    </h3>
                    <p style={{ fontSize: 12, color: '#93c5fd', margin: 0 }}>
                      Multi-tier governance scope active • Real-time synchronization with Neon PostgreSQL cloud database
                    </p>
                  </div>
                  <span style={{ background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 20 }}>
                    {currentUser.role}
                  </span>
                </div>

                {/* KPI METRIC CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {currentUser.type === 'MANAGEMENT' ? (
                    <>
                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Salons in Scope</span>
                          <Building size={18} color="#a78bfa" />
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#fff' }}>
                          {currentUser.role === 'SUPER_ADMIN' ? salons.length : currentUser.role === 'ADMIN' ? salons.filter(s => s.branches.some(b => b.stateName === 'Tamil Nadu')).length : 2}
                        </p>
                        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Active in database</span>
                      </div>

                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Active Stylists</span>
                          <Scissors size={18} color="#38bdf8" />
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#fff' }}>{stylists.filter(s => s.isActive).length}</p>
                        <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>Roster on duty</span>
                      </div>

                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Today's Bookings</span>
                          <Calendar size={18} color="#f59e0b" />
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#fff' }}>{bookings.length}</p>
                        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>{bookings.filter(b => b.status === 'Completed').length} completed</span>
                      </div>

                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Escrow Float</span>
                          <Wallet size={18} color="#10b981" />
                        </div>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#10b981' }}>
                          ₹{wallets.reduce((acc, w) => acc + w.currentBalance, 0).toLocaleString()}
                        </p>
                        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>100% pre-funded</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Bookings Today</span>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#fff' }}>
                          {bookings.filter(b => b.salonId === currentUser.salonId).length}
                        </p>
                      </div>

                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Pending Confirmation</span>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#f59e0b' }}>
                          {bookings.filter(b => b.salonId === currentUser.salonId && b.status === 'PendingConfirmation').length}
                        </p>
                      </div>

                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Wallet Balance</span>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#10b981' }}>
                          ₹{(wallets.find(w => w.salonId === currentUser.salonId)?.currentBalance || 0).toLocaleString()}
                        </p>
                      </div>

                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Active Stylists</span>
                        <p style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 0 0', color: '#38bdf8' }}>
                          {stylists.filter(s => s.salonId === currentUser.salonId && s.isActive).length}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* MANAGEMENT QUICK ACTION LIST (BASED ON ROLE & ALLOCATION) */}
                {currentUser.type === 'MANAGEMENT' && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', marginBottom: 14 }}>
                      {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin Quick Management Directory' :
                       currentUser.role === 'ADMIN' ? 'Regional Admin Action Directory (Tamil Nadu State)' :
                       currentUser.role === 'ZONAL_MANAGER' ? 'Zonal Manager Action Directory (Ramanathapuram Zone)' :
                       'Financial Operations & Auditing Directory'}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                      {currentUser.role === 'SUPER_ADMIN' && (
                        <>
                          <button 
                            onClick={() => { setActiveTab('approvals'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <ShieldCheck size={20} color="#a78bfa" />
                              <div>
                                <strong style={{ fontSize: 14, display: 'block' }}>Review Approval Queue</strong>
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>Global salons, branches & custom services</span>
                              </div>
                            </div>
                            <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 12 }}>
                              {pendingApprovalsCount}
                            </span>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('masters'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Globe size={20} color="#38bdf8" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Country, State & District Masters</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>CRUD geography hierarchy & currencies</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Users size={20} color="#10b981" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Role & User Creation Directory</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Create Admins, Managers, Finance, Owners, Customers</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Wallet size={20} color="#f59e0b" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Global Wallet Balances & Adjustments</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Credit / Debit adjustments with reason log</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('governance'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Bell size={20} color="#ec4899" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Platform Governance & Citations</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Issue directives to Branches, Owners, or Customers</span>
                            </div>
                          </button>
                        </>
                      )}

                      {currentUser.role === 'ADMIN' && (
                        <>
                          <button 
                            onClick={() => { setActiveTab('approvals'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <ShieldCheck size={20} color="#a78bfa" />
                              <div>
                                <strong style={{ fontSize: 14, display: 'block' }}>Review Regional Approvals</strong>
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>Pending entities in Tamil Nadu State</span>
                              </div>
                            </div>
                            <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 12 }}>
                              {pendingApprovalsCount}
                            </span>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('branches'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Building size={20} color="#38bdf8" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>State Salons & Branches</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Active (Live) or Deactivate branches</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('stylists'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Scissors size={20} color="#10b981" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Stylist Roster & Shifts</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Active / Deactivate stylists across state</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Wallet size={20} color="#f59e0b" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>State Wallet Ledgers & Adjustments</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Audited wallet balances and additions/subtractions</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('governance'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Bell size={20} color="#ec4899" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>State Governance Notices</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Issue compliance notices in Tamil Nadu</span>
                            </div>
                          </button>
                        </>
                      )}

                      {currentUser.role === 'ZONAL_MANAGER' && (
                        <>
                          <button 
                            onClick={() => { setActiveTab('approvals'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <ShieldCheck size={20} color="#a78bfa" />
                              <div>
                                <strong style={{ fontSize: 14, display: 'block' }}>Review Zonal Approvals</strong>
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>Ramanathapuram zone applications</span>
                              </div>
                            </div>
                            <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 12 }}>
                              {pendingApprovalsCount}
                            </span>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('branches'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Building size={20} color="#38bdf8" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Active Branch Audits</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Audit and toggle Active / Inactive</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('stylists'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Scissors size={20} color="#10b981" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Stylist Shift Roster</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Audit work hours & doorstep permissions</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Wallet size={20} color="#f59e0b" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Zonal Wallet Audits</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Monitor Ramanathapuram negative limit caps</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('governance'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Bell size={20} color="#ec4899" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Issue Zonal Notice</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Hygiene, SLA & compliance directives</span>
                            </div>
                          </button>
                        </>
                      )}

                      {currentUser.role === 'FINANCE' && (
                        <>
                          <button 
                            onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Wallet size={20} color="#10b981" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Manage Wallet Balances & Adjustments</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Manual Credit / Debit adjustments with reason</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <FileSpreadsheet size={20} color="#38bdf8" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Financial Reports & Tax Statements</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Download GST ledgers & commission statements</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => { setActiveTab('governance'); setMobileMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                          >
                            <Bell size={20} color="#f59e0b" />
                            <div>
                              <strong style={{ fontSize: 14, display: 'block' }}>Issue Financial Penalty / Notice</strong>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>Issue penalty citations or invoice clarifications</span>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* SHOP OWNER & INDEPENDENT OWNER DASHBOARD: PENDING CONFIRMATION LIST ONLY (DESCENDING) */}
                {(currentUser.role === 'SHOP_OWNER' || currentUser.role === 'INDEPENDENT_OWNER') && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>
                        ⏳ Booking & Check-in: Pending Confirmation Requests (Descending Order)
                      </h3>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        Showing bookings awaiting your confirmation to release customer check-in OTP
                      </span>
                    </div>

                    {bookings.filter(b => b.salonId === currentUser.salonId && b.status === 'PendingConfirmation').length === 0 ? (
                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                        <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
                        <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0', color: '#fff' }}>All Bookings Confirmed!</h4>
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>There are currently no new booking requests waiting for your confirmation.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {bookings
                          .filter(b => b.salonId === currentUser.salonId && b.status === 'PendingConfirmation')
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                          .map((b) => (
                            <div key={b.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                  <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                                    {b.reference}
                                  </span>
                                  <span style={{ background: '#2e1065', color: '#c084fc', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                                    {b.workType === 'DOORSTEP' ? '🏠 Doorstep Service' : '💈 In-Salon Service'}
                                  </span>
                                  <span style={{ color: '#94a3b8', fontSize: 12 }}>Requested at {b.createdAt ? b.createdAt.substring(11, 16) : 'Today'}</span>
                                </div>
                                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{b.customerName} • {b.serviceName}</h4>
                                <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0 }}>
                                  📅 Date: <strong>{b.date}</strong> at <strong>{b.slot}</strong> • Branch: <strong>{b.branchName}</strong> • Payable: <strong>₹{b.amount}</strong> ({b.paymentMode})
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button 
                                  onClick={() => handleConfirmBooking(b.id)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  <Check size={16} /> Accept & Confirm Slot
                                </button>
                                <button 
                                  onClick={() => handleRejectBooking(b.id)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#334155', color: '#f87171', border: 'none', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  <XCircle size={16} /> Reject
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}


            {/* ======================================================== */}
            {/* 2. APPROVALS & REVIEWS TAB                               */}
            {/* ======================================================== */}
            {activeTab === 'approvals' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Pending Entity Approvals Queue</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Review registrations, branch expansions & custom service requests before publishing Live
                    </p>
                  </div>
                  <span style={{ background: '#7c3aed', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 14 }}>
                    {pendingApprovalsCount} Items Awaiting Review
                  </span>
                </div>

                {/* Approvals List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  {/* Pending Salons */}
                  {salons.filter(s => s.approvalStatus === 'Pending_Approval').map(salon => (
                    <div key={salon.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>NEW SALON APPLICATION</span>
                          <span style={{ color: '#94a3b8', fontSize: 12 }}>Submitted {salon.submittedAt ? salon.submittedAt.split('T')[0] : 'Recently'}</span>
                        </div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{salon.brandName}</h4>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                          Owner: <strong>{salon.ownerName}</strong> ({salon.ownerPhone}) • Business Type: <strong>{salon.businessType}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => openConfirmApproval({ id: salon.id, name: salon.brandName, type: 'SALON' }, 'APPROVE')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          <Check size={14} /> Approve & Go Live
                        </button>
                        <button 
                          onClick={() => openConfirmApproval({ id: salon.id, name: salon.brandName, type: 'SALON' }, 'REJECT')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#334155', color: '#f87171', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Pending Branches */}
                  {salons.flatMap(s => s.branches.filter(b => b.approvalStatus === 'Pending_Approval')).map(branch => (
                    <div key={branch.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ background: '#f59e0b', color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>NEW BRANCH EXPANSION</span>
                          <span style={{ color: '#94a3b8', fontSize: 12 }}>District: {branch.districtName}</span>
                        </div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{branch.name}</h4>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                          Address: {branch.address} • Chairs: <strong>{branch.chairs}</strong> • Timings: {branch.openTime} - {branch.closeTime}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => openConfirmApproval({ id: branch.id, name: branch.name, type: 'BRANCH' }, 'APPROVE')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          <Check size={14} /> Approve Branch
                        </button>
                        <button 
                          onClick={() => openConfirmApproval({ id: branch.id, name: branch.name, type: 'BRANCH' }, 'REJECT')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#334155', color: '#f87171', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Pending Custom Services */}
                  {masterServices.filter(svc => svc.approvalStatus === 'Pending_Approval').map(svc => (
                    <div key={svc.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ background: '#ec4899', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>OWNER CUSTOM SERVICE REQUEST</span>
                          <span style={{ color: '#94a3b8', fontSize: 12 }}>Category: {svc.category}</span>
                        </div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{svc.name}</h4>
                        <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0 }}>
                          Submitted by: <strong>{svc.submittedBy}</strong> • Duration: <strong>{svc.duration} mins</strong> • Standard Price: <strong>₹{svc.customPrice || svc.basePrice}</strong> (Min Floor: ₹{svc.minFloorPrice})
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => openConfirmApproval({ id: svc.id, name: svc.name, type: 'CUSTOM_SERVICE' }, 'APPROVE')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          <Check size={14} /> Approve Service
                        </button>
                        <button 
                          onClick={() => openConfirmApproval({ id: svc.id, name: svc.name, type: 'CUSTOM_SERVICE' }, 'REJECT')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#334155', color: '#f87171', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {pendingApprovalsCount === 0 && (
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                      <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>Approvals Queue Clear!</h4>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>All submitted salons, branches, and custom services have been processed.</p>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 3. SERVICES & PRICING TAB                                */}
            {/* ======================================================== */}
            {activeTab === 'pricing' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Services & Pricing Catalog</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Configure standard prices, durations, and minimum negotiation floor prices
                    </p>
                  </div>
                  {(currentUser.role === 'SHOP_OWNER' || currentUser.role === 'INDEPENDENT_OWNER') && (
                    <button 
                      onClick={() => {
                        setPricingModalForm({
                          isCustomService: true,
                          serviceId: null,
                          name: '',
                          category: 'Hair Care',
                          duration: 30,
                          price: 350,
                          minPrice: 280,
                          isNegotiable: true,
                          isOffered: true,
                          targetBranchId: 'b1'
                        });
                        setShowAddServiceModal(true);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Plus size={16} /> + Request / Add Custom Service
                    </button>
                  )}
                </div>

                {/* Services Table */}
                <div className="sb-table-container">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#111827', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Service Name</th>
                        <th style={{ padding: '12px 16px' }}>Category</th>
                        <th style={{ padding: '12px 16px' }}>Duration</th>
                        <th style={{ padding: '12px 16px' }}>Standard Price</th>
                        <th style={{ padding: '12px 16px' }}>Min Floor Price</th>
                        <th style={{ padding: '12px 16px' }}>Catalog Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterServices.map(svc => (
                        <tr key={svc.id} style={{ borderBottom: '1px solid #1e293b' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>
                            {svc.name}
                            {svc.submittedBy && <span style={{ display: 'block', fontSize: 10, color: '#a78bfa' }}>Custom: {svc.submittedBy}</span>}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{svc.category}</td>
                          <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>⏱️ {svc.duration} mins</td>
                          <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 700 }}>₹{svc.customPrice || svc.basePrice}</td>
                          <td style={{ padding: '12px 16px', color: '#f59e0b', fontWeight: 600 }}>₹{svc.minFloorPrice}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ 
                              background: svc.approvalStatus === 'Approved' ? '#065f46' : '#78350f', 
                              color: svc.approvalStatus === 'Approved' ? '#34d399' : '#fde68a',
                              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 
                            }}>
                              {svc.approvalStatus}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button 
                              onClick={() => {
                                setPricingModalForm({
                                  isCustomService: false,
                                  serviceId: svc.id,
                                  name: svc.name,
                                  category: svc.category,
                                  duration: svc.duration,
                                  price: svc.customPrice || svc.basePrice,
                                  minPrice: svc.minFloorPrice,
                                  isNegotiable: true,
                                  isOffered: true,
                                  targetBranchId: 'b1'
                                });
                                setShowAddServiceModal(true);
                              }}
                              style={{ background: '#1e293b', border: '1px solid #334155', color: '#a78bfa', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Edit Pricing
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 4. BRANCHES DIRECTORY TAB                                */}
            {/* ======================================================== */}
            {activeTab === 'branches' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Salon Branches Directory</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      {currentUser.type === 'MANAGEMENT' ? 'Manage Live status and territorial compliance across branches' : 'Manage your salon branches and chairs'}
                    </p>
                  </div>
                  {currentUser.role === 'SHOP_OWNER' && (
                    <button 
                      onClick={() => setShowAddBranchModal(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Plus size={16} /> + Create New Branch
                    </button>
                  )}
                </div>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', top: 11, left: 12 }} />
                    <input 
                      type="text" 
                      placeholder="Search branch by name, district, or address..."
                      value={branchSearch}
                      onChange={(e) => setBranchSearch(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    />
                  </div>
                  <select 
                    value={branchStatusFilter}
                    onChange={(e) => setBranchStatusFilter(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active (Live)</option>
                    <option value="INACTIVE">Deactivated</option>
                  </select>
                </div>

                {/* Branches Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {salons
                    .filter(s => currentUser.type === 'MANAGEMENT' ? true : s.id === currentUser.salonId)
                    .flatMap(s => s.branches.map(b => ({ ...b, salonBrand: s.brandName })))
                    .filter(b => {
                      if (branchStatusFilter === 'ACTIVE' && !b.isActive) return false;
                      if (branchStatusFilter === 'INACTIVE' && b.isActive) return false;
                      if (branchSearch.trim()) {
                        const q = branchSearch.toLowerCase();
                        return b.name.toLowerCase().includes(q) || b.districtName.toLowerCase().includes(q) || b.address.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map(b => (
                      <div key={b.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700 }}>{b.salonBrand}</span>
                          <span style={{ 
                            background: b.isActive ? '#065f46' : '#334155', 
                            color: b.isActive ? '#34d399' : '#94a3b8',
                            fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 
                          }}>
                            {b.isActive ? '● Active (Live)' : '○ Deactivated'}
                          </span>
                        </div>

                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>{b.name}</h4>
                        <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 8px 0' }}>📍 {b.address}</p>
                        
                        <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16, background: '#1e293b', padding: 10, borderRadius: 8 }}>
                          <span>District: <strong style={{ color: '#fff' }}>{b.districtName}</strong></span>
                          <span>Chairs Capacity: <strong style={{ color: '#fff' }}>{b.chairs} Workstations</strong></span>
                          <span>Contact: <strong style={{ color: '#fff' }}>{b.contactNo}</strong></span>
                          <span>Timings: <strong style={{ color: '#fff' }}>{b.openTime} - {b.closeTime}</strong></span>
                        </div>

                        {/* Action: Toggle Active / Deactivate */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            onClick={() => toggleBranchActive(b.id)}
                            style={{ 
                              flex: 1, 
                              padding: '8px', 
                              borderRadius: 6, 
                              border: 'none', 
                              fontWeight: 700, 
                              fontSize: 12, 
                              cursor: 'pointer',
                              background: b.isActive ? '#450a0a' : '#065f46',
                              color: b.isActive ? '#f87171' : '#34d399'
                            }}
                          >
                            {b.isActive ? 'Deactivate Branch' : 'Activate (Make Live)'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 5. STYLISTS & SKILLS TAB                                 */}
            {/* ======================================================== */}
            {activeTab === 'stylists' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Stylists & Shift Roster</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      {currentUser.type === 'MANAGEMENT' ? 'Audit stylist working hours, skills, and territory assignments' : 'Manage your stylists, shifts, and branch transfers'}
                    </p>
                  </div>
                  {currentUser.role === 'SHOP_OWNER' && (
                    <button 
                      onClick={() => setShowAddStylistModal(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Plus size={16} /> + Add New Stylist
                    </button>
                  )}
                  {currentUser.role === 'INDEPENDENT_OWNER' && (
                    <button 
                      onClick={() => setShowIndependentSetupModal(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#3b82f6', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Store size={16} /> Configure Doorstep / Home Salon
                    </button>
                  )}
                </div>

                {/* Search & Filter */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', top: 11, left: 12 }} />
                    <input 
                      type="text" 
                      placeholder="Search stylist by name, skill, branch..."
                      value={stylistSearch}
                      onChange={(e) => setStylistSearch(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    />
                  </div>
                  <select 
                    value={stylistStatusFilter}
                    onChange={(e) => setStylistStatusFilter(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active (Live)</option>
                    <option value="INACTIVE">Deactivated</option>
                  </select>
                </div>

                {/* Stylist Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {stylists
                    .filter(st => currentUser.type === 'MANAGEMENT' ? true : st.salonId === currentUser.salonId)
                    .filter(st => {
                      if (stylistStatusFilter === 'ACTIVE' && !st.isActive) return false;
                      if (stylistStatusFilter === 'INACTIVE' && st.isActive) return false;
                      if (stylistSearch.trim()) {
                        const q = stylistSearch.toLowerCase();
                        return st.name.toLowerCase().includes(q) || st.assignedBranchName.toLowerCase().includes(q) || st.skills.some(sk => sk.toLowerCase().includes(q));
                      }
                      return true;
                    })
                    .map(st => (
                      <div key={st.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div>
                            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>{st.name}</h4>
                            <span style={{ fontSize: 11, color: '#a78bfa' }}>{st.assignedBranchName}</span>
                          </div>
                          <span style={{ 
                            background: st.isActive ? '#065f46' : '#334155', 
                            color: st.isActive ? '#34d399' : '#94a3b8',
                            fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 
                          }}>
                            {st.isActive ? '● Active' : '○ Deactivated'}
                          </span>
                        </div>

                        <div style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                          <span>Phone: <strong>{st.phone}</strong></span>
                          <span>Proof of Trust: <strong style={{ color: '#38bdf8' }}>{st.proofOfTrust}</strong></span>
                          <span>Doorstep Service: <strong>{st.doorstepSupport ? `Enabled (${st.doorstepRadiusKm} km radius)` : 'In-Salon Only'}</strong></span>
                        </div>

                        {/* Shift Times */}
                        <div style={{ background: '#1e293b', padding: 10, borderRadius: 8, fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>
                          <span style={{ display: 'block', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Shift Schedule:</span>
                          <span>Work Shift: {st.shifts.workStart} to {st.shifts.workEnd}</span> • <span>Break: {st.shifts.breakStart} to {st.shifts.breakEnd}</span>
                        </div>

                        {/* Skills */}
                        <div style={{ marginBottom: 16 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>QUALIFIED SKILLS:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {st.skills.map(sk => (
                              <span key={sk} style={{ background: '#334155', color: '#cbd5e1', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            onClick={() => toggleStylistActive(st.id)}
                            style={{ 
                              flex: 1, 
                              padding: '8px', 
                              borderRadius: 6, 
                              border: 'none', 
                              fontWeight: 700, 
                              fontSize: 11, 
                              cursor: 'pointer',
                              background: st.isActive ? '#450a0a' : '#065f46',
                              color: st.isActive ? '#f87171' : '#34d399'
                            }}
                          >
                            {st.isActive ? 'Deactivate' : 'Activate Live'}
                          </button>

                          {currentUser.role === 'SHOP_OWNER' && (
                            <button 
                              onClick={() => setShowTransferStylistModal(st.id)}
                              style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', color: '#a78bfa', borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}
                            >
                              Transfer Branch
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 6. BOOKINGS & CHECK-IN TAB                               */}
            {/* ======================================================== */}
            {activeTab === 'bookings' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Bookings & Check-in Workflow</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      {currentUser.type === 'MANAGEMENT' ? 'View status only. Territorial governance and audit mode active.' : 'Accept bookings, verify customer OTP, and start grooming services'}
                    </p>
                  </div>
                </div>

                {/* Scope Notice for Management */}
                {currentUser.type === 'MANAGEMENT' && (
                  <div style={{ background: '#172554', border: '1px solid #1d4ed8', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: 12, color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ShieldAlert size={18} color="#60a5fa" />
                    <span><strong>Territorial Audit Scope:</strong> Super Admin, Regional Admins, and Zonal Managers have view-only access to customer bookings. Only the verified Salon Owner or appointed Stylist can verify check-in OTP and complete services.</span>
                  </div>
                )}

                {/* Filter & Search */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', top: 11, left: 12 }} />
                    <input 
                      type="text" 
                      placeholder="Search booking reference, customer name, service..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    />
                  </div>
                  <select 
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PendingConfirmation">Pending Confirmation</option>
                    <option value="Confirmed">Confirmed (OTP Issued)</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Bookings List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {getVisibleBookings().map(b => (
                    <div key={b.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ background: '#1e293b', color: '#fff', fontWeight: 800, fontSize: 12, padding: '2px 8px', borderRadius: 6 }}>
                            {b.reference}
                          </span>
                          <span style={{ 
                            background: b.status === 'Completed' ? '#065f46' : b.status === 'InProgress' ? '#1e3a8a' : b.status === 'Confirmed' ? '#78350f' : '#831843', 
                            color: b.status === 'Completed' ? '#34d399' : b.status === 'InProgress' ? '#93c5fd' : b.status === 'Confirmed' ? '#fde68a' : '#fbcfe8',
                            fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 
                          }}>
                            ● {b.status}
                          </span>
                          <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700 }}>{b.workType}</span>
                        </div>

                        <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>
                          {b.customerName} ({b.customerPhone}) • {b.serviceName}
                        </h4>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                          Salon: <strong>{b.salonName}</strong> • Stylist: <strong>{b.stylistName}</strong> • Slot: <strong>{b.date} at {b.slot}</strong> • Net: <strong>₹{b.amount}</strong>
                        </p>
                      </div>

                      {/* Operational Actions (Owners / Stylists only) */}
                      {currentUser.type !== 'MANAGEMENT' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {b.status === 'PendingConfirmation' && (
                            <button 
                              onClick={() => handleConfirmBooking(b.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              <Check size={14} /> Accept Booking
                            </button>
                          )}

                          {b.status === 'Confirmed' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <input 
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                id={`otp-input-${b.id}`}
                                style={{ width: 140, padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, textAlign: 'center', letterSpacing: 2 }}
                              />
                              <button 
                                onClick={() => {
                                  const el = document.getElementById(`otp-input-${b.id}`);
                                  if (el) handleVerifyOtpAndStart(b.id, el.value.trim());
                                }}
                                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                              >
                                Verify & Start
                              </button>
                            </div>
                          )}

                          {b.status === 'InProgress' && (
                            <button 
                              onClick={() => handleCompleteService(b.id)}
                              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Complete Service →
                            </button>
                          )}

                          {b.status === 'Completed' && (
                            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>
                              ✓ Settled (₹{b.totalPlatformDeduction} fee)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 12, color: '#94a3b8', display: 'block' }}>Platform Commission: ₹{b.commissionAmount}</span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>Audit Log ID: {b.id}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* ======================================================== */}
            {/* 7. WALLETS & FINANCIALS TAB                             */}
            {/* ======================================================== */}
            {activeTab === 'wallet' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Wallets & Financial Escrow</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Pre-funded wallet balances, commission reconciliations, and platform credit/debit adjustments
                    </p>
                  </div>

                  {(currentUser.role === 'SHOP_OWNER' || currentUser.role === 'INDEPENDENT_OWNER') && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        onClick={() => setShowTopUpWalletModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#10b981', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Plus size={14} /> + Recharge / Add Funds
                      </button>
                      <button 
                        onClick={() => setShowWithdrawWalletModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        - Request Withdrawal
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-Tabs: Wallets vs History */}
                <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #1e293b', marginBottom: 20 }}>
                  <button 
                    onClick={() => setWalletActiveSubTab('wallets')}
                    style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: walletActiveSubTab === 'wallets' ? '2px solid #7c3aed' : '2px solid transparent', color: walletActiveSubTab === 'wallets' ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    {currentUser.type === 'MANAGEMENT' ? 'All Salon Wallets' : 'My Salon Wallet'}
                  </button>
                  <button 
                    onClick={() => setWalletActiveSubTab('history')}
                    style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: walletActiveSubTab === 'history' ? '2px solid #7c3aed' : '2px solid transparent', color: walletActiveSubTab === 'history' ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Transaction History Ledger
                  </button>
                </div>

                {walletActiveSubTab === 'wallets' ? (
                  <div>
                    {/* Management Search & Filter Bar */}
                    {currentUser.type === 'MANAGEMENT' && (
                      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <Search size={16} color="#64748b" style={{ position: 'absolute', top: 11, left: 12 }} />
                          <input 
                            type="text" 
                            placeholder="Search by salon name, owner, or district..."
                            value={walletSearch}
                            onChange={(e) => setWalletSearch(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff', fontSize: 13 }}
                          />
                        </div>
                        <select 
                          value={walletFilter}
                          onChange={(e) => setWalletFilter(e.target.value)}
                          style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                        >
                          <option value="ALL">All Wallets</option>
                          <option value="HEALTHY">Healthy Balance (&gt; ₹1000)</option>
                          <option value="LOW">Low Balance (&lt; ₹1000)</option>
                        </select>
                      </div>
                    )}

                    {/* Wallets Table */}
                    <div className="sb-table-container">
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: '#111827', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 16px' }}>Salon Enterprise</th>
                            <th style={{ padding: '12px 16px' }}>Owner Name</th>
                            <th style={{ padding: '12px 16px' }}>District</th>
                            <th style={{ padding: '12px 16px' }}>Current Balance</th>
                            <th style={{ padding: '12px 16px' }}>Security Deposit</th>
                            <th style={{ padding: '12px 16px' }}>Negative Limit</th>
                            <th style={{ padding: '12px 16px' }}>Status</th>
                            {currentUser.type === 'MANAGEMENT' && <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {wallets
                            .filter(w => currentUser.type === 'MANAGEMENT' ? true : w.salonId === currentUser.salonId)
                            .filter(w => {
                              if (walletFilter === 'HEALTHY' && w.currentBalance < 1000) return false;
                              if (walletFilter === 'LOW' && w.currentBalance >= 1000) return false;
                              if (walletSearch.trim()) {
                                const q = walletSearch.toLowerCase();
                                return w.salonName.toLowerCase().includes(q) || w.ownerName.toLowerCase().includes(q) || w.districtName.toLowerCase().includes(q);
                              }
                              return true;
                            })
                            .map(w => (
                              <tr key={w.salonId} style={{ borderBottom: '1px solid #1e293b' }}>
                                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>{w.salonName}</td>
                                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{w.ownerName}</td>
                                <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{w.districtName}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 800, color: w.currentBalance >= 0 ? '#10b981' : '#f87171' }}>
                                  ₹{w.currentBalance.toLocaleString()}
                                </td>
                                <td style={{ padding: '12px 16px', color: '#38bdf8' }}>₹{w.securityDeposit.toLocaleString()}</td>
                                <td style={{ padding: '12px 16px', color: '#f59e0b' }}>₹{w.negativeLimit.toLocaleString()}</td>
                                <td style={{ padding: '12px 16px' }}>
                                  <span style={{ 
                                    background: w.status === 'Active' ? '#065f46' : '#78350f', 
                                    color: w.status === 'Active' ? '#34d399' : '#fde68a',
                                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 
                                  }}>
                                    {w.status}
                                  </span>
                                </td>
                                {currentUser.type === 'MANAGEMENT' && (
                                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                    <button 
                                      onClick={() => setShowWalletAdjustModal(w)}
                                      style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      +/- Adjust Balance
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* History SubTab Table */}
                    <div className="sb-table-container">
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: '#111827', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 16px' }}>Date & Time</th>
                            <th style={{ padding: '12px 16px' }}>Transaction Type</th>
                            <th style={{ padding: '12px 16px' }}>Description</th>
                            <th style={{ padding: '12px 16px' }}>From / To (Whom)</th>
                            <th style={{ padding: '12px 16px' }}>Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {walletTransactions
                            .filter(tx => currentUser.type === 'MANAGEMENT' ? true : tx.salonId === currentUser.salonId)
                            .map(tx => (
                              <tr key={tx.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{tx.date}</td>
                                <td style={{ padding: '12px 16px' }}>
                                  <span style={{ 
                                    background: tx.amount > 0 ? '#065f46' : '#450a0a', 
                                    color: tx.amount > 0 ? '#34d399' : '#f87171',
                                    fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 8 
                                  }}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 600 }}>{tx.description}</td>
                                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{tx.fromTo}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 800, color: tx.amount > 0 ? '#10b981' : '#f87171' }}>
                                  {tx.amount > 0 ? `+₹${tx.amount.toLocaleString()}` : `-₹${Math.abs(tx.amount).toLocaleString()}`}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* 8. FINANCIAL REPORTS & DOWNLOADS TAB                     */}
            {/* ======================================================== */}
            {activeTab === 'reports' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Financial Reports & Statements</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Generate daily settlement summaries, GST ledgers, and export accounting statements
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  
                  {/* Report 1 */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <FileSpreadsheet size={22} color="#10b981" />
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>Daily Commission Settlement</h4>
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>
                      Aggregated 10% platform take-rate across all completed cash and prepaid bookings.
                    </p>
                    <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, fontSize: 12, color: '#cbd5e1', marginBottom: 16 }}>
                      <span>Today's Platform Yield: <strong style={{ color: '#10b981' }}>₹1,840.00</strong></span><br/>
                      <span>Bookings Settled: <strong style={{ color: '#fff' }}>18 Appointments</strong></span>
                    </div>
                    <button 
                      onClick={() => showToast('Downloading Daily_Commission_Settlement_20261106.csv')}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Download size={15} /> Download CSV Statement
                    </button>
                  </div>

                  {/* Report 2 */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <FileSpreadsheet size={22} color="#38bdf8" />
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>GST 18% Tax Ledger</h4>
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>
                      Audit statement of GST (CGST 9% + SGST 9%) collected on commission for monthly tax filing.
                    </p>
                    <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, fontSize: 12, color: '#cbd5e1', marginBottom: 16 }}>
                      <span>GST Escrow Liability: <strong style={{ color: '#38bdf8' }}>₹331.20</strong></span><br/>
                      <span>State Code: <strong style={{ color: '#fff' }}>33 (Tamil Nadu)</strong></span>
                    </div>
                    <button 
                      onClick={() => showToast('Downloading GST_Tax_Ledger_Nov2026.csv')}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Download size={15} /> Download GST Ledger
                    </button>
                  </div>

                  {/* Report 3 */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <FileSpreadsheet size={22} color="#f59e0b" />
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>Salon Escrow & Liabilities</h4>
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>
                      Pre-funded float balances, negative limit exposures, and security deposits held in escrow.
                    </p>
                    <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, fontSize: 12, color: '#cbd5e1', marginBottom: 16 }}>
                      <span>Total Floating Balance: <strong style={{ color: '#f59e0b' }}>₹6,350.00</strong></span><br/>
                      <span>Negative Credit Exposed: <strong style={{ color: '#f87171' }}>₹0.00</strong></span>
                    </div>
                    <button 
                      onClick={() => showToast('Downloading Salon_Escrow_Statement.csv')}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#d97706', color: '#fff', border: 'none', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Download size={15} /> Download Escrow Summary
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 9. GOVERNANCE & COMPLIANCE NOTICES TAB                   */}
            {/* ======================================================== */}
            {activeTab === 'governance' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Governance, Compliance & Targeted Notices</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      {currentUser.type === 'MANAGEMENT' ? 'Issue operational citations, sanitation directives, or financial notices' : 'Review compliance notices issued to your salon'}
                    </p>
                  </div>

                  {currentUser.type === 'MANAGEMENT' && (
                    <button 
                      onClick={() => setShowIssueNoticeModal(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Plus size={16} /> + Issue New Targeted Notice
                    </button>
                  )}
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', top: 11, left: 12 }} />
                    <input 
                      type="text" 
                      placeholder="Search notices by target, title, or category..."
                      value={noticeSearch}
                      onChange={(e) => setNoticeSearch(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    />
                  </div>
                  <select 
                    value={noticeFilter}
                    onChange={(e) => setNoticeFilter(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="ALL">All Severities</option>
                    <option value="WARNING">Warnings</option>
                    <option value="ADVISORY">Advisories</option>
                    <option value="PENALTY">Penalties</option>
                  </select>
                </div>

                {/* Notices List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {notices
                    .filter(n => {
                      if (noticeFilter !== 'ALL' && n.severity !== noticeFilter) return false;
                      if (noticeSearch.trim()) {
                        const q = noticeSearch.toLowerCase();
                        return n.title.toLowerCase().includes(q) || n.targetName.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map(n => (
                      <div key={n.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ 
                              background: n.severity === 'WARNING' ? '#78350f' : n.severity === 'PENALTY' ? '#450a0a' : '#1e3a8a', 
                              color: n.severity === 'WARNING' ? '#fde68a' : n.severity === 'PENALTY' ? '#f87171' : '#bfdbfe',
                              fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 
                            }}>
                              {n.severity}
                            </span>
                            <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700 }}>Target: {n.targetType} — {n.targetName}</span>
                          </div>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>Issued on {n.dateIssued}</span>
                        </div>

                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>{n.title}</h4>
                        <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 10px 0' }}>{n.details}</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #1e293b' }}>
                          <span style={{ fontSize: 11, color: '#64748b' }}>Issued by: <strong>{n.issuedBy}</strong> • Deadline: <strong>{n.deadline}</strong></span>
                          
                          {currentUser.type !== 'MANAGEMENT' && n.status === 'Active' && (
                            <button 
                              onClick={() => {
                                setNotices(prev => prev.map(not => not.id === n.id ? { ...not, status: 'Acknowledged' } : not));
                                showToast('Notice Acknowledged & Marked Compliant.');
                              }}
                              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              ✓ Acknowledge & Mark Compliant
                            </button>
                          )}
                          <span style={{ fontSize: 11, color: n.status === 'Acknowledged' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                            Status: {n.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 10. MASTER GEOGRAPHIES CRUD TAB (SUPER ADMIN & ADMIN)    */}
            {/* ======================================================== */}
            {activeTab === 'masters' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Country, State & District Masters</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Add, edit, and maintain geographic territorial divisions across the platform
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    {geoSubTab === 'countries' && (
                      <button 
                        onClick={() => setShowAddCountryModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Plus size={14} /> + Add Country
                      </button>
                    )}
                    {geoSubTab === 'states' && (
                      <button 
                        onClick={() => setShowAddStateModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Plus size={14} /> + Add State
                      </button>
                    )}
                    {geoSubTab === 'districts' && (
                      <button 
                        onClick={() => setShowAddDistrictModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Plus size={14} /> + Add District
                      </button>
                    )}
                  </div>
                </div>

                {/* SubTab Switcher */}
                <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #1e293b', marginBottom: 20 }}>
                  <button 
                    onClick={() => setGeoSubTab('countries')}
                    style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: geoSubTab === 'countries' ? '2px solid #7c3aed' : '2px solid transparent', color: geoSubTab === 'countries' ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Countries ({countries.length})
                  </button>
                  <button 
                    onClick={() => setGeoSubTab('states')}
                    style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: geoSubTab === 'states' ? '2px solid #7c3aed' : '2px solid transparent', color: geoSubTab === 'states' ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    States / Provinces ({states.length})
                  </button>
                  <button 
                    onClick={() => setGeoSubTab('districts')}
                    style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: geoSubTab === 'districts' ? '2px solid #7c3aed' : '2px solid transparent', color: geoSubTab === 'districts' ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Districts / Zones ({districts.length})
                  </button>
                </div>

                {/* Tables */}
                <div className="sb-table-container">
                  {geoSubTab === 'countries' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#111827', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                          <th style={{ padding: '12px 16px' }}>Country Name</th>
                          <th style={{ padding: '12px 16px' }}>ISO Code</th>
                          <th style={{ padding: '12px 16px' }}>Phone Code</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countries.map(c => (
                          <tr key={c.id} style={{ borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>{c.name}</td>
                            <td style={{ padding: '12px 16px', color: '#a78bfa', fontWeight: 600 }}>{c.iso}</td>
                            <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{c.phoneCode}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: c.isActive ? '#065f46' : '#334155', color: c.isActive ? '#34d399' : '#94a3b8', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>
                                {c.isActive ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button 
                                onClick={() => {
                                  setCountries(prev => prev.map(item => item.id === c.id ? { ...item, isActive: !item.isActive } : item));
                                  showToast(`Country ${c.name} status updated`);
                                }}
                                style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                              >
                                Toggle Active
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {geoSubTab === 'states' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#111827', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                          <th style={{ padding: '12px 16px' }}>State Name</th>
                          <th style={{ padding: '12px 16px' }}>State Code</th>
                          <th style={{ padding: '12px 16px' }}>Parent Country</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {states.map(s => (
                          <tr key={s.id} style={{ borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>{s.name}</td>
                            <td style={{ padding: '12px 16px', color: '#38bdf8', fontWeight: 600 }}>{s.code}</td>
                            <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{s.countryName}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: s.isActive ? '#065f46' : '#334155', color: s.isActive ? '#34d399' : '#94a3b8', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>
                                {s.isActive ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button 
                                onClick={() => {
                                  setStates(prev => prev.map(item => item.id === s.id ? { ...item, isActive: !item.isActive } : item));
                                  showToast(`State ${s.name} status updated`);
                                }}
                                style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                              >
                                Toggle Active
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {geoSubTab === 'districts' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#111827', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                          <th style={{ padding: '12px 16px' }}>District / Town</th>
                          <th style={{ padding: '12px 16px' }}>Zone Allocation</th>
                          <th style={{ padding: '12px 16px' }}>Parent State</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {districts.map(d => (
                          <tr key={d.id} style={{ borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>{d.name}</td>
                            <td style={{ padding: '12px 16px', color: '#f59e0b', fontWeight: 600 }}>{d.zoneName}</td>
                            <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{d.stateName}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: d.isActive ? '#065f46' : '#334155', color: d.isActive ? '#34d399' : '#94a3b8', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>
                                {d.isActive ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button 
                                onClick={() => {
                                  setDistricts(prev => prev.map(item => item.id === d.id ? { ...item, isActive: !item.isActive } : item));
                                  showToast(`District ${d.name} status updated`);
                                }}
                                style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                              >
                                Toggle Active
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 11. ROLES & SCOPES ARCHITECTURE TAB                      */}
            {/* ======================================================== */}
            {activeTab === 'roles' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Role Governance & Permission Architecture</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Multi-tier hierarchical access rules, territorial boundaries, and scope allocation matrix
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  
                  {/* Super Admin */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>TIER 1 • GLOBAL</span>
                      <ShieldCheck size={18} color="#a78bfa" />
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>Super Admin</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 10px 0' }}>Full global platform authority across all countries, master data CRUD, role definitions, and wallet audits.</p>
                    <span style={{ fontSize: 11, color: '#38bdf8' }}>Allocated Scope: Global (All Countries)</span>
                  </div>

                  {/* Admin */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>TIER 2 • REGIONAL</span>
                      <Building size={18} color="#60a5fa" />
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>Regional Admin</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 10px 0' }}>State-wide oversight: approvals, branch live status, manager creation, and regional compliance.</p>
                    <span style={{ fontSize: 11, color: '#38bdf8' }}>Allocated Scope: Country & State</span>
                  </div>

                  {/* Manager */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ background: '#0891b2', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>TIER 3 • ZONAL</span>
                      <MapPin size={18} color="#22d3ee" />
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>Zonal Manager</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 10px 0' }}>Zonal field audit: branch inspections, stylist shifts, customer dispute mediation, and territorial approvals.</p>
                    <span style={{ fontSize: 11, color: '#38bdf8' }}>Allocated Scope: State, District & Zone</span>
                  </div>

                  {/* Finance */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ background: '#059669', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>TIER 3 • ESCROW</span>
                      <Wallet size={18} color="#34d399" />
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>Finance Officer</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 10px 0' }}>Wallet reconciliation, manual credits/debits, GST ledger reports, and platform take-rate settlements.</p>
                    <span style={{ fontSize: 11, color: '#38bdf8' }}>Allocated Scope: State & Region</span>
                  </div>

                  {/* Shop Owner */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ background: '#d97706', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>TIER 4 • PARTNER</span>
                      <Store size={18} color="#fbbf24" />
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>Shop Owner</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 10px 0' }}>Created by Super Admin/Admin with Proof of Trust. Creates branches, stylists, sets pricing, accepts bookings.</p>
                    <span style={{ fontSize: 11, color: '#38bdf8' }}>Allocated Scope: Salon Enterprise</span>
                  </div>

                  {/* Stylist */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ background: '#db2777', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>TIER 5 • SERVICE</span>
                      <Scissors size={18} color="#f472b6" />
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>Stylist</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 10px 0' }}>Created by Salon Owner. Receives slot assignments, verifies customer 6-digit OTP, completes service.</p>
                    <span style={{ fontSize: 11, color: '#38bdf8' }}>Allocated Scope: Assigned Branch</span>
                  </div>

                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 12. USER MANAGEMENT MENU TAB (SUPER ADMIN & ADMIN)       */}
            {/* ======================================================== */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>User Directory & Creation Menu</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Create and manage Management, Owner, and Customer user accounts with scope allocation
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowCreateUserModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <Plus size={16} /> + Create New User
                  </button>
                </div>

                {/* Search & Filter */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', top: 11, left: 12 }} />
                    <input 
                      type="text" 
                      placeholder="Search user by username, full name, phone, email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    />
                  </div>
                  <select 
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Regional Admin</option>
                    <option value="ZONAL_MANAGER">Zonal Manager</option>
                    <option value="FINANCE">Finance</option>
                    <option value="SHOP_OWNER">Shop Owner</option>
                    <option value="INDEPENDENT_OWNER">Independent Owner</option>
                    <option value="STYLIST">Stylist</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                </div>

                {/* Users Table */}
                <div className="sb-table-container">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#111827', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>User Details</th>
                        <th style={{ padding: '12px 16px' }}>Role / Type</th>
                        <th style={{ padding: '12px 16px' }}>Allocated Scope / Jurisdiction</th>
                        <th style={{ padding: '12px 16px' }}>Contact</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList
                        .filter(u => currentUser.role === 'SUPER_ADMIN' ? true : u.role !== 'SUPER_ADMIN' && u.role !== 'ADMIN')
                        .filter(u => {
                          if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
                          if (userSearch.trim()) {
                            const q = userSearch.toLowerCase();
                            return u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q);
                          }
                          return true;
                        })
                        .map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <strong style={{ color: '#fff', display: 'block' }}>{u.fullName}</strong>
                              <span style={{ fontSize: 11, color: '#a78bfa' }}>@{u.username}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: '#1e293b', color: '#cbd5e1', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12 }}>
                              {u.allocation || 'All Allocations'}
                            </td>
                            <td style={{ padding: '12px 16px', color: '#cbd5e1', fontSize: 12 }}>
                              {u.phone}<br/>
                              <span style={{ color: '#64748b', fontSize: 11 }}>{u.email}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: u.status === 'Active' ? '#065f46' : '#334155', color: u.status === 'Active' ? '#34d399' : '#94a3b8', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>
                                {u.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              {u.role !== 'SUPER_ADMIN' && (
                                <button 
                                  onClick={() => {
                                    setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: usr.status === 'Active' ? 'Disabled' : 'Active' } : usr));
                                    showToast(`User @${u.username} status updated`);
                                  }}
                                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                                >
                                  Toggle Active
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 13. HELPDESK & POCS TAB (HIDDEN FOR SUPER ADMIN!)         */}
            {/* ======================================================== */}
            {activeTab === 'helpdesk' && currentUser.role !== 'SUPER_ADMIN' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>HelpDesk & Escalation Directory</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Direct escalation contacts for compliance, disputes, and operational support
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  
                  {/* Admin POV: Super Admin Contact */}
                  {currentUser.role === 'ADMIN' && (
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 22 }}>
                      <span style={{ background: '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 10 }}>SUPER ADMIN ESCALATION</span>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>Global Operations Head</h4>
                      <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 12px 0' }}>Contact for state boundary updates, system configuration, or critical policy escalation.</p>
                      <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span>📞 Phone: <strong style={{ color: '#fff' }}>+91 99000 00001</strong></span>
                        <span>✉️ Email: <strong style={{ color: '#fff' }}>master@stylebook.in</strong></span>
                        <span>🏢 Office: Global Headquarters, Tech Park, India</span>
                      </div>
                    </div>
                  )}

                  {/* Manager / Finance POV: Regional Admin Contact */}
                  {(currentUser.role === 'ZONAL_MANAGER' || currentUser.role === 'FINANCE') && (
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 22 }}>
                      <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 10 }}>REGIONAL STATE ADMIN</span>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>Selvakumar (State Admin)</h4>
                      <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 12px 0' }}>Contact for zonal budget allocations, district approvals, and state tax filings.</p>
                      <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span>📞 Phone: <strong style={{ color: '#fff' }}>+91 98400 11111</strong></span>
                        <span>✉️ Email: <strong style={{ color: '#fff' }}>selvakumar.tn@stylebook.in</strong></span>
                        <span>📍 State: Tamil Nadu</span>
                      </div>
                    </div>
                  )}

                  {/* Owner / Stylist POV: Zonal Manager & Admin Contacts */}
                  {(currentUser.type === 'OWNER' || currentUser.type === 'STYLIST') && (
                    <>
                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 22 }}>
                        <span style={{ background: '#0891b2', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 10 }}>ZONAL FIELD OFFICER</span>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>Murugan (Zonal Officer)</h4>
                        <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 12px 0' }}>Dedicated officer for Ramanathapuram Zone (Ramnad Town, Puduvalasai, Panaikulam, Sakkarakottai).</p>
                        <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span>📞 Phone: <strong style={{ color: '#fff' }}>+91 98400 22222</strong></span>
                          <span>✉️ Email: <strong style={{ color: '#fff' }}>murugan.ramnad@stylebook.in</strong></span>
                          <span>💬 WhatsApp Support: Available 9 AM - 8 PM</span>
                        </div>
                      </div>

                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 22 }}>
                        <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 10 }}>REGIONAL STATE ESCALATION</span>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>Selvakumar (State Admin)</h4>
                        <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 12px 0' }}>State-level escalation for commission disputes, banking floats, and compliance certificates.</p>
                        <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span>📞 Phone: <strong style={{ color: '#fff' }}>+91 98400 11111</strong></span>
                          <span>✉️ Email: <strong style={{ color: '#fff' }}>selvakumar.tn@stylebook.in</strong></span>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            )}


          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CONFIRM APPROVAL / REJECTION MODAL              */}
      {/* ======================================================== */}
      {confirmApprovalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 460, padding: 28, boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: confirmApprovalModal.action === 'APPROVE' ? '#065f46' : '#450a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {confirmApprovalModal.action === 'APPROVE' ? <CheckCircle2 size={24} color="#34d399" /> : <XCircle size={24} color="#f87171" />}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>
                  {confirmApprovalModal.action === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Reviewer: {currentUser.name} ({currentUser.role})</p>
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 18, fontSize: 13, color: '#cbd5e1' }}>
              <p style={{ margin: '0 0 6px 0' }}>Are you sure you want to {confirmApprovalModal.action === 'APPROVE' ? 'APPROVE and activate Live' : 'REJECT'} the following {confirmApprovalModal.item.type.toLowerCase()}?</p>
              <p style={{ margin: 0, fontWeight: 800, color: '#fff', fontSize: 15 }}>{confirmApprovalModal.item.name}</p>
            </div>

            {confirmApprovalModal.action === 'REJECT' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Reason for Rejection (Visible to Owner)</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Incomplete trade license proof or location outside zone..."
                  value={confirmApprovalModal.reason}
                  onChange={(e) => setConfirmApprovalModal({ ...confirmApprovalModal, reason: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => setConfirmApprovalModal(null)}
                style={{ flex: 1, padding: '11px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={executeApprovalAction}
                style={{ 
                  flex: 1, 
                  padding: '11px', 
                  background: confirmApprovalModal.action === 'APPROVE' ? '#16a34a' : '#dc2626', 
                  border: 'none', 
                  borderRadius: 8, 
                  color: '#fff', 
                  fontWeight: 800, 
                  cursor: 'pointer' 
                }}
              >
                {confirmApprovalModal.action === 'APPROVE' ? 'Yes, Confirm Approval' : 'Yes, Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD BRANCH MODAL (SHOP OWNER)                   */}
      {/* ======================================================== */}
      {showAddBranchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>+ Create New Branch</h3>
              <button onClick={() => setShowAddBranchModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={20} /></button>
            </div>

            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 18 }}>
              Once created, the branch will be marked <strong>"Waiting for Approval"</strong>. Once approved by Regional/Zonal management, it goes Live on the Customer app.
            </p>

            <form onSubmit={handleCreateBranch}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Branch Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Classic - Puduvalasai Highway Branch"
                  value={newBranchForm.name}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Country *</label>
                  <select 
                    value={newBranchForm.country}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, country: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  >
                    <option value="India">India</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>State *</label>
                  <select 
                    value={newBranchForm.state}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, state: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>District / Town *</label>
                  <select 
                    value={newBranchForm.district}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, district: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  >
                    <option value="Ramnad Town">Ramnad Town</option>
                    <option value="Puduvalasai">Puduvalasai</option>
                    <option value="Panaikulam">Panaikulam</option>
                    <option value="Sakkarakottai">Sakkarakottai</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Total Chairs Available *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newBranchForm.chairs}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, chairs: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Full Address / Location *</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. No. 45, East Coast Main Road, Puduvalasai"
                  value={newBranchForm.address}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Contact Phone *</label>
                  <input 
                    type="text" 
                    placeholder="+91 98401 22222"
                    value={newBranchForm.contactNo}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, contactNo: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Operating Hours</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input 
                      type="text" 
                      placeholder="09:00 AM"
                      value={newBranchForm.openTime}
                      onChange={(e) => setNewBranchForm({ ...newBranchForm, openTime: e.target.value })}
                      style={{ width: '50%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    />
                    <input 
                      type="text" 
                      placeholder="09:00 PM"
                      value={newBranchForm.closeTime}
                      onChange={(e) => setNewBranchForm({ ...newBranchForm, closeTime: e.target.value })}
                      style={{ width: '50%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
              >
                Submit Branch for Approval →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD STYLIST MODAL (SHOP OWNER)                  */}
      {/* ======================================================== */}
      {showAddStylistModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>+ Add New Stylist</h3>
              <button onClick={() => setShowAddStylistModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleCreateStylist}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Kannan"
                  value={newStylistForm.name}
                  onChange={(e) => setNewStylistForm({ ...newStylistForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Contact Phone *</label>
                  <input 
                    type="text" 
                    placeholder="+91 98401 33333"
                    value={newStylistForm.phone}
                    onChange={(e) => setNewStylistForm({ ...newStylistForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Proof of Trust (Aadhaar / ID) *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aadhaar: XXXX-XXXX-5920"
                    value={newStylistForm.proofOfTrust}
                    onChange={(e) => setNewStylistForm({ ...newStylistForm, proofOfTrust: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Assigned Branch *</label>
                <select 
                  value={newStylistForm.branchId}
                  onChange={(e) => setNewStylistForm({ ...newStylistForm, branchId: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                >
                  {salons.find(s => s.id === currentUser.salonId)?.branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.districtName})</option>
                  ))}
                </select>
              </div>

              {/* Working Hours & Shifts */}
              <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#a78bfa', marginBottom: 8 }}>SHIFT & TIMING SCHEDULES</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#cbd5e1' }}>Work Shift Start</span>
                    <input 
                      type="text" 
                      value={newStylistForm.workStart}
                      onChange={(e) => setNewStylistForm({ ...newStylistForm, workStart: e.target.value })}
                      style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#cbd5e1' }}>Work Shift End</span>
                    <input 
                      type="text" 
                      value={newStylistForm.workEnd}
                      onChange={(e) => setNewStylistForm({ ...newStylistForm, workEnd: e.target.value })}
                      style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#cbd5e1' }}>Break Start</span>
                    <input 
                      type="text" 
                      value={newStylistForm.breakStart}
                      onChange={(e) => setNewStylistForm({ ...newStylistForm, breakStart: e.target.value })}
                      style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#cbd5e1' }}>Break End</span>
                    <input 
                      type="text" 
                      value={newStylistForm.breakEnd}
                      onChange={(e) => setNewStylistForm({ ...newStylistForm, breakEnd: e.target.value })}
                      style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>

              {/* Doorstep Toggle */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#fff', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={newStylistForm.doorstepSupport}
                    onChange={(e) => setNewStylistForm({ ...newStylistForm, doorstepSupport: e.target.checked })}
                  />
                  <span>Enable Doorstep Grooming Service</span>
                </label>

                {newStylistForm.doorstepSupport && (
                  <div style={{ marginTop: 8, padding: 10, background: '#1e293b', borderRadius: 8 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#cbd5e1', marginBottom: 4 }}>Service Radius from Branch (km)</label>
                    <input 
                      type="number"
                      value={newStylistForm.doorstepRadiusKm}
                      onChange={(e) => setNewStylistForm({ ...newStylistForm, doorstepRadiusKm: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                    />
                  </div>
                )}
              </div>

              <button 
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
              >
                Create Stylist Roster Entry →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: TRANSFER STYLIST MODAL (SHOP OWNER)             */}
      {/* ======================================================== */}
      {showTransferStylistModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 440, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 10px 0', color: '#fff' }}>Transfer Stylist to Branch</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>Select which branch to reassign this stylist to:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {salons.find(s => s.id === currentUser.salonId)?.branches.map(b => (
                <button 
                  key={b.id}
                  onClick={() => handleTransferStylist(showTransferStylistModal, b.id)}
                  style={{ padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'left', cursor: 'pointer' }}
                >
                  📍 {b.name} ({b.districtName})
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowTransferStylistModal(null)}
              style={{ width: '100%', padding: '10px', background: '#334155', border: 'none', borderRadius: 8, color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: SERVICE & PRICING MODAL (WITH PROVENANCE & LABELS) */}
      {/* ======================================================== */}
      {showAddServiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 500, padding: 28 }}>
            
            {/* Provenance Banner */}
            <div style={{ background: pricingModalForm.isCustomService ? '#3b0764' : '#1e1b4b', border: '1px solid #7c3aed', padding: '10px 14px', borderRadius: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                {pricingModalForm.isCustomService ? 'PROVENANCE: CREATE NEW CUSTOM SERVICE' : 'PROVENANCE: EDIT BRANCH PRICING'}
              </span>
              <p style={{ fontSize: 11, color: '#cbd5e1', margin: '4px 0 0 0' }}>
                {pricingModalForm.isCustomService 
                  ? 'Custom service will be submitted to Zonal Manager for compliance verification.'
                  : 'Updating existing pricing for your branch catalog.'}
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (pricingModalForm.isCustomService) {
                const newSvc = {
                  id: Date.now(),
                  name: pricingModalForm.name,
                  category: pricingModalForm.category,
                  duration: Number(pricingModalForm.duration) || 30,
                  basePrice: Number(pricingModalForm.price),
                  customPrice: Number(pricingModalForm.price),
                  minFloorPrice: Number(pricingModalForm.minPrice),
                  salonId: currentUser.salonId,
                  submittedBy: currentUser.name,
                  approvalStatus: 'Pending_Approval',
                  isActive: true
                };
                setMasterServices(prev => [...prev, newSvc]);
                showToast('Custom Service requested! Waiting for Zonal Manager review.');
              } else {
                setMasterServices(prev => prev.map(s => {
                  if (s.id === pricingModalForm.serviceId) {
                    return {
                      ...s,
                      duration: Number(pricingModalForm.duration),
                      customPrice: Number(pricingModalForm.price),
                      basePrice: Number(pricingModalForm.price),
                      minFloorPrice: Number(pricingModalForm.minPrice)
                    };
                  }
                  return s;
                }));
                showToast('Pricing updated successfully!');
              }
              setShowAddServiceModal(false);
            }}>
              
              {pricingModalForm.isCustomService && (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                      Service Title / Name *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Moroccan Keratin Therapy"
                      value={pricingModalForm.name}
                      onChange={(e) => setPricingModalForm({ ...pricingModalForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                      Service Category *
                    </label>
                    <select 
                      value={pricingModalForm.category}
                      onChange={(e) => setPricingModalForm({ ...pricingModalForm, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    >
                      <option value="Hair Care">Hair Care</option>
                      <option value="Shave & Beard">Shave & Beard</option>
                      <option value="Facial & Glow">Facial & Glow</option>
                      <option value="Bridal">Bridal</option>
                      <option value="Head Massage">Head Massage</option>
                    </select>
                  </div>
                </>
              )}

              {/* Explicit Labels on the 3 Numeric Inputs */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  1. Service Duration (Minutes) *
                </label>
                <input 
                  type="number" 
                  min="5"
                  step="5"
                  value={pricingModalForm.duration}
                  onChange={(e) => setPricingModalForm({ ...pricingModalForm, duration: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
                <small style={{ color: '#94a3b8', fontSize: 11 }}>Default system benchmark: 30 minutes. Enter estimated service completion time.</small>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  2. Standard Selling Price (₹) *
                </label>
                <input 
                  type="number" 
                  min="50"
                  value={pricingModalForm.price}
                  onChange={(e) => setPricingModalForm({ ...pricingModalForm, price: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
                <small style={{ color: '#94a3b8', fontSize: 11 }}>Standard public booking price displayed on customer marketplace.</small>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  3. Minimum Negotiable Floor Price (₹) *
                </label>
                <input 
                  type="number" 
                  min="30"
                  value={pricingModalForm.minPrice}
                  onChange={(e) => setPricingModalForm({ ...pricingModalForm, minPrice: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
                <small style={{ color: '#94a3b8', fontSize: 11 }}>Customer bargaining will automatically reject any offer below this floor.</small>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddServiceModal(false)}
                  style={{ flex: 1, padding: '11px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '11px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}
                >
                  Save & Apply Pricing →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: WALLET ADJUSTMENT MODAL (MANAGEMENT & FINANCE)  */}
      {/* ======================================================== */}
      {showWalletAdjustModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 460, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px 0', color: '#fff' }}>Adjust Wallet Balance</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>Salon: <strong style={{ color: '#fff' }}>{showWalletAdjustModal.salonName}</strong> • Current: <strong style={{ color: '#10b981' }}>₹{showWalletAdjustModal.currentBalance}</strong></p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Action *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button"
                  onClick={() => setWalletAdjustForm({ ...walletAdjustForm, action: 'ADD' })}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', background: walletAdjustForm.action === 'ADD' ? '#16a34a' : '#1e293b', color: walletAdjustForm.action === 'ADD' ? '#fff' : '#cbd5e1' }}
                >
                  + Add Balance (Credit)
                </button>
                <button 
                  type="button"
                  onClick={() => setWalletAdjustForm({ ...walletAdjustForm, action: 'SUBTRACT' })}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', background: walletAdjustForm.action === 'SUBTRACT' ? '#dc2626' : '#1e293b', color: walletAdjustForm.action === 'SUBTRACT' ? '#fff' : '#cbd5e1' }}
                >
                  - Subtract Balance (Debit)
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Adjustment Amount (₹) *</label>
              <input 
                type="number"
                min="1"
                value={walletAdjustForm.amount}
                onChange={(e) => setWalletAdjustForm({ ...walletAdjustForm, amount: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700 }}
                required
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Reason / Audit Description *</label>
              <input 
                type="text" 
                placeholder="e.g. Bank Deposit float reconciliation / Penalty citation #001"
                value={walletAdjustForm.reason}
                onChange={(e) => setWalletAdjustForm({ ...walletAdjustForm, reason: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => setShowWalletAdjustModal(null)}
                style={{ flex: 1, padding: '11px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleExecuteWalletAdjustment}
                style={{ flex: 1, padding: '11px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}
              >
                Execute Adjustment →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: ISSUE TARGETED NOTICE MODAL                     */}
      {/* ======================================================== */}
      {showIssueNoticeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 520, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px 0', color: '#fff' }}>+ Issue Targeted Notice / Citation</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>Issue a targeted directive against a Branch, Salon Owner, or Customer</p>

            <form onSubmit={handleIssueNotice}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Target Type *</label>
                  <select 
                    value={newNoticeForm.targetType}
                    onChange={(e) => {
                      const t = e.target.value;
                      setNewNoticeForm({
                        ...newNoticeForm,
                        targetType: t,
                        targetName: t === 'Branch' ? 'Royal Classic - Ramnad Town Branch' : t === 'Owner' ? 'Anwar Hussain' : 'Mohamed Irfan'
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  >
                    <option value="Branch">Branch</option>
                    <option value="Owner">Salon Owner</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Target Entity Name *</label>
                  <input 
                    type="text" 
                    value={newNoticeForm.targetName}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, targetName: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Severity Level *</label>
                  <select 
                    value={newNoticeForm.severity}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, severity: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  >
                    <option value="ADVISORY">Advisory (Low)</option>
                    <option value="WARNING">Warning (Compliance Notice)</option>
                    <option value="PENALTY">Penalty (Financial Citation)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Notice Category *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sterilization / Pricing Policy"
                    value={newNoticeForm.category}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Notice Title / Header *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Immediate Autoclave Inspection Mandate"
                  value={newNoticeForm.title}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Directive Details / Instructions *</label>
                <textarea 
                  rows={3}
                  placeholder="Provide explicit instructions, evidence requirements, or penalty terms..."
                  value={newNoticeForm.details}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, details: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button"
                  onClick={() => setShowIssueNoticeModal(false)}
                  style={{ flex: 1, padding: '11px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '11px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}
                >
                  Broadcast Notice →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: USER CREATION MODAL (SUPER ADMIN & ADMIN)       */}
      {/* ======================================================== */}
      {showCreateUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px 0', color: '#fff' }}>+ Create New System User</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>Assign role, territorial boundaries, and proof of trust credentials</p>

            <form onSubmit={handleCreateUser}>
              
              {/* Category Selection */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>User Category *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['MANAGEMENT', 'OWNER', 'CUSTOMER'].map(cat => (
                    <button 
                      key={cat}
                      type="button"
                      onClick={() => setNewUserForm({ 
                        ...newUserForm, 
                        userCategory: cat, 
                        role: cat === 'MANAGEMENT' ? 'ZONAL_MANAGER' : cat === 'OWNER' ? 'SHOP_OWNER' : 'CUSTOMER' 
                      })}
                      style={{ 
                        flex: 1, 
                        padding: '9px', 
                        borderRadius: 8, 
                        border: 'none', 
                        fontWeight: 700, 
                        fontSize: 12, 
                        cursor: 'pointer',
                        background: newUserForm.userCategory === cat ? '#7c3aed' : '#1e293b',
                        color: newUserForm.userCategory === cat ? '#fff' : '#cbd5e1'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Username *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. manager_madurai"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Suresh Kumar"
                    value={newUserForm.fullName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Contact Phone *</label>
                  <input 
                    type="text" 
                    placeholder="+91 98400 99999"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="user@stylebook.in"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Dynamic Inputs: MANAGEMENT ROLE ALLOCATIONS */}
              {newUserForm.userCategory === 'MANAGEMENT' && (
                <div style={{ background: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#a78bfa', marginBottom: 10 }}>
                    MANAGEMENT TERRITORY ALLOCATIONS
                  </label>
                  
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Management Role:</span>
                    <select 
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                    >
                      {currentUser.role === 'SUPER_ADMIN' && <option value="ADMIN">Regional Admin (State)</option>}
                      <option value="ZONAL_MANAGER">Zonal Manager</option>
                      <option value="FINANCE">Finance Officer</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Allocated Country:</span>
                      <select 
                        value={newUserForm.country}
                        onChange={(e) => setNewUserForm({ ...newUserForm, country: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                      >
                        <option value="All">All Countries</option>
                        <option value="India">India</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Allocated State:</span>
                      <select 
                        value={newUserForm.state}
                        onChange={(e) => setNewUserForm({ ...newUserForm, state: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                      >
                        <option value="All">All States</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Allocated District:</span>
                      <input 
                        type="text"
                        placeholder="All or specific e.g. Ramnad Town"
                        value={newUserForm.district}
                        onChange={(e) => setNewUserForm({ ...newUserForm, district: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Allocated Brand:</span>
                      <input 
                        type="text"
                        placeholder="All or specific Brand"
                        value={newUserForm.brand}
                        onChange={(e) => setNewUserForm({ ...newUserForm, brand: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Inputs: OWNER DETAILS & PROOF OF TRUST */}
              {newUserForm.userCategory === 'OWNER' && (
                <div style={{ background: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#f59e0b', marginBottom: 10 }}>
                    OWNER ENTERPRISE & PROOF OF TRUST
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Business Type:</span>
                      <select 
                        value={newUserForm.businessType}
                        onChange={(e) => setNewUserForm({ ...newUserForm, businessType: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                      >
                        <option value="SALON">Physical Salon (Multi/Single Branch)</option>
                        <option value="INDEPENDENT">Independent Doorstep / Home Salon</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Salon / Brand Name:</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Star Unisex Salon"
                        value={newUserForm.salonName}
                        onChange={(e) => setNewUserForm({ ...newUserForm, salonName: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Proof of Trust Type:</span>
                      <select 
                        value={newUserForm.idProofType}
                        onChange={(e) => setNewUserForm({ ...newUserForm, idProofType: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="GSTIN Number">GSTIN Certificate</option>
                        <option value="Trade License">Municipal Trade License</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Document / ID Number:</span>
                      <input 
                        type="text" 
                        placeholder="e.g. 33AAAAA0000A1Z5 / XXXX-5921"
                        value={newUserForm.idProofNumber}
                        onChange={(e) => setNewUserForm({ ...newUserForm, idProofNumber: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Official Registered Address:</span>
                    <input 
                      type="text" 
                      placeholder="Street, Town, District, State"
                      value={newUserForm.address}
                      onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })}
                      style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Inputs: CUSTOMER DETAILS */}
              {newUserForm.userCategory === 'CUSTOMER' && (
                <div style={{ background: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#38bdf8', marginBottom: 8 }}>
                    CUSTOMER LOCATION
                  </label>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Customer Locality:</span>
                  <select 
                    value={newUserForm.locality}
                    onChange={(e) => setNewUserForm({ ...newUserForm, locality: e.target.value })}
                    style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12, marginTop: 4 }}
                  >
                    <option value="Ramnad Town">Ramnad Town</option>
                    <option value="Puduvalasai">Puduvalasai</option>
                    <option value="Panaikulam">Panaikulam</option>
                    <option value="Sakkarakottai">Sakkarakottai</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  style={{ flex: 1, padding: '11px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '11px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}
                >
                  Create User & Grant Access →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 9: MASTER CRUD (COUNTRY, STATE, DISTRICT)          */}
      {/* ======================================================== */}
      {showAddCountryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 420, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 14px 0', color: '#fff' }}>+ Add New Country</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Country Name</label>
              <input 
                type="text" 
                placeholder="e.g. Singapore"
                value={newCountryForm.name}
                onChange={(e) => setNewCountryForm({ ...newCountryForm, name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>ISO Code</label>
                <input 
                  type="text" 
                  placeholder="SGP"
                  value={newCountryForm.iso}
                  onChange={(e) => setNewCountryForm({ ...newCountryForm, iso: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Phone Code</label>
                <input 
                  type="text" 
                  placeholder="+65"
                  value={newCountryForm.phoneCode}
                  onChange={(e) => setNewCountryForm({ ...newCountryForm, phoneCode: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAddCountryModal(false)} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={() => {
                  if (!newCountryForm.name.trim()) return;
                  setCountries(prev => [...prev, { id: Date.now(), ...newCountryForm, isActive: true }]);
                  setShowAddCountryModal(false);
                  showToast(`Country ${newCountryForm.name} created successfully`);
                }}
                style={{ flex: 1, padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Add Country
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddStateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 420, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 14px 0', color: '#fff' }}>+ Add New State</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Parent Country</label>
              <select 
                value={newStateForm.countryId}
                onChange={(e) => setNewStateForm({ ...newStateForm, countryId: Number(e.target.value) })}
                style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
              >
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>State Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Kerala"
                  value={newStateForm.name}
                  onChange={(e) => setNewStateForm({ ...newStateForm, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>State Code</label>
                <input 
                  type="text" 
                  placeholder="KL"
                  value={newStateForm.code}
                  onChange={(e) => setNewStateForm({ ...newStateForm, code: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAddStateModal(false)} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={() => {
                  if (!newStateForm.name.trim()) return;
                  const c = countries.find(item => item.id === newStateForm.countryId);
                  setStates(prev => [...prev, { id: Date.now(), countryName: c ? c.name : 'India', ...newStateForm, isActive: true }]);
                  setShowAddStateModal(false);
                  showToast(`State ${newStateForm.name} created successfully`);
                }}
                style={{ flex: 1, padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Add State
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddDistrictModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 420, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 14px 0', color: '#fff' }}>+ Add New District</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Parent State</label>
              <select 
                value={newDistrictForm.stateId}
                onChange={(e) => setNewDistrictForm({ ...newDistrictForm, stateId: Number(e.target.value) })}
                style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
              >
                {states.map(s => <option key={s.id} value={s.id}>{s.name} ({s.countryName})</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Zone Allocation</label>
              <input 
                type="text" 
                placeholder="e.g. Zone 1 - Ramanathapuram"
                value={newDistrictForm.zoneName}
                onChange={(e) => setNewDistrictForm({ ...newDistrictForm, zoneName: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>District / Town Name</label>
              <input 
                type="text" 
                placeholder="e.g. Mandapam / Rameswaram"
                value={newDistrictForm.name}
                onChange={(e) => setNewDistrictForm({ ...newDistrictForm, name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAddDistrictModal(false)} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={() => {
                  if (!newDistrictForm.name.trim()) return;
                  const s = states.find(item => item.id === newDistrictForm.stateId);
                  setDistricts(prev => [...prev, { id: Date.now(), stateName: s ? s.name : 'Tamil Nadu', ...newDistrictForm, isActive: true }]);
                  setShowAddDistrictModal(false);
                  showToast(`District ${newDistrictForm.name} created successfully`);
                }}
                style={{ flex: 1, padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Add District
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 10: INDEPENDENT OWNER DOORSTEP / HOME SALON SETUP   */}
      {/* ======================================================== */}
      {showIndependentSetupModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px 0', color: '#fff' }}>Independent Provider Configuration</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>Configure Doorstep Radius or Home Salon setup</p>

            <div style={{ background: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', display: 'block', marginBottom: 8 }}>SERVICE DELIVERY PREFERENCE:</span>
              <p style={{ fontSize: 12, color: '#cbd5e1', margin: '0 0 8px 0' }}>
                📍 <strong>Doorstep Radius:</strong> Up to 15 km coverage around Panaikulam & Ramnad Town.<br/>
                🏠 <strong>Home Salon Studio:</strong> 2 Dedicated sanitised workstations at Panaikulam studio.
              </p>
            </div>

            <button 
              onClick={() => {
                setShowIndependentSetupModal(false);
                showToast('Independent setup preferences verified & saved!');
              }}
              style={{ width: '100%', padding: '11px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 11: TOP UP / RECHARGE WALLET MODAL (OWNER)         */}
      {/* ======================================================== */}
      {showTopUpWalletModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 420, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>Request Wallet Recharge</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>Deposit float funds to maintain negative limit threshold for cash bookings.</p>
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Amount (₹)</label>
              <input type="number" defaultValue={2000} style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700 }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowTopUpWalletModal(false)} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={() => {
                  setShowTopUpWalletModal(false);
                  showToast('Recharge request of ₹2,000 submitted to Finance Officer!');
                }}
                style={{ flex: 1, padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {showWithdrawWalletModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 420, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>Request Wallet Withdrawal</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px 0' }}>Request bank payout for surplus balance above mandatory security deposit.</p>
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Withdrawal Amount (₹)</label>
              <input type="number" defaultValue={1000} style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700 }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowWithdrawWalletModal(false)} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={() => {
                  setShowWithdrawWalletModal(false);
                  showToast('Payout request of ₹1,000 submitted for Finance reconciliation!');
                }}
                style={{ flex: 1, padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Request Payout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
