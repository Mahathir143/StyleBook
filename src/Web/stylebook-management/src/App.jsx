import React, { useState } from 'react';
import { 
  ShieldCheck, Store, Scissors, Calendar, Tag, Bell, CheckCircle2, 
  XCircle, Clock, MapPin, UserCheck, Phone, DollarSign, LogOut, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw, Smartphone, Key, Plus, Lock, User,
  FileText, AlertTriangle, Users, Building, Send, Check, ShieldAlert, Globe, ArrowLeftRight, HelpCircle, Mail
} from 'lucide-react';

// Pre-configured Test Users with Strict Hierarchy
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

  // 1. Master Geographies (Countries -> States -> Zones -> Districts)
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

  // Master Services Catalog with Minimum Floor Price
  const [masterServices, setMasterServices] = useState([
    { id: 1, name: 'Royal Precision Haircut & Wash', category: 'Hair Care', duration: 30, basePrice: 200, minFloorPrice: 150, isActive: true },
    { id: 2, name: 'Herbal Hair Spa & Dandruff Care', category: 'Hair Care', duration: 45, basePrice: 650, minFloorPrice: 500, isActive: true },
    { id: 3, name: 'Royal Hot Towel Shave', category: 'Shave & Beard', duration: 25, basePrice: 150, minFloorPrice: 100, isActive: true },
    { id: 4, name: 'Beard Shape & Designer Trim', category: 'Shave & Beard', duration: 20, basePrice: 120, minFloorPrice: 90, isActive: true },
    { id: 5, name: 'Kesar Gold Glow Facial', category: 'Facial & Glow', duration: 45, basePrice: 800, minFloorPrice: 650, isActive: true },
    { id: 6, name: 'Traditional South Bridal Makeover', category: 'Bridal', duration: 90, basePrice: 3000, minFloorPrice: 2000, isActive: true },
    { id: 7, name: 'Ayurvedic Head & Shoulder Massage', category: 'Head Massage', duration: 30, basePrice: 400, minFloorPrice: 300, isActive: true }
  ]);

  // Salons
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

  // Branches (Hierarchical: Country -> State -> Zone -> District)
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
      isActive: true,
      pocName: 'Ilyas Raja',
      pocPhone: '+91 94431 77222',
      pocEmail: 'poc.puduvalasai@royalclassic.in',
      pocRole: 'Branch In-Charge',
      offeredServiceIds: [1, 2, 5]
    },
    {
      id: 'b3333333-3333-3333-3333-333333333333',
      salonId: 'bbbb2222-bbbb-2222-bbbb-222222222222',
      salonName: 'Kavitha Doorstep Bridal & Beauty Care',
      branchName: 'Kavitha Doorstep Studio (Panaikulam)',
      countryId: 1, stateId: 1, zoneId: 1, districtId: 3,
      country: 'India', state: 'Tamil Nadu', zone: 'Zone 1 - Ramanathapuram', district: 'Panaikulam',
      locality: 'Panaikulam',
      addressLine: 'Doorstep Mobile Service, Covering Panaikulam, Sakkarakottai & Ramnad',
      phoneContact: '+91 98421 00333',
      isDoorstepEnabled: true,
      isActive: true,
      pocName: 'Kavitha Praveen',
      pocPhone: '+91 94431 88991',
      pocEmail: 'kavitha.beauty@gmail.com',
      pocRole: 'Lead Beautician & Site POC',
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
      isActive: true,
      pocName: 'Saravanan Natarajan',
      pocPhone: '+91 94431 88992',
      pocEmail: 'saravanan.sakkarakottai@gmail.com',
      pocRole: 'Store Manager & POC',
      offeredServiceIds: [1, 3, 7]
    }
  ]);

  // Stylists with Supported Services & Branch Mapping
  const [stylists, setStylists] = useState([
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: 'Karthik Raja',
      specialization: 'Master Stylist & Herbal Hair Care Expert',
      branchId: 'b1111111-1111-1111-1111-111111111111',
      branch: 'Royal Classic - Ramnad Town Branch',
      supportedServiceIds: [1, 2, 3, 4], // Can perform these
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
      shiftToday: '10:00 AM - 07:00 PM (Direct Client Booking)',
      rating: 4.95,
      totalReviews: 52,
      isActive: true
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: 'Ilyas Senior Barber',
      specialization: 'Hot Towel Shave & Beard Contouring',
      branchId: 'b2222222-2222-2222-2222-222222222222',
      branch: 'Royal Classic - Puduvalasai Branch',
      supportedServiceIds: [1, 3, 4],
      doorstepEnabled: false,
      doorstepRadiusKm: 0,
      shiftToday: '09:30 AM - 08:30 PM (Lunch 01:30 PM - 02:30 PM)',
      rating: 4.85,
      totalReviews: 34,
      isActive: true
    }
  ]);

  // Bookings with Stylist Specificity & Owner Assignment
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
      bookedStylistSpecific: true, // Customer booked specific stylist!
      confirmationStatus: 'Confirmed', // Confirmed by Stylist/Owner
      date: 'Today, 25 Oct 2026',
      slot: '02:00 PM - 02:45 PM',
      netAmount: 600,
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
      confirmationStatus: 'AwaitingOwnerAssignment',
      date: 'Tomorrow, 26 Oct 2026',
      slot: '11:00 AM - 11:30 AM',
      netAmount: 200,
      status: 'PendingConfirmation',
      otp: '782194',
      isOtpVerified: false
    }
  ]);

  // Governance & Compliance Notices (Targeted to Stylist / Owner / Branch / Customer)
  const [complianceNotices, setComplianceNotices] = useState([
    {
      id: 'not-01',
      targetType: 'BRANCH', // BRANCH, STYLIST, OWNER, CUSTOMER
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
    },
    {
      id: 'not-02',
      targetType: 'STYLIST',
      targetName: 'Karthik Raja (Stylist)',
      salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
      branchId: 'b1111111-1111-1111-1111-111111111111',
      issuedBy: 'Selvakumar (State Admin)',
      category: 'Attendance & Punctuality',
      subject: 'Morning Shift Adherence Notice',
      description: 'Stylist must adhere strictly to agreed 9:00 AM opening shift buffer.',
      gracePeriodHours: 24,
      status: 'NOTICE_ISSUED',
      ownerReply: null,
      issuedDate: '25 Oct 2026, 09:00 AM'
    }
  ]);

  // Verified Customer Reviews (Branch + Stylist Dual Reviews)
  const [reviews, setReviews] = useState([
    {
      id: 'rev-01',
      bookingReference: 'SB-RAMNAD-01',
      customerName: 'Mohamed Irfan',
      branchName: 'Royal Classic - Ramnad Town Branch',
      stylistName: 'Karthik Raja',
      branchRating: 5,
      branchComment: 'Extremely clean salon with hygienic towels and air conditioning. Best salon in Ramnad Town!',
      stylistRating: 5,
      stylistComment: 'Karthik gave a relaxing herbal hair spa. Very polite and professional technique.',
      createdAt: 'Today, 25 Oct 2026'
    }
  ]);

  // System Users
  const [usersList, setUsersList] = useState(PRESET_USERS);

  // Form states for modals
  const [newBranchForm, setNewBranchForm] = useState({
    branchName: '', countryId: 1, stateId: 1, zoneId: 1, districtId: 1,
    addressLine: '', phoneContact: '', isDoorstepEnabled: false,
    pocName: '', pocPhone: '', pocEmail: '', pocRole: 'Branch Operations Head',
    selectedServices: [1, 2, 3]
  });

  const [newStylistForm, setNewStylistForm] = useState({
    name: '', branchId: 'b1111111-1111-1111-1111-111111111111',
    specialization: 'Hair Care & Shave Expert', selectedServices: [1, 2],
    doorstepEnabled: false, doorstepRadiusKm: 10
  });

  const [newServiceForm, setNewServiceForm] = useState({
    name: '', category: 'Hair Care', duration: 30, basePrice: 250, minFloorPrice: 200
  });

  const [newNoticeForm, setNewNoticeForm] = useState({
    targetType: 'BRANCH', targetName: '', salonId: 'aaaa1111-aaaa-1111-aaaa-111111111111',
    branchId: 'b1111111-1111-1111-1111-111111111111', category: 'Hygiene & Sanitation',
    subject: '', description: '', gracePeriodHours: 48
  });

  const [newGeoForm, setNewGeoForm] = useState({
    type: 'COUNTRY', countryName: '', iso: '', phoneCode: '+', stateName: '', zoneName: '', districtName: ''
  });

  const [newUserForm, setNewUserForm] = useState({
    fullName: '', username: '', role: 'ZONAL_MANAGER', territoryZone: 'Zone 1 - Ramanathapuram'
  });

  const [shiftAdjustmentForm, setShiftAdjustmentForm] = useState({
    stylistId: '', newStartTime: '09:00 AM', newEndTime: '08:00 PM', newLunchStart: '03:00 PM', newLunchEnd: '04:00 PM'
  });

  const [ownerReplyText, setOwnerReplyText] = useState('');

  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Login handler
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const username = loginForm.username.trim().toLowerCase();
    const user = usersList.find(u => u.username.toLowerCase() === username);

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoginError('');
      showToast(`Welcome, ${user.name}! Logged in as ${user.label}`);
    } else {
      setLoginError('Invalid credentials. Check username or select a test role.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    showToast('Logged out successfully.');
  };

  // Scoped Data Visibility Filters
  const visibleSalons = salons.filter(s => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 2) return true; // SuperAdmin & State Admin see all
    if (currentUser.role === 'ZONAL_MANAGER') return s.zoneId === currentUser.zoneId;
    if (currentUser.type === 'OWNER') return s.id === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return s.id === 'aaaa1111-aaaa-1111-aaaa-111111111111';
    return false;
  });

  const visibleBranches = branches.filter(b => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 2) return true;
    if (currentUser.role === 'ZONAL_MANAGER') return b.zoneId === currentUser.zoneId;
    if (currentUser.type === 'OWNER') return b.salonId === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return true;
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
    if (currentUser.hierarchyLevel <= 3) return true;
    if (currentUser.type === 'OWNER') return b.salonId === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return b.stylistId === currentUser.stylistId;
    return false;
  });

  // Strict Downgrade Users List Only!
  const visibleDowngradeUsers = usersList.filter(u => {
    if (!currentUser) return false;
    return u.hierarchyLevel > currentUser.hierarchyLevel;
  });

  // Governance notices relevant to active user
  const relevantNotices = complianceNotices.filter(n => {
    if (!currentUser) return false;
    if (currentUser.hierarchyLevel <= 3) return true; // Admins & Managers see all notices in scope
    if (currentUser.type === 'OWNER') return n.salonId === currentUser.salonId;
    if (currentUser.type === 'STYLIST') return n.targetType === 'STYLIST' && n.targetName.includes(currentUser.name);
    return false;
  });

  // Toggle Active / DeActive by Level 2 & Level 3 Users
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
    showToast('Branch Active/DeActive status updated. Reflected in portal!');
  };

  const handleToggleStylistActive = (stylistId) => {
    if (currentUser.hierarchyLevel > 3) {
      showToast('Permission Denied: Only Level 2 and 3 users can toggle stylist active status.');
      return;
    }
    setStylists(prev => prev.map(st => st.id === stylistId ? { ...st, isActive: !st.isActive } : st));
    showToast('Stylist Active/DeActive status updated. Reflected in portal!');
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

  // Stylist toggles own service capability (Select / Deselect)
  const handleToggleStylistService = (serviceId) => {
    setStylists(prev => prev.map(st => {
      if (st.id === currentUser.stylistId) {
        const has = st.supportedServiceIds.includes(serviceId);
        const updated = has 
          ? st.supportedServiceIds.filter(id => id !== serviceId)
          : [...st.supportedServiceIds, serviceId];
        return { ...st, supportedServiceIds: updated };
      }
      return st;
    }));
    showToast('Your supported service capabilities have been updated!');
  };

  // Owner Assigns Stylist to "Any Stylist" Booking
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
    showToast(`Stylist ${st.name} assigned! Booking confirmed.`);
  };

  // OTP Verification Handshake (Owner & Stylist only)
  const handleVerifyOtp = (bookingId, enteredOtp) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (booking.otp === enteredOtp.trim()) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'InProgress', isOtpVerified: true } : b));
      showToast('OTP Verified! Service status updated to InProgress.');
    } else {
      showToast('Invalid OTP. Please check code with customer.');
    }
  };

  const handleCompleteService = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
    showToast('Service Marked as Completed! Customer verified review unlocked.');
  };

  // Create Branch (with Country -> State -> Zone -> District)
  const handleCreateBranch = (e) => {
    if (e) e.preventDefault();
    if (!newBranchForm.branchName || !newBranchForm.pocName || !newBranchForm.pocPhone) {
      showToast('Please fill all branch details and the mandatory Site POC person!');
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
      isActive: true,
      pocName: newBranchForm.pocName,
      pocPhone: newBranchForm.pocPhone,
      pocEmail: newBranchForm.pocEmail || 'poc@stylebook.in',
      pocRole: newBranchForm.pocRole || 'Branch In-Charge',
      offeredServiceIds: newBranchForm.selectedServices
    };

    setBranches([...branches, branchObj]);
    setShowAddBranchModal(false);
    showToast(`Branch "${branchObj.branchName}" created in ${branchObj.district}, ${branchObj.country}!`);
  };

  // Add Stylist (with Branch & Multi-select Services)
  const handleAddStylist = (e) => {
    if (e) e.preventDefault();
    if (!newStylistForm.name) {
      showToast('Please enter stylist name.');
      return;
    }

    const targetBranch = branches.find(b => b.id === newStylistForm.branchId) || branches[0];

    const stylistObj = {
      id: `c-${Date.now()}`,
      salonId: currentUser.salonId || 'aaaa1111-aaaa-1111-aaaa-111111111111',
      name: newStylistForm.name,
      specialization: newStylistForm.specialization,
      branchId: targetBranch.id,
      branch: targetBranch.branchName,
      supportedServiceIds: newStylistForm.selectedServices,
      doorstepEnabled: newStylistForm.doorstepEnabled,
      doorstepRadiusKm: Number(newStylistForm.doorstepRadiusKm),
      shiftToday: '09:00 AM - 08:00 PM (Lunch 01:00 PM - 02:00 PM)',
      rating: 5.0,
      totalReviews: 0,
      isActive: true
    };

    setStylists([...stylists, stylistObj]);
    setShowAddStylistModal(false);
    showToast(`Stylist "${stylistObj.name}" onboarded with ${stylistObj.supportedServiceIds.length} skills!`);
  };

  // Add Master Service (Level 1, 2, 3 Floor Price Authority)
  const handleAddMasterService = (e) => {
    if (e) e.preventDefault();
    if (!newServiceForm.name) {
      showToast('Please enter service name.');
      return;
    }

    const svcObj = {
      id: Date.now(),
      name: newServiceForm.name,
      category: newServiceForm.category,
      duration: Number(newServiceForm.duration),
      basePrice: Number(newServiceForm.basePrice),
      minFloorPrice: Number(newServiceForm.minFloorPrice),
      isActive: true
    };

    setMasterServices([...masterServices, svcObj]);
    setShowAddServiceModal(false);
    showToast(`New Service "${svcObj.name}" added with Minimum Floor Price ₹${svcObj.minFloorPrice}!`);
  };

  // Issue Compliance Notice (to Stylist / Owner / Branch / Customer)
  const handleIssueNotice = (e) => {
    if (e) e.preventDefault();
    if (!newNoticeForm.subject || !newNoticeForm.description) {
      showToast('Please fill subject and description.');
      return;
    }

    const noticeObj = {
      id: `not-${Date.now()}`,
      targetType: newNoticeForm.targetType,
      targetName: newNoticeForm.targetName || 'Royal Classic - Ramnad Town Branch',
      salonId: newNoticeForm.salonId,
      branchId: newNoticeForm.branchId,
      issuedBy: currentUser.name,
      category: newNoticeForm.category,
      subject: newNoticeForm.subject,
      description: newNoticeForm.description,
      gracePeriodHours: Number(newNoticeForm.gracePeriodHours),
      status: 'NOTICE_ISSUED',
      ownerReply: null,
      issuedDate: 'Today, 25 Oct 2026'
    };

    setComplianceNotices([noticeObj, ...complianceNotices]);
    setShowIssueNoticeModal(false);
    showToast(`Notice issued to ${noticeObj.targetType}: ${noticeObj.targetName}!`);
  };

  // Owner submits explanation
  const handleSubmitOwnerReply = (noticeId) => {
    if (!ownerReplyText.trim()) {
      showToast('Please enter your explanation.');
      return;
    }

    setComplianceNotices(prev => prev.map(n => n.id === noticeId ? { ...n, status: 'OWNER_REPLIED', ownerReply: ownerReplyText } : n));
    setShowOwnerReplyModal(null);
    setOwnerReplyText('');
    showToast('Official explanation submitted to Management for review.');
  };

  // Create Master Geography (Super Admin: Country, Admin: State/Zone/District)
  const handleCreateGeography = (e) => {
    if (e) e.preventDefault();
    if (newGeoForm.type === 'COUNTRY' && newGeoForm.countryName) {
      const c = { id: Date.now(), name: newGeoForm.countryName, iso: newGeoForm.iso || 'NEW', phoneCode: newGeoForm.phoneCode || '+99' };
      setCountries([...countries, c]);
      showToast(`Country "${c.name}" added!`);
    } else if (newGeoForm.type === 'STATE' && newGeoForm.stateName) {
      const s = { id: Date.now(), countryId: 1, name: newGeoForm.stateName, code: 'ST' };
      setStates([...states, s]);
      showToast(`State "${s.name}" added under India!`);
    } else if (newGeoForm.type === 'ZONE' && newGeoForm.zoneName) {
      const z = { id: Date.now(), stateId: 1, name: newGeoForm.zoneName };
      setZones([...zones, z]);
      showToast(`Zone "${z.name}" added under Tamil Nadu!`);
    } else if (newGeoForm.type === 'DISTRICT' && newGeoForm.districtName) {
      const d = { id: Date.now(), zoneId: 1, name: newGeoForm.districtName };
      setDistricts([...districts, d]);
      showToast(`District "${d.name}" added under Zone 1!`);
    }
    setShowCreateGeoModal(false);
  };

  // Shift Adjustment (Owner and Stylist action)
  const handleSaveShiftAdjustment = (e) => {
    if (e) e.preventDefault();
    setStylists(prev => prev.map(st => {
      if (st.id === shiftAdjustmentForm.stylistId || (currentUser.type === 'STYLIST' && st.id === currentUser.stylistId)) {
        return {
          ...st,
          shiftToday: `${shiftAdjustmentForm.newStartTime} - ${shiftAdjustmentForm.newEndTime} (Adjusted Lunch: ${shiftAdjustmentForm.newLunchStart} - ${shiftAdjustmentForm.newLunchEnd})`
        };
      }
      return st;
    }));
    setShowShiftAdjustmentModal(false);
    showToast('Shift timing adjustment updated successfully!');
  };

  // MANDATORY LOGIN GATE
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #090e24 0%, #0d153a 50%, #172554 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, color: '#f8fafc'
      }}>
        <div style={{ width: '100%', maxWidth: 540, background: '#111c44', border: '1px solid #1e295d', borderRadius: 16, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scissors size={28} color="#fff" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900 }}>StyleBook Enterprise Management</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
              Multi-Region Territorial RBAC & Salon Operations Workspace
            </p>
          </div>

          {/* Dev Mode Banner & Security Environment Controls */}
          <div style={{ background: '#1c1917', border: '1px solid #78350f', borderRadius: 10, padding: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={16} color="#f59e0b" />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                  {isDevMode ? '⚠️ Dev Environment Active' : '🔒 Production Security Active'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDevMode(!isDevMode)}
                style={{ background: isDevMode ? '#451a03' : '#1e3a8a', border: '1px solid', borderColor: isDevMode ? '#b45309' : '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
              >
                {isDevMode ? 'Preview Production Mode' : 'Switch to Dev Mode'}
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#d6d3d1', marginTop: 6, lineHeight: 1.4 }}>
              {isDevMode 
                ? 'Quick 1-click test credentials are enabled below for local evaluation. In Production builds, these are automatically stripped.'
                : 'Production Mode Active: All 1-click bypasses are removed. Access strictly requires verified credentials.'}
            </p>
          </div>

          {loginError && (
            <div style={{ background: '#450a0a', border: '1px solid #991b1b', color: '#f87171', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Username or Email</label>
              <input 
                type="text" 
                placeholder="superadmin, admin_tamilnadu, zonal_ramnad, owner_anwar..."
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4, fontSize: 13 }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Password</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: 11, cursor: 'pointer' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter password (default: Password@123)"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4, fontSize: 13 }}
              />
            </div>

            <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              Secure Login to Workspace
            </button>
          </form>

          {isDevMode && (
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #1e295d' }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
                ⚡ Dev 1-Click Role Logins (Tamil Nadu Hierarchy)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {PRESET_USERS.map(u => (
                  <button
                    key={u.username}
                    onClick={() => {
                      setCurrentUser(u);
                      setIsAuthenticated(true);
                      showToast(`Logged in as ${u.name} (${u.label})`);
                    }}
                    style={{ background: '#182559', border: '1px solid #233575', color: '#cbd5e1', padding: '8px 12px', borderRadius: 8, fontSize: 12, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <span style={{ fontWeight: 600 }}>{u.label}</span>
                    <span style={{ color: '#38bdf8', fontSize: 11 }}>Login &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // AUTHENTICATED WORKSPACE
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b1329', color: '#f8fafc' }}>
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{
          position: 'fixed', top: 20, right: 20, background: '#10b981', color: '#ffffff',
          padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          zIndex: 99999, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600
        }}>
          <Sparkles size={18} />
          {notificationMsg}
        </div>
      )}

      {/* Sidebar Navigation */}
      <div style={{ width: 290, background: '#111c44', borderRight: '1px solid #1e295d', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e295d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scissors size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>StyleBook</h2>
              <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Enterprise Operations</span>
            </div>
          </div>
        </div>

        {/* User Scope Box */}
        <div style={{ padding: '16px 18px', background: '#182559', margin: '12px 14px', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Actor Profile</span>
            <span style={{ background: '#0284c7', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Level {currentUser.hierarchyLevel}: {currentUser.role}</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{currentUser.name}</p>
          <p style={{ fontSize: 11, color: '#38bdf8', marginTop: 2 }}>
            {currentUser.jurisdiction || currentUser.salon}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          <button 
            onClick={() => setActiveTab('overview')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'overview' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <ShieldCheck size={18} /> Overview & Scoped KPIs
          </button>

          {/* Master Geography (Super Admin & State Admin) */}
          {currentUser.hierarchyLevel <= 2 && (
            <button 
              onClick={() => setActiveTab('geography')} 
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'geography' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <Globe size={18} /> Master Geographies ({countries.length})
            </button>
          )}

          {/* User Provisioning Tab (Super Admin, State Admin, Zonal Manager) */}
          {currentUser.hierarchyLevel <= 3 && (
            <button 
              onClick={() => setActiveTab('users')} 
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'users' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <Users size={18} /> User Provisioning (Downgrade)
            </button>
          )}

          {/* Salons & Approvals (Management) */}
          {currentUser.type === 'MANAGEMENT' && (
            <button 
              onClick={() => setActiveTab('approvals')} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'approvals' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={18} /> Salons & Approvals
              </div>
              <span style={{ background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                {visibleSalons.filter(s => s.status === 'Pending').length} Pending
              </span>
            </button>
          )}

          {/* Governance & Notices */}
          <button 
            onClick={() => setActiveTab('governance')} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'governance' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldAlert size={18} /> Governance & Notices
            </div>
            {relevantNotices.filter(n => n.status !== 'RESOLVED').length > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                {relevantNotices.filter(n => n.status !== 'RESOLVED').length} Active
              </span>
            )}
          </button>

          {/* Branches & POCs (Management & Owners) */}
          {currentUser.type !== 'STYLIST' && (
            <button 
              onClick={() => setActiveTab('branches')} 
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'branches' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <Store size={18} /> Branches & POCs ({visibleBranches.length})
            </button>
          )}

          {/* Stylist Rosters & Skills */}
          {currentUser.type !== 'CUSTOMER' && (
            <button 
              onClick={() => setActiveTab('stylists')} 
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'stylists' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <Scissors size={18} /> Stylists & Skills ({visibleStylists.length})
            </button>
          )}

          {/* Services & Floor Pricing (Floor price set by L1, L2, L3) */}
          <button 
            onClick={() => setActiveTab('pricing')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'pricing' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <DollarSign size={18} /> Catalog & Floor Pricing
          </button>

          {/* Bookings & Check-in OTP (Owners and Stylists do Booking Management) */}
          <button 
            onClick={() => setActiveTab('bookings')} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'bookings' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Calendar size={18} /> Bookings & Check-In OTP
            </div>
            <span style={{ background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
              {visibleBookings.length}
            </span>
          </button>

          {/* Reviews & Ratings Tab */}
          <button 
            onClick={() => setActiveTab('reviews')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'reviews' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Sparkles size={18} /> Verified Reviews ({reviews.length})
          </button>

          {/* Help Desk / Contact Us Directory */}
          <button 
            onClick={() => setActiveTab('helpdesk')} 
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textAlign: 'left', background: activeTab === 'helpdesk' ? '#2563eb' : 'transparent', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <HelpCircle size={18} /> Help Desk & POCs
          </button>

        </div>

        <div style={{ padding: 16, borderTop: '1px solid #1e295d' }}>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: '#1f2937', color: '#f87171', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={16} /> Sign Out of Platform
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        
        {/* Urgent Relevant Notice Alert on Home Page */}
        {relevantNotices.filter(n => n.status !== 'RESOLVED').length > 0 && (
          <div style={{ background: '#450a0a', border: '1px solid #ef4444', borderRadius: 10, padding: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={24} color="#f87171" />
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fca5a5' }}>
                  URGENT COMPLIANCE NOTICE: Addressed to {relevantNotices[0].targetType} ({relevantNotices[0].targetName})
                </h4>
                <p style={{ fontSize: 12, color: '#fecaca', marginTop: 2 }}>
                  {relevantNotices[0].subject} — Please submit your response within the grace period.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('governance')}
              style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              View Notice &rarr;
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900 }}>Workspace Dashboard</h1>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>
                  Territory: <strong>{currentUser.jurisdiction || currentUser.salon}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {currentUser.hierarchyLevel <= 3 && (
                  <button 
                    onClick={() => setShowAddServiceModal(true)}
                    style={{ background: '#0284c7', color: '#fff', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
                  >
                    <Plus size={16} /> New Service & Floor Price
                  </button>
                )}
                {currentUser.type === 'OWNER' && (
                  <button 
                    onClick={() => setShowAddBranchModal(true)}
                    style={{ background: '#2563eb', color: '#fff', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
                  >
                    <Plus size={16} /> New Branch (Country/State/Zone)
                  </button>
                )}
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 24 }}>
              <div style={{ background: '#111c44', padding: 20, borderRadius: 12, border: '1px solid #1e295d' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Scoped Salons</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#38bdf8' }}>{visibleSalons.length}</h3>
                <span style={{ fontSize: 11, color: '#10b981' }}>{visibleSalons.filter(s => s.status === 'Approved').length} Live Approved</span>
              </div>
              <div style={{ background: '#111c44', padding: 20, borderRadius: 12, border: '1px solid #1e295d' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Branches</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#a78bfa' }}>{visibleBranches.filter(b => b.isActive).length}</h3>
                <span style={{ fontSize: 11, color: '#cbd5e1' }}>100% with Help Desk POC</span>
              </div>
              <div style={{ background: '#111c44', padding: 20, borderRadius: 12, border: '1px solid #1e295d' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Stylists</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#f59e0b' }}>{visibleStylists.filter(st => st.isActive).length}</h3>
                <span style={{ fontSize: 11, color: '#cbd5e1' }}>Multi-Skill Assigned</span>
              </div>
              <div style={{ background: '#111c44', padding: 20, borderRadius: 12, border: '1px solid #1e295d' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Bookings</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color: '#10b981' }}>{visibleBookings.length}</h3>
                <span style={{ fontSize: 11, color: '#38bdf8' }}>6-Digit OTP Protected</span>
              </div>
            </div>

            {/* Role Responsibilities Summary Card */}
            <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 24, marginTop: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>Enterprise Rules & Operational Scope</h3>
              <ul style={{ fontSize: 13, color: '#cbd5e1', marginTop: 10, lineHeight: 1.8, paddingLeft: 20 }}>
                <li><strong>Owners & Stylists Scope:</strong> Owners and Stylists exclusively handle appointment management (Verify and Start via 6-digit OTP) and Shift Adjustments.</li>
                <li><strong>Active / DeActive Authority:</strong> Level 2 (State Admin) and Level 3 (Zonal Manager) users have direct authority to toggle Active/DeActive for any Service, Stylist, or Branch. Only Active items reflect in Customer Web.</li>
                <li><strong>Hierarchical Multi-Region Scaling:</strong> Branches are bound to Country $\to$ State $\to$ Zone $\to$ District for worldwide scalability.</li>
                <li><strong>Dual Booking Entry Points:</strong> Customers can book by selecting a <em>Branch</em> or a <em>Stylist</em>. If customer selects "Any Stylist", the Owner allocates the stylist upon confirmation.</li>
                <li><strong>Floor Price Authority:</strong> Level 1, 2, and 3 users configure standard Minimum Floor Prices to prevent predatory price cutting.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER GEOGRAPHIES (SUPER ADMIN & STATE ADMIN) */}
        {activeTab === 'geography' && currentUser.hierarchyLevel <= 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Master Geographies & Global Hierarchy</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Super Admin provisions Countries; Country Admins provision States, Zones, and Districts.
                </p>
              </div>
              <button 
                onClick={() => setShowCreateGeoModal(true)}
                style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add Geography Unit
              </button>
            </div>

            {/* Geographical Tree Table */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
              <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 18 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8' }}>Countries ({countries.length})</h4>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {countries.map(c => (
                    <div key={c.id} style={{ background: '#182559', padding: '8px 12px', borderRadius: 6, fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{c.name}</span>
                      <code style={{ color: '#38bdf8' }}>{c.iso}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 18 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#a78bfa' }}>States ({states.length})</h4>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {states.map(s => (
                    <div key={s.id} style={{ background: '#182559', padding: '8px 12px', borderRadius: 6, fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{s.name}</span>
                      <code style={{ color: '#a78bfa' }}>{s.code}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 18 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b' }}>Zones ({zones.length})</h4>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {zones.map(z => (
                    <div key={z.id} style={{ background: '#182559', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
                      <span>{z.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 18 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>Districts / Towns ({districts.length})</h4>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {districts.map(d => (
                    <div key={d.id} style={{ background: '#182559', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
                      <span>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER PROVISIONING & DOWNGRADE LIST ONLY */}
        {activeTab === 'users' && currentUser.hierarchyLevel <= 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>User Provisioning & Downgrade User Directory</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Strict Governance: Showing <strong>strictly downgrade users</strong> under Level {currentUser.hierarchyLevel} ({currentUser.role}).
                </p>
              </div>
              <button 
                onClick={() => setShowCreateUserModal(true)}
                style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
              >
                <Plus size={16} /> Create Downgrade User
              </button>
            </div>

            <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', marginTop: 20, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#182559', color: '#94a3b8', borderBottom: '1px solid #233575' }}>
                    <th style={{ padding: '12px 16px' }}>Full Name</th>
                    <th style={{ padding: '12px 16px' }}>Username</th>
                    <th style={{ padding: '12px 16px' }}>Downgrade Role</th>
                    <th style={{ padding: '12px 16px' }}>Territory / Jurisdiction</th>
                    <th style={{ padding: '12px 16px' }}>Hierarchy Level</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleDowngradeUsers.map(u => (
                    <tr key={u.username} style={{ borderBottom: '1px solid #1e295d' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '14px 16px', color: '#38bdf8' }}><code>{u.username}</code></td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: u.hierarchyLevel === 2 ? '#2563eb' : (u.hierarchyLevel === 3 ? '#0284c7' : '#059669'),
                          color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{u.jurisdiction || u.salon}</td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>Level {u.hierarchyLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BRANCHES & POCS WITH HIERARCHICAL CREATION */}
        {activeTab === 'branches' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Branch Locations & Designated Site POCs</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Global hierarchy: Country $\to$ State $\to$ Zone $\to$ District with Site Help Desk POCs.
                </p>
              </div>
              {currentUser.type === 'OWNER' && (
                <button 
                  onClick={() => setShowAddBranchModal(true)}
                  style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Add Branch (Country/State/Zone)
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginTop: 20 }}>
              {visibleBranches.map(branch => (
                <div key={branch.id} style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800 }}>{branch.branchName}</h3>
                    <span style={{
                      background: branch.isActive ? '#065f46' : '#7f1d1d',
                      color: branch.isActive ? '#34d399' : '#fca5a5',
                      padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700
                    }}>
                      {branch.isActive ? 'Active' : 'DeActive / Hidden'}
                    </span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                    🌍 {branch.country} &rarr; {branch.state} &rarr; {branch.zone} &rarr; <strong>{branch.district}</strong>
                  </p>
                  <p style={{ color: '#cbd5e1', fontSize: 12, marginTop: 2 }}>{branch.addressLine}</p>

                  {/* Help Desk POC Details */}
                  <div style={{ marginTop: 14, background: '#182559', border: '1px solid #233575', borderRadius: 8, padding: 12 }}>
                    <span style={{ fontSize: 10, color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>Site Help Desk POC</span>
                    <p style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{branch.pocName} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({branch.pocRole})</span></p>
                    <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: '#38bdf8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {branch.pocPhone}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> {branch.pocEmail}</span>
                    </div>
                  </div>

                  {/* Offered Services Count */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12 }}>
                    <span style={{ color: '#cbd5e1' }}>Offered Services: <strong>{branch.offeredServiceIds ? branch.offeredServiceIds.length : 3} Catalog Services</strong></span>
                    {/* Active/DeActive Toggle for Level 2 & 3 Users */}
                    {currentUser.hierarchyLevel <= 3 && (
                      <button 
                        onClick={() => handleToggleBranchActive(branch.id)}
                        style={{
                          background: branch.isActive ? '#7f1d1d' : '#065f46',
                          color: '#fff', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer'
                        }}
                      >
                        {branch.isActive ? 'DeActivate Branch' : 'Activate Branch'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STYLIST ROSTERS, SKILLS & TRANSFER */}
        {activeTab === 'stylists' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Stylists, Skill Sets & Branch Assignments</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Owners assign branches and services; Stylists can select/deselect their supported services; Owners can transfer stylists.
                </p>
              </div>
              {currentUser.type === 'OWNER' && (
                <button 
                  onClick={() => setShowAddStylistModal(true)}
                  style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Onboard Stylist & Assign Skills
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {visibleStylists.map(st => (
                <div key={st.id} style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800 }}>{st.name}</h3>
                        <span style={{
                          background: st.isActive ? '#065f46' : '#7f1d1d',
                          color: st.isActive ? '#34d399' : '#fca5a5',
                          padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700
                        }}>
                          {st.isActive ? 'Active' : 'DeActive / Hidden'}
                        </span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                        {st.specialization} • Assigned to: <strong style={{ color: '#38bdf8' }}>{st.branch}</strong>
                      </p>
                      <p style={{ color: '#cbd5e1', fontSize: 12, marginTop: 4 }}>
                        Shift: {st.shiftToday}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {/* Stylist or Owner can adjust shifts */}
                      {(currentUser.type === 'OWNER' || currentUser.type === 'STYLIST') && (
                        <button 
                          onClick={() => {
                            setShiftAdjustmentForm({ ...shiftAdjustmentForm, stylistId: st.id });
                            setShowShiftAdjustmentModal(true);
                          }}
                          style={{ background: '#0284c7', color: '#fff', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                        >
                          Shift Adjustment
                        </button>
                      )}

                      {/* Owner can transfer stylist between branches */}
                      {currentUser.type === 'OWNER' && (
                        <button 
                          onClick={() => setShowTransferStylistModal(st.id)}
                          style={{ background: '#7c3aed', color: '#fff', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
                        >
                          <ArrowLeftRight size={14} /> Transfer Branch
                        </button>
                      )}

                      {/* Level 2 & 3 Users can Make Active / DeActive */}
                      {currentUser.hierarchyLevel <= 3 && (
                        <button 
                          onClick={() => handleToggleStylistActive(st.id)}
                          style={{
                            background: st.isActive ? '#7f1d1d' : '#065f46',
                            color: '#fff', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer'
                          }}
                        >
                          {st.isActive ? 'DeActivate Stylist' : 'Activate Stylist'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-Select Supported Services (Skills) */}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #1e295d' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Stylist Supported Services ({st.supportedServiceIds.length} enabled)
                      </span>
                      {currentUser.type === 'STYLIST' && currentUser.stylistId === st.id && (
                        <span style={{ fontSize: 11, color: '#38bdf8' }}>Click any service below to Select / Deselect your skill</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      {masterServices.map(svc => {
                        const isCapable = st.supportedServiceIds.includes(svc.id);
                        return (
                          <button
                            key={svc.id}
                            disabled={currentUser.type !== 'STYLIST' || currentUser.stylistId !== st.id}
                            onClick={() => handleToggleStylistService(svc.id)}
                            style={{
                              background: isCapable ? '#1e3a8a' : '#1e293b',
                              color: isCapable ? '#93c5fd' : '#64748b',
                              border: isCapable ? '1px solid #3b82f6' : '1px solid #334155',
                              padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                              cursor: (currentUser.type === 'STYLIST' && currentUser.stylistId === st.id) ? 'pointer' : 'default'
                            }}
                          >
                            {isCapable ? '✓ ' : '+ '} {svc.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CATALOG & FLOOR PRICING (SET BY L1, L2, L3) */}
        {activeTab === 'pricing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Master Services & Minimum Floor Price Authority</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Level 1 (Super Admin), Level 2 (State Admin), and Level 3 (Zonal Manager) can set Minimum Floor Prices and add services.
                </p>
              </div>
              {currentUser.hierarchyLevel <= 3 && (
                <button 
                  onClick={() => setShowAddServiceModal(true)}
                  style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Add Master Service & Floor Price
                </button>
              )}
            </div>

            <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', marginTop: 20, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#182559', color: '#94a3b8', borderBottom: '1px solid #233575' }}>
                    <th style={{ padding: '12px 16px' }}>Service Name</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Duration</th>
                    <th style={{ padding: '12px 16px' }}>Base Price</th>
                    <th style={{ padding: '12px 16px' }}>Minimum Floor Price (Set by L1/L2/L3)</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {masterServices.map(svc => (
                    <tr key={svc.id} style={{ borderBottom: '1px solid #1e295d' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{svc.name}</td>
                      <td style={{ padding: '14px 16px', color: '#38bdf8' }}>{svc.category}</td>
                      <td style={{ padding: '14px 16px' }}>{svc.duration} mins</td>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>₹{svc.basePrice}</td>
                      <td style={{ padding: '14px 16px', color: '#f59e0b', fontWeight: 800 }}>
                        ₹{svc.minFloorPrice}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: svc.isActive ? '#065f46' : '#7f1d1d',
                          color: svc.isActive ? '#34d399' : '#fca5a5',
                          padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700
                        }}>
                          {svc.isActive ? 'Active' : 'DeActive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {currentUser.hierarchyLevel <= 3 && (
                          <button 
                            onClick={() => handleToggleServiceActive(svc.id)}
                            style={{
                              background: svc.isActive ? '#7f1d1d' : '#065f46',
                              color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer'
                            }}
                          >
                            {svc.isActive ? 'DeActivate' : 'Activate'}
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

        {/* TAB 7: BOOKINGS & CHECK-IN OTP (OWNERS AND STYLISTS ONLY) */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Appointments & 6-Digit OTP Check-In</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Owners and Stylists verify 6-digit OTPs and assign stylists for "Any Stylist" bookings.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {visibleBookings.map(b => (
                <div key={b.id} style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ background: '#1e3a8a', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {b.reference}
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{b.service}</h3>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        Customer: <strong>{b.customer}</strong> ({b.phone}) • Slot: <strong>{b.slot}</strong> ({b.branch})
                      </p>
                      <p style={{ fontSize: 12, color: b.bookedStylistSpecific ? '#34d399' : '#f59e0b', marginTop: 2, fontWeight: 600 }}>
                        {b.bookedStylistSpecific 
                          ? `Specific Stylist Booked: ${b.stylist}` 
                          : `Customer requested "Any Available Stylist" — ${b.stylist}`}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        background: b.status === 'Completed' ? '#065f46' : (b.status === 'InProgress' ? '#7c3aed' : '#78350f'),
                        color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700
                      }}>
                        {b.status}
                      </span>
                      <p style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>₹{b.netAmount}</p>
                    </div>
                  </div>

                  {/* Owner Allocation Action for "Any Stylist" Bookings */}
                  {!b.bookedStylistSpecific && b.status === 'PendingConfirmation' && currentUser.type === 'OWNER' && (
                    <div style={{ marginTop: 14, background: '#182559', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>Action Required: Allocate an available stylist for this customer appointment:</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {stylists.filter(s => s.branchId === b.branchId && s.isActive).map(st => (
                          <button
                            key={st.id}
                            onClick={() => handleOwnerAssignStylist(b.id, st.id)}
                            style={{ background: '#2563eb', color: '#fff', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                          >
                            Assign {st.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OTP Verification Keypad (Owner and Stylist action) */}
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #1e295d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Smartphone size={18} color="#38bdf8" />
                      <span style={{ fontSize: 12, color: '#cbd5e1' }}>Arrival Check-in 6-Digit OTP:</span>
                      {b.status === 'Confirmed' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input 
                            type="text" 
                            id={`otp-input-${b.id}`}
                            placeholder="6-digit code"
                            maxLength={6}
                            style={{ width: 110, padding: '5px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', textAlign: 'center', fontWeight: 800 }}
                          />
                          <button 
                            onClick={() => {
                              const val = document.getElementById(`otp-input-${b.id}`).value;
                              handleVerifyOtp(b.id, val);
                            }}
                            style={{ background: '#2563eb', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                          >
                            Verify & Start
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#34d399', fontWeight: 800, fontSize: 12 }}>✓ Verified ({b.otp})</span>
                      )}
                    </div>

                    {b.status === 'InProgress' && (
                      <button 
                        onClick={() => handleCompleteService(b.id)}
                        style={{ background: '#059669', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: GOVERNANCE, COMPLIANCE & NOTICES */}
        {activeTab === 'governance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Governance, Compliance & Targeted Notices</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Notices can target individual <strong>Stylists</strong>, <strong>Owners</strong>, <strong>Branches</strong>, or <strong>Customers</strong>.
                </p>
              </div>
              {currentUser.type === 'MANAGEMENT' && (
                <button 
                  onClick={() => setShowIssueNoticeModal(true)}
                  style={{ background: '#ef4444', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}
                >
                  <AlertTriangle size={16} /> Issue Targeted Notice
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {relevantNotices.map(notice => (
                <div key={notice.id} style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800
                      }}>
                        TARGET: {notice.targetType}
                      </span>
                      <h3 style={{ fontSize: 17, fontWeight: 800 }}>{notice.subject}</h3>
                    </div>
                    <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>
                      ⏳ Grace Period: {notice.gracePeriodHours} Hours
                    </span>
                  </div>

                  <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 8 }}>{notice.description}</p>
                  
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                    <span>Target Entity: <strong style={{ color: '#38bdf8' }}>{notice.targetName}</strong></span>
                    <span>Issued By: <strong style={{ color: '#fff' }}>{notice.issuedBy}</strong></span>
                    <span>Date: <strong>{notice.issuedDate}</strong></span>
                  </div>

                  {notice.ownerReply && (
                    <div style={{ marginTop: 14, background: '#182559', border: '1px solid #233575', borderRadius: 8, padding: 12 }}>
                      <p style={{ fontSize: 11, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>Official Response Submitted:</p>
                      <p style={{ fontSize: 13, color: '#f8fafc', marginTop: 4 }}>"{notice.ownerReply}"</p>
                    </div>
                  )}

                  {currentUser.type === 'OWNER' && notice.status === 'NOTICE_ISSUED' && (
                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setShowOwnerReplyModal(notice.id)}
                        style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                      >
                        Submit Response / Action Plan
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: VERIFIED CUSTOMER REVIEWS (BRANCH + STYLIST) */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Customer Reviews & Rating Audits</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Verified completed bookings with separate star ratings and comments for Branches and Stylists.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#1e3a8a', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {r.bookingReference}
                      </span>
                      <strong style={{ fontSize: 15 }}>{r.customerName}</strong>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>{r.createdAt}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 14 }}>
                    <div style={{ background: '#182559', padding: 14, borderRadius: 8 }}>
                      <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 800, textTransform: 'uppercase' }}>1. Salon Branch Rating</span>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{r.branchName}</h4>
                      <div style={{ color: '#f59e0b', fontSize: 14, marginTop: 4 }}>{'★'.repeat(r.branchRating)} ({r.branchRating}/5)</div>
                      <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>"{r.branchComment}"</p>
                    </div>

                    <div style={{ background: '#182559', padding: 14, borderRadius: 8 }}>
                      <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>2. Stylist Rating</span>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{r.stylistName}</h4>
                      <div style={{ color: '#f59e0b', fontSize: 14, marginTop: 4 }}>{'★'.repeat(r.stylistRating)} ({r.stylistRating}/5)</div>
                      <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>"{r.stylistComment}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: HELP DESK / POC CONTACT DIRECTORY */}
        {activeTab === 'helpdesk' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>Help Desk & Point of Contact (POC) Directory</h1>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  Direct contact lines for Manager, Admin, and Finance desks.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 20 }}>
              <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>Regional Operations Desk</h3>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Zonal Manager: Murugan (Zone 1)</p>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} color="#10b981" /> +91 94431 88990</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} color="#38bdf8" /> zonal.ramnad@stylebook.in</span>
                </div>
              </div>

              <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa' }}>State Administrator Desk</h3>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>State Admin: Selvakumar (Tamil Nadu)</p>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} color="#10b981" /> +91 94431 00009</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} color="#a78bfa" /> admin.tn@stylebook.in</span>
                </div>
              </div>

              <div style={{ background: '#111c44', borderRadius: 12, border: '1px solid #1e295d', padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>Platform Finance & Billing</h3>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Payouts, Commissions, Invoices</p>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} color="#10b981" /> +91 94431 88995</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} color="#f59e0b" /> finance@stylebook.in</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: CREATE BRANCH (WITH COUNTRY -> STATE -> ZONE -> DISTRICT) */}
      {showAddBranchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Create Branch (Global Multi-Region Scaling)</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Specify Country, State, Zone, District, and Site POC.</p>

            <form onSubmit={handleCreateBranch} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input 
                type="text" 
                placeholder="Branch Name (e.g. Royal Classic - Kenikarai)"
                value={newBranchForm.branchName}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, branchName: e.target.value })}
                style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
              />

              {/* Country -> State -> Zone -> District Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Country</label>
                  <select 
                    value={newBranchForm.countryId}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, countryId: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', marginTop: 4, fontSize: 12 }}
                  >
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>State</label>
                  <select 
                    value={newBranchForm.stateId}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, stateId: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', marginTop: 4, fontSize: 12 }}
                  >
                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Zone</label>
                  <select 
                    value={newBranchForm.zoneId}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, zoneId: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', marginTop: 4, fontSize: 12 }}
                  >
                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>District / Town</label>
                  <select 
                    value={newBranchForm.districtId}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, districtId: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', marginTop: 4, fontSize: 12 }}
                  >
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Site POC Person */}
              <div style={{ background: '#182559', padding: 12, borderRadius: 8, border: '1px solid #233575' }}>
                <span style={{ fontSize: 11, color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>Site Help Desk POC Person</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 8 }}>
                  <input 
                    type="text" placeholder="POC Name"
                    value={newBranchForm.pocName}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, pocName: e.target.value })}
                    style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                  />
                  <input 
                    type="text" placeholder="POC Phone (+91 ...)"
                    value={newBranchForm.pocPhone}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, pocPhone: e.target.value })}
                    style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddBranchModal(false)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '9px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Create Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ONBOARD STYLIST & MULTI-SELECT SKILLS */}
      {showAddStylistModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 500, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Onboard Stylist & Assign Skills</h3>
            <form onSubmit={handleAddStylist} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input 
                type="text" placeholder="Stylist Full Name"
                value={newStylistForm.name}
                onChange={(e) => setNewStylistForm({ ...newStylistForm, name: e.target.value })}
                style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
              />
              <select 
                value={newStylistForm.branchId}
                onChange={(e) => setNewStylistForm({ ...newStylistForm, branchId: e.target.value })}
                style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
              >
                {branches.map(b => <option key={b.id} value={b.id}>{b.branchName} ({b.locality})</option>)}
              </select>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Select Services Stylist Can Perform</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginTop: 6 }}>
                  {masterServices.map(svc => (
                    <label key={svc.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#cbd5e1' }}>
                      <input 
                        type="checkbox"
                        checked={newStylistForm.selectedServices.includes(svc.id)}
                        onChange={(e) => {
                          const updated = e.target.checked 
                            ? [...newStylistForm.selectedServices, svc.id]
                            : newStylistForm.selectedServices.filter(id => id !== svc.id);
                          setNewStylistForm({ ...newStylistForm, selectedServices: updated });
                        }}
                      />
                      {svc.name}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddStylistModal(false)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '9px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save Stylist</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MASTER SERVICE & FLOOR PRICE (L1, L2, L3 AUTHORITY) */}
      {showAddServiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Add Master Service & Minimum Floor Price</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Only Level 1, 2, and 3 users can configure minimum floor prices.</p>

            <form onSubmit={handleAddMasterService} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input 
                type="text" placeholder="Service Name"
                value={newServiceForm.name}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                style={{ padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 13 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <input 
                  type="number" placeholder="Base Market Price (₹)"
                  value={newServiceForm.basePrice}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, basePrice: e.target.value })}
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
                <button type="button" onClick={() => setShowAddServiceModal(false)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '9px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#0284c7', color: '#fff', padding: '9px 18px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save to Catalog</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TRANSFER STYLIST (OWNER ACTION) */}
      {showTransferStylistModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 440, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Transfer Stylist to Another Branch</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Select the target branch for re-assignment:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleTransferStylist(showTransferStylistModal, b.id)}
                  style={{ background: '#182559', border: '1px solid #233575', color: '#cbd5e1', padding: '10px 14px', borderRadius: 8, textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                >
                  📍 {b.branchName} ({b.locality})
                </button>
              ))}
            </div>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button onClick={() => setShowTransferStylistModal(null)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHIFT ADJUSTMENT */}
      {showShiftAdjustmentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 440, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Stylist Shift Timing Adjustment</h3>
            <form onSubmit={handleSaveShiftAdjustment} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <input 
                  type="text" placeholder="Shift Start"
                  value={shiftAdjustmentForm.newStartTime}
                  onChange={(e) => setShiftAdjustmentForm({ ...shiftAdjustmentForm, newStartTime: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
                <input 
                  type="text" placeholder="Shift End"
                  value={shiftAdjustmentForm.newEndTime}
                  onChange={(e) => setShiftAdjustmentForm({ ...shiftAdjustmentForm, newEndTime: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <input 
                  type="text" placeholder="Lunch Start"
                  value={shiftAdjustmentForm.newLunchStart}
                  onChange={(e) => setShiftAdjustmentForm({ ...shiftAdjustmentForm, newLunchStart: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
                <input 
                  type="text" placeholder="Lunch End"
                  value={shiftAdjustmentForm.newLunchEnd}
                  onChange={(e) => setShiftAdjustmentForm({ ...shiftAdjustmentForm, newLunchEnd: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowShiftAdjustmentModal(false)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ISSUE TARGETED NOTICE */}
      {showIssueNoticeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 500, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Issue Notice to Stylist, Owner, Branch, or Customer</h3>
            <form onSubmit={handleIssueNotice} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Target Entity Type</label>
                <select 
                  value={newNoticeForm.targetType}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, targetType: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', marginTop: 4, fontSize: 12 }}
                >
                  <option value="BRANCH">Specific Branch</option>
                  <option value="STYLIST">Individual Stylist</option>
                  <option value="OWNER">Salon Owner</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </div>

              <input 
                type="text" placeholder="Target Name (e.g. Karthik Raja or Puduvalasai Branch)"
                value={newNoticeForm.targetName}
                onChange={(e) => setNewNoticeForm({ ...newNoticeForm, targetName: e.target.value })}
                style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
              />

              <input 
                type="text" placeholder="Notice Subject"
                value={newNoticeForm.subject}
                onChange={(e) => setNewNoticeForm({ ...newNoticeForm, subject: e.target.value })}
                style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
              />

              <textarea 
                rows={3} placeholder="Notice Description & Required Remedy..."
                value={newNoticeForm.description}
                onChange={(e) => setNewNoticeForm({ ...newNoticeForm, description: e.target.value })}
                style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowIssueNoticeModal(false)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Dispatch Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT EXPLANATION (OWNER) */}
      {showOwnerReplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Submit Official Explanation</h3>
            <textarea 
              rows={4}
              placeholder="State your resolution or corrective steps taken..."
              value={ownerReplyText}
              onChange={(e) => setOwnerReplyText(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', marginTop: 12, fontSize: 13 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button onClick={() => setShowOwnerReplyModal(null)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleSubmitOwnerReply(showOwnerReplyModal)} style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE GEOGRAPHY */}
      {showCreateGeoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 460, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Add Geography Unit</h3>
            <form onSubmit={handleCreateGeography} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <select 
                value={newGeoForm.type}
                onChange={(e) => setNewGeoForm({ ...newGeoForm, type: e.target.value })}
                style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
              >
                {currentUser.hierarchyLevel === 1 && <option value="COUNTRY">Country (Super Admin Only)</option>}
                <option value="STATE">State (Country Level Admin)</option>
                <option value="ZONE">Zone</option>
                <option value="DISTRICT">District / Town</option>
              </select>

              {newGeoForm.type === 'COUNTRY' && (
                <input 
                  type="text" placeholder="Country Name (e.g. Singapore)"
                  value={newGeoForm.countryName}
                  onChange={(e) => setNewGeoForm({ ...newGeoForm, countryName: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
              )}
              {newGeoForm.type === 'STATE' && (
                <input 
                  type="text" placeholder="State Name (e.g. Kerala)"
                  value={newGeoForm.stateName}
                  onChange={(e) => setNewGeoForm({ ...newGeoForm, stateName: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
              )}
              {newGeoForm.type === 'ZONE' && (
                <input 
                  type="text" placeholder="Zone Name (e.g. Zone 4 - Coimbatore)"
                  value={newGeoForm.zoneName}
                  onChange={(e) => setNewGeoForm({ ...newGeoForm, zoneName: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
              )}
              {newGeoForm.type === 'DISTRICT' && (
                <input 
                  type="text" placeholder="District Name (e.g. Paramakudi)"
                  value={newGeoForm.districtName}
                  onChange={(e) => setNewGeoForm({ ...newGeoForm, districtName: e.target.value })}
                  style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowCreateGeoModal(false)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Add Geography</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE DOWNGRADE USER */}
      {showCreateUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#111c44', border: '1px solid #1e295d', borderRadius: 14, width: '100%', maxWidth: 460, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Create Downgrade User</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>You can only create roles below your level ({currentUser.role}).</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newUserForm.fullName || !newUserForm.username) return;
              const hierarchyMap = { 'ADMIN': 2, 'ZONAL_MANAGER': 3, 'SHOP_OWNER': 4, 'INDEPENDENT_OWNER': 4, 'STYLIST': 5 };
              const level = hierarchyMap[newUserForm.role] || 4;
              const u = {
                username: newUserForm.username.toLowerCase(),
                label: `${newUserForm.fullName} (${newUserForm.role})`,
                role: newUserForm.role,
                type: newUserForm.role === 'STYLIST' ? 'STYLIST' : (newUserForm.role.includes('OWNER') ? 'OWNER' : 'MANAGEMENT'),
                name: newUserForm.fullName,
                jurisdiction: newUserForm.territoryZone,
                hierarchyLevel: level
              };
              setUsersList([...usersList, u]);
              setShowCreateUserModal(false);
              showToast(`User "${u.name}" provisioned as Level ${u.hierarchyLevel}!`);
            }} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input 
                type="text" placeholder="Full Name"
                value={newUserForm.fullName}
                onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
              />
              <input 
                type="text" placeholder="Username"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
              />
              <select 
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                style={{ padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 12 }}
              >
                {currentUser.hierarchyLevel === 1 && <option value="ADMIN">State Admin (Level 2)</option>}
                {currentUser.hierarchyLevel <= 2 && <option value="ZONAL_MANAGER">Zonal Manager (Level 3)</option>}
                {currentUser.hierarchyLevel <= 3 && (
                  <>
                    <option value="SHOP_OWNER">Salon Shop Owner (Level 4)</option>
                    <option value="INDEPENDENT_OWNER">Independent Owner (Level 4)</option>
                  </>
                )}
                <option value="STYLIST">Stylist / Barber (Level 5)</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowCreateUserModal(false)} style={{ background: '#1f2937', color: '#cbd5e1', padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#8b5cf6', color: '#fff', padding: '8px 16px', borderRadius: 6, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Provision User</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
