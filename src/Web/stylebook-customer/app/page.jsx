'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Scissors, Star, Calendar, Clock, ShieldCheck, 
  Sparkles, CheckCircle2, ChevronRight, User, Heart, Tag, 
  Smartphone, Filter, X, ArrowRight, MessageSquare, ChevronDown, 
  FileText, History, HelpCircle, Phone, Info, LogOut, Lock, 
  AlertTriangle, UserCheck, ChevronLeft, Award, ThumbsUp, Check, 
  MessageCircle, Building, Briefcase, Mail
} from 'lucide-react';

// ==========================================
// 1. MASTER DATA: TAMIL NADU / RAMANATHAPURAM HIERARCHY
// ==========================================

const TAMILNADU_SALONS = [
  {
    id: 'aaaa1111-aaaa-1111-aaaa-111111111111',
    name: 'Royal Classic Unisex Salon & Spa',
    brand: 'Royal Classic',
    type: 'Multi-Branch Salon (Ramnad & Puduvalasai)',
    country: 'India',
    state: 'Tamil Nadu',
    zone: 'South Zone',
    district: 'Ramanathapuram',
    localities: ['Ramnad Town', 'Puduvalasai'],
    rating: 4.90,
    reviewsCount: 86,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    doorstepAvailable: true,
    doorstepRadius: '12 km radius (Puduvalasai & Ramnad)',
    trending: true,
    poc: {
      name: 'Anwar Hussain',
      role: 'Chief Operator & Owner',
      phone: '+91 94431 88990',
      email: 'poc.ramnad@royalclassic.in'
    },
    branches: [
      { 
        id: 'b1', 
        name: 'Royal Classic - Ramnad Town Branch', 
        brand: 'Royal Classic',
        country: 'India',
        state: 'Tamil Nadu',
        zone: 'South Zone',
        district: 'Ramanathapuram',
        locality: 'Ramnad Town', 
        address: 'Opposite Bus Stand, Vandikkara Street, Ramnad Town',
        rating: 4.92,
        reviewsCount: 54,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        poc: { name: 'Senthil Nathan', role: 'Site Operations Head (Manager POC)', phone: '+91 94431 77111', email: 'poc.town@royalclassic.in' },
        serviceIds: [1, 2, 3, 4, 5],
        stylistIds: ['s1', 's4']
      },
      { 
        id: 'b2', 
        name: 'Royal Classic - Puduvalasai Branch', 
        brand: 'Royal Classic',
        country: 'India',
        state: 'Tamil Nadu',
        zone: 'South Zone',
        district: 'Ramanathapuram',
        locality: 'Puduvalasai', 
        address: 'East Coast Road Junction, Near Post Office, Puduvalasai',
        rating: 4.88,
        reviewsCount: 32,
        image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
        poc: { name: 'Ilyas Raja', role: 'Branch In-Charge (Manager POC)', phone: '+91 94431 77222', email: 'poc.puduvalasai@royalclassic.in' },
        serviceIds: [1, 2, 3, 5],
        stylistIds: ['s1']
      }
    ],
    services: [
      { id: 1, category: 'Hair Care', name: 'Royal Precision Haircut & Wash', duration: '25-30 min', price: 200, isNegotiable: false, minFloorPrice: 180, description: 'Master scissors cut, scalp wash, conditioning & blow dry style' },
      { id: 2, category: 'Hair Care', name: 'Herbal Hair Spa & Dandruff Care', duration: '40-45 min', price: 700, isNegotiable: true, minPrice: 550, minFloorPrice: 500, description: 'Organic herbal deep nourishment pack with soothing steam' },
      { id: 3, category: 'Shave & Beard', name: 'Royal Hot Towel Shave', duration: '20-25 min', price: 150, isNegotiable: false, minFloorPrice: 120, description: 'Pre-shave eucalyptus oil, warm towel wrap & smooth razor glide' },
      { id: 4, category: 'Shave & Beard', name: 'Beard Shape & Designer Trim', duration: '20 min', price: 120, isNegotiable: false, minFloorPrice: 100, description: 'Precision razor edging, mustache trim & beard oil finish' },
      { id: 5, category: 'Facial & Glow', name: 'Kesar Gold Glow Facial', duration: '45 min', price: 850, isNegotiable: true, minPrice: 700, minFloorPrice: 650, description: 'Gold foil radiance serum, deep pore massage & brightening pack' }
    ]
  },
  {
    id: 'bbbb2222-bbbb-2222-bbbb-222222222222',
    name: 'Kavitha Doorstep Bridal & Beauty Care',
    brand: 'Kavitha Beauty Studio',
    type: 'Independent Professional (Doorstep Specialist)',
    country: 'India',
    state: 'Tamil Nadu',
    zone: 'South Zone',
    district: 'Ramanathapuram',
    localities: ['Panaikulam', 'Puduvalasai', 'Sakkarakottai'],
    rating: 4.95,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    doorstepAvailable: true,
    doorstepRadius: '15 km radius (Panaikulam, Sakkarakottai, Puduvalasai)',
    trending: true,
    poc: {
      name: 'Kavitha Praveen',
      role: 'Lead Beautician & Site POC',
      phone: '+91 94431 88991',
      email: 'kavitha.beauty@gmail.com'
    },
    branches: [
      { 
        id: 'b3', 
        name: 'Kavitha Doorstep Studio', 
        brand: 'Kavitha Beauty Studio',
        country: 'India',
        state: 'Tamil Nadu',
        zone: 'South Zone',
        district: 'Ramanathapuram',
        locality: 'Panaikulam', 
        address: 'Doorstep Mobile Service, Covering Panaikulam, Sakkarakottai & Ramnad',
        rating: 4.95,
        reviewsCount: 52,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        poc: { name: 'Kavitha Praveen', role: 'Lead Beautician & Site POC', phone: '+91 94431 88991', email: 'kavitha.beauty@gmail.com' },
        serviceIds: [6, 7, 8],
        stylistIds: ['s2']
      }
    ],
    services: [
      { id: 6, category: 'Bridal', name: 'Traditional South Bridal Makeover', duration: '90 min', price: 2800, isNegotiable: true, minPrice: 2200, minFloorPrice: 2000, description: 'HD bridal foundation, saree draping, floral hair design & waterproof glow' },
      { id: 7, category: 'Facial & Glow', name: 'Ayurvedic Skin Brightening Facial', duration: '45 min', price: 800, isNegotiable: true, minPrice: 650, minFloorPrice: 600, description: 'Sandalwood & turmeric rejuvenation for natural skin luminance' },
      { id: 8, category: 'Head Massage', name: 'Brahmi Warm Oil Scalp Treatment', duration: '30 min', price: 350, isNegotiable: false, minFloorPrice: 300, description: 'Traditional herbal head and neck acupressure for stress relief' }
    ]
  },
  {
    id: 'cccc3333-cccc-3333-cccc-333333333333',
    name: 'Sakkarakottai Heritage Salon & Spa',
    brand: 'Sakkarakottai Heritage',
    type: 'Physical Salon Shop',
    country: 'India',
    state: 'Tamil Nadu',
    zone: 'South Zone',
    district: 'Ramanathapuram',
    localities: ['Sakkarakottai'],
    rating: 4.80,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    doorstepAvailable: false,
    doorstepRadius: 'In-Salon Only',
    trending: false,
    poc: {
      name: 'Saravanan Natarajan',
      role: 'Store Manager & POC',
      phone: '+91 94431 88992',
      email: 'saravanan.sakkarakottai@gmail.com'
    },
    branches: [
      { 
        id: 'b4', 
        name: 'Sakkarakottai Main Branch', 
        brand: 'Sakkarakottai Heritage',
        country: 'India',
        state: 'Tamil Nadu',
        zone: 'South Zone',
        district: 'Ramanathapuram',
        locality: 'Sakkarakottai', 
        address: 'Main Bazar Road, Near Govt Higher Secondary School, Sakkarakottai',
        rating: 4.80,
        reviewsCount: 24,
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
        poc: { name: 'Saravanan Natarajan', role: 'Store Manager & POC', phone: '+91 94431 88992', email: 'saravanan.sakkarakottai@gmail.com' },
        serviceIds: [9, 10],
        stylistIds: ['s3']
      }
    ],
    services: [
      { id: 9, category: 'Hair Care', name: 'Traditional Scissors Haircut', duration: '30 min', price: 180, isNegotiable: false, minFloorPrice: 150, description: 'Classic scissor cut with hot towel neck trim and powder finish' },
      { id: 10, category: 'Head Massage', name: 'Ayurvedic Head & Shoulder Massage', duration: '30 min', price: 400, isNegotiable: true, minPrice: 320, minFloorPrice: 300, description: 'Full tension release with warm herbal oils and shoulder stretch' }
    ]
  }
];

// Flat catalog of all services across salons
const ALL_SERVICES_CATALOG = [
  { id: 1, category: 'Hair Care', name: 'Royal Precision Haircut & Wash', duration: '25-30 min', price: 200, minFloorPrice: 180, salonName: 'Royal Classic', isNegotiable: false, doorstep: true },
  { id: 2, category: 'Hair Care', name: 'Herbal Hair Spa & Dandruff Care', duration: '40-45 min', price: 700, minFloorPrice: 500, salonName: 'Royal Classic', isNegotiable: true, minPrice: 550, doorstep: false },
  { id: 3, category: 'Shave & Beard', name: 'Royal Hot Towel Shave', duration: '20-25 min', price: 150, minFloorPrice: 120, salonName: 'Royal Classic', isNegotiable: false, doorstep: true },
  { id: 4, category: 'Shave & Beard', name: 'Beard Shape & Designer Trim', duration: '20 min', price: 120, minFloorPrice: 100, salonName: 'Royal Classic', isNegotiable: false, doorstep: true },
  { id: 5, category: 'Facial & Glow', name: 'Kesar Gold Glow Facial', duration: '45 min', price: 850, minFloorPrice: 650, salonName: 'Royal Classic', isNegotiable: true, minPrice: 700, doorstep: true },
  { id: 6, category: 'Bridal', name: 'Traditional South Bridal Makeover', duration: '90 min', price: 2800, minFloorPrice: 2000, salonName: 'Kavitha Doorstep', isNegotiable: true, minPrice: 2200, doorstep: true },
  { id: 7, category: 'Facial & Glow', name: 'Ayurvedic Skin Brightening Facial', duration: '45 min', price: 800, minFloorPrice: 600, salonName: 'Kavitha Doorstep', isNegotiable: true, minPrice: 650, doorstep: true },
  { id: 8, category: 'Head Massage', name: 'Brahmi Warm Oil Scalp Treatment', duration: '30 min', price: 350, minFloorPrice: 300, salonName: 'Kavitha Doorstep', isNegotiable: false, doorstep: true },
  { id: 9, category: 'Hair Care', name: 'Traditional Scissors Haircut', duration: '30 min', price: 180, minFloorPrice: 150, salonName: 'Sakkarakottai Heritage', isNegotiable: false, doorstep: false },
  { id: 10, category: 'Head Massage', name: 'Ayurvedic Head & Shoulder Massage', duration: '30 min', price: 400, minFloorPrice: 300, salonName: 'Sakkarakottai Heritage', isNegotiable: true, minPrice: 320, doorstep: false }
];

// Stylists with skill-sets (service capability) and branch assignments
const ALL_STYLISTS = [
  {
    id: 's1',
    name: 'Karthik Raja',
    role: 'Master Stylist & Barber',
    experience: '8 Years Exp',
    rating: 4.90,
    reviewsCount: 42,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    doorstepSupport: true,
    assignedBranchIds: ['b1', 'b2'],
    supportedServiceIds: [1, 2, 3, 4, 5],
    bio: 'Specialist in razor precision haircuts, fade sculpting and Ayurvedic scalp therapies. Certified by Toni & Guy Academy.'
  },
  {
    id: 's2',
    name: 'Kavitha Praveen',
    role: 'Lead Bridal Artist & Aesthetician',
    experience: '6 Years Exp',
    rating: 4.95,
    reviewsCount: 58,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    doorstepSupport: true,
    assignedBranchIds: ['b3'],
    supportedServiceIds: [6, 7, 8],
    bio: 'Renowned doorstep bridal makeover expert across Ramnad district. Known for long-lasting HD glow and floral coiffures.'
  },
  {
    id: 's3',
    name: 'Saravanan Natarajan',
    role: 'Senior Barber & Scalp Masseuse',
    experience: '12 Years Exp',
    rating: 4.80,
    reviewsCount: 28,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    doorstepSupport: false,
    assignedBranchIds: ['b4'],
    supportedServiceIds: [9, 10],
    bio: 'Heritage razor master specializing in traditional scissor haircuts, hot towel scalp therapy and acupressure massage.'
  },
  {
    id: 's4',
    name: 'Vignesh Kumar',
    role: 'Junior Stylist & Grooming Specialist',
    experience: '3 Years Exp',
    rating: 4.70,
    reviewsCount: 19,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    doorstepSupport: false,
    assignedBranchIds: ['b1'],
    supportedServiceIds: [1, 3, 4],
    bio: 'Modern trend specialist in youth hair shaping, beard lines and refreshing head washes.'
  }
];

// Initial Customer Reviews Data (Branch & Stylist reviews)
const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    bookingId: 'SB-RAMNAD-01',
    branchId: 'b1',
    branchRating: 5,
    branchComment: 'Impeccable hygiene, prompt slot start time, and very welcoming reception right in Ramnad Town.',
    stylistId: 's1',
    stylistRating: 5,
    stylistComment: 'Karthik did a splendid precision fade haircut. Truly knows how to work with hair texture!',
    customerName: 'Mohamed Irfan',
    date: '18 Oct 2026',
    ownerReply: 'Thank you Mohamed! We are glad you enjoyed your session with Karthik.',
    isModerated: true
  },
  {
    id: 'rev-2',
    bookingId: 'SB-RAMNAD-02',
    branchId: 'b3',
    branchRating: 5,
    branchComment: 'Doorstep service right on time in Panaikulam. Brought sanitized kits and high grade organic cosmetics.',
    stylistId: 's2',
    stylistRating: 5,
    stylistComment: 'Kavitha is an artist! The bridal glow lasted all through our family function. Highly recommended.',
    customerName: 'Fatima Zohra',
    date: '12 Oct 2026',
    ownerReply: 'It was our honor to be part of your special day, Fatima!',
    isModerated: true
  },
  {
    id: 'rev-3',
    bookingId: 'SB-RAMNAD-03',
    branchId: 'b4',
    branchRating: 4,
    branchComment: 'Classic salon ambiance in Sakkarakottai. Calm atmosphere with friendly neighborhood staff.',
    stylistId: 's3',
    stylistRating: 5,
    stylistComment: 'Saravanan gives the best head & shoulder massage in Ramanathapuram. Total stress relief.',
    customerName: 'Ramesh Krishnan',
    date: '02 Oct 2026',
    ownerReply: null,
    isModerated: true
  }
];

// Valid Promotional Coupons
const COUPONS = {
  'RAMNAD50': { type: 'FLAT', value: 50, desc: '₹50 Flat Discount on Ramanathapuram Bookings' },
  'FESTIVE15': { type: 'PERCENT', value: 15, desc: '15% Off on Doorstep & Facial Appointments' },
  'ROYAL100': { type: 'FLAT', value: 100, desc: '₹100 Off on Herbal Hair Spa at Royal Classic' }
};

export default function CustomerLandingPage() {
  // Navigation & Page State
  const [activeNav, setActiveNav] = useState('Home'); // Home, ContactUs, AboutUs
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Authentication State: Guest by default!
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // { type, payload }
  const [authForm, setAuthForm] = useState({ identifier: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Customer Profile (Loaded when logged in)
  const [customerUser, setCustomerUser] = useState({
    name: 'Mohamed Irfan',
    phone: '+91 99999 00006',
    email: 'mohamed.ramnad@gmail.com',
    locality: 'Ramnad Town'
  });

  // Active Interactive Smart Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All'); // All, Ramnad Town, Puduvalasai, Panaikulam, Sakkarakottai
  const [selectedCategory, setSelectedCategory] = useState('All'); // All, Hair Care, Shave & Beard, Facial & Glow, Bridal, Head Massage
  const [workTypeFilter, setWorkTypeFilter] = useState('ALL'); // ALL, IN_SALON, DOORSTEP
  const [priceFilter, setPriceFilter] = useState('ALL'); // ALL, UNDER_300, 300_1000, ABOVE_1000

  // Two Booking Entry Points State
  // Entry Point 1: Choose Branch Flow | Entry Point 2: Choose Stylist Flow
  const [bookingFlowMode, setBookingFlowMode] = useState('BRANCH'); // 'BRANCH' or 'STYLIST'
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null); // specific stylist or { id: 'ANY', name: 'Any Available Stylist (Owner Assigned)' }
  const [selectedService, setSelectedService] = useState(null);
  const [selectedWorkType, setSelectedWorkType] = useState('IN_SALON');
  const [selectedSlot, setSelectedSlot] = useState('02:00 PM - 02:30 PM');
  const [selectedDate, setSelectedDate] = useState('Today, 25 Oct 2026');
  const [doorstepAddress, setDoorstepAddress] = useState('14, East Coast Road, Puduvalasai');
  
  // Coupon & Easy Bargain State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [bargainPrice, setBargainPrice] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Review & Rating Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeBookingForReview, setActiveBookingForReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    branchRating: 5,
    branchComment: '',
    stylistRating: 5,
    stylistComment: ''
  });
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);

  // Detail Profile Modal (View Branch Profile or View Stylist Profile)
  const [viewingProfile, setViewingProfile] = useState(null); // { type: 'BRANCH' | 'STYLIST', data }

  // Customer Bookings List
  const [customerBookings, setCustomerBookings] = useState([
    {
      reference: 'SB-RAMNAD-01',
      salon: 'Royal Classic Unisex Salon & Spa',
      branchId: 'b1',
      branchName: 'Royal Classic - Ramnad Town Branch',
      stylistId: 's1',
      stylistName: 'Karthik Raja',
      service: 'Herbal Hair Spa & Dandruff Care',
      locality: 'Ramnad Town',
      date: 'Today, 25 Oct 2026',
      slot: '02:00 PM - 02:45 PM',
      workType: 'IN_SALON',
      amount: 600,
      status: 'Confirmed', // Confirmed, Completed, Cancelled
      otp: '482910',
      assignedBy: 'Stylist Direct',
      hasReviewed: false
    },
    {
      reference: 'SB-RAMNAD-99',
      salon: 'Sakkarakottai Heritage Salon & Spa',
      branchId: 'b4',
      branchName: 'Sakkarakottai Main Branch',
      stylistId: 's3',
      stylistName: 'Saravanan Natarajan',
      service: 'Traditional Scissors Haircut',
      locality: 'Sakkarakottai',
      date: '18 Oct 2026',
      slot: '11:00 AM - 11:30 AM',
      workType: 'IN_SALON',
      amount: 180,
      status: 'Completed',
      otp: '918234',
      assignedBy: 'Owner Assignment',
      hasReviewed: true,
      branchRating: 4,
      stylistRating: 5
    }
  ]);

  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Dynamic available time slots
  const availableSlots = [
    { time: '10:00 AM - 10:30 AM', status: 'Available' },
    { time: '11:30 AM - 12:00 PM', status: 'Available' },
    { time: '01:00 PM - 02:00 PM', status: 'Staff Lunch Break (Blocked)' },
    { time: '02:00 PM - 02:30 PM', status: 'Available' },
    { time: '03:30 PM - 04:00 PM', status: 'Available' },
    { time: '05:00 PM - 05:30 PM', status: 'Available' }
  ];

  // ==========================================
  // SMART GLOBAL SEARCH & COMBINED FILTERS
  // ==========================================
  const filteredSalons = useMemo(() => {
    return TAMILNADU_SALONS.filter(salon => {
      // Locality Filter
      if (selectedLocality !== 'All' && !salon.localities.includes(selectedLocality)) {
        return false;
      }
      // Category Filter
      if (selectedCategory !== 'All' && !salon.services.some(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()))) {
        return false;
      }
      // Work Type Filter
      if (workTypeFilter === 'DOORSTEP' && !salon.doorstepAvailable) {
        return false;
      }
      // Smart Global Search Box Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchBrand = salon.brand.toLowerCase().includes(q);
        const matchSalonName = salon.name.toLowerCase().includes(q);
        const matchLocality = salon.localities.some(l => l.toLowerCase().includes(q));
        const matchDistrict = salon.district.toLowerCase().includes(q);
        const matchState = salon.state.toLowerCase().includes(q);
        const matchZone = salon.zone.toLowerCase().includes(q);
        const matchCountry = salon.country.toLowerCase().includes(q);
        const matchBranch = salon.branches.some(b => b.name.toLowerCase().includes(q) || b.locality.toLowerCase().includes(q));
        const matchService = salon.services.some(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
        const matchStylist = ALL_STYLISTS.some(st => 
          st.assignedBranchIds.some(bid => salon.branches.some(b => b.id === bid)) && 
          st.name.toLowerCase().includes(q)
        );

        if (!matchBrand && !matchSalonName && !matchLocality && !matchDistrict && !matchState && !matchZone && !matchCountry && !matchBranch && !matchService && !matchStylist) {
          return false;
        }
      }
      // Price Range Filter
      if (priceFilter === 'UNDER_300' && !salon.services.some(s => s.price <= 300)) return false;
      if (priceFilter === '300_1000' && !salon.services.some(s => s.price > 300 && s.price <= 1000)) return false;
      if (priceFilter === 'ABOVE_1000' && !salon.services.some(s => s.price > 1000)) return false;

      return true;
    });
  }, [searchQuery, selectedLocality, selectedCategory, workTypeFilter, priceFilter]);

  // Filtered Stylists for Stylist Carousel / Search
  const filteredStylists = useMemo(() => {
    return ALL_STYLISTS.filter(stylist => {
      if (workTypeFilter === 'DOORSTEP' && !stylist.doorstepSupport) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = stylist.name.toLowerCase().includes(q);
        const matchRole = stylist.role.toLowerCase().includes(q);
        const matchServices = ALL_SERVICES_CATALOG.some(sc => stylist.supportedServiceIds.includes(sc.id) && (sc.name.toLowerCase().includes(q) || sc.category.toLowerCase().includes(q)));
        if (!matchName && !matchRole && !matchServices) return false;
      }
      return true;
    });
  }, [searchQuery, workTypeFilter]);

  // Action Gate: Require login for booking or customer records
  const requireLoginForAction = (actionType, payload = null, reasonText = '') => {
    if (!isLoggedIn) {
      setAuthReason(reasonText || 'Please log in to your Customer account to proceed with this action.');
      setPendingAction({ type: actionType, payload });
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // Perform Customer Login
  const handleCustomerLogin = (e) => {
    if (e) e.preventDefault();
    if (!authForm.identifier.trim()) {
      setAuthError('Please enter your phone number or email.');
      return;
    }
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setAuthError('');
    showToast(`Welcome back, ${customerUser.name}! Signed in successfully.`);

    if (pendingAction) {
      if (pendingAction.type === 'START_BRANCH_BOOKING') {
        openBranchBooking(pendingAction.payload.branch, pendingAction.payload.service);
      } else if (pendingAction.type === 'START_STYLIST_BOOKING') {
        openStylistBooking(pendingAction.payload.stylist, pendingAction.payload.service);
      } else if (pendingAction.type === 'VIEW_BOOKINGS') {
        setShowMyBookings(true);
      } else if (pendingAction.type === 'VIEW_HISTORY') {
        setShowHistory(true);
      } else if (pendingAction.type === 'VIEW_REPORTS') {
        setShowReports(true);
      }
      setPendingAction(null);
    }
  };

  const handleQuickDemoLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setAuthError('');
    showToast('Signed in via Dev Quick-Login as Mohamed Irfan (Customer)');

    if (pendingAction) {
      if (pendingAction.type === 'START_BRANCH_BOOKING') {
        openBranchBooking(pendingAction.payload.branch, pendingAction.payload.service);
      } else if (pendingAction.type === 'START_STYLIST_BOOKING') {
        openStylistBooking(pendingAction.payload.stylist, pendingAction.payload.service);
      } else if (pendingAction.type === 'VIEW_BOOKINGS') {
        setShowMyBookings(true);
      } else if (pendingAction.type === 'VIEW_HISTORY') {
        setShowHistory(true);
      } else if (pendingAction.type === 'VIEW_REPORTS') {
        setShowReports(true);
      }
      setPendingAction(null);
    }
  };

  const handleCustomerLogout = () => {
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    setShowMyBookings(false);
    setShowHistory(false);
    setShowReports(false);
    setBookingModalOpen(false);
    showToast('Logged out. You are now browsing in Guest Mode.');
  };

  // ==========================================
  // ENTRY POINT 1: CHOOSE A BRANCH
  // ==========================================
  const openBranchBooking = (branch, preselectedService = null) => {
    if (!requireLoginForAction('START_BRANCH_BOOKING', { branch, service: preselectedService }, `Sign in required to reserve an appointment slot at ${branch.name}.`)) {
      return;
    }

    const parentSalon = TAMILNADU_SALONS.find(s => s.branches.some(b => b.id === branch.id)) || TAMILNADU_SALONS[0];
    const branchServices = parentSalon.services.filter(s => branch.serviceIds ? branch.serviceIds.includes(s.id) : true);
    
    setBookingFlowMode('BRANCH');
    setSelectedSalon(parentSalon);
    setSelectedBranch(branch);
    setSelectedStylist({ id: 'ANY', name: 'Any Available Stylist (Owner Assigned)' });
    setSelectedService(preselectedService || branchServices[0]);
    setSelectedWorkType('IN_SALON');
    setCouponInput('');
    setAppliedCoupon(null);
    setCouponError('');
    setBargainPrice('');
    setBookingConfirmed(null);
    setBookingModalOpen(true);
  };

  // ==========================================
  // ENTRY POINT 2: CHOOSE A STYLIST
  // ==========================================
  const openStylistBooking = (stylist, preselectedService = null) => {
    if (!requireLoginForAction('START_STYLIST_BOOKING', { stylist, service: preselectedService }, `Sign in required to book personal stylist ${stylist.name}.`)) {
      return;
    }

    // Find eligible branches where this stylist works
    const eligibleBranches = [];
    TAMILNADU_SALONS.forEach(s => {
      s.branches.forEach(b => {
        if (stylist.assignedBranchIds.includes(b.id)) {
          eligibleBranches.push({ ...b, parentSalon: s });
        }
      });
    });

    const chosenBranch = eligibleBranches[0] || null;
    const parentSalon = chosenBranch ? chosenBranch.parentSalon : TAMILNADU_SALONS[0];
    const supportedServices = parentSalon.services.filter(s => stylist.supportedServiceIds.includes(s.id));

    setBookingFlowMode('STYLIST');
    setSelectedStylist(stylist);
    setSelectedSalon(parentSalon);
    setSelectedBranch(chosenBranch);
    setSelectedService(preselectedService || supportedServices[0] || parentSalon.services[0]);
    setSelectedWorkType(stylist.doorstepSupport ? 'IN_SALON' : 'IN_SALON');
    setCouponInput('');
    setAppliedCoupon(null);
    setCouponError('');
    setBargainPrice('');
    setBookingConfirmed(null);
    setBookingModalOpen(true);
  };

  // Coupon Engine
  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError('');
      showToast(`Coupon ${code} applied successfully!`);
    } else {
      setCouponError('Invalid Coupon Code. Try RAMNAD50 or FESTIVE15');
      setAppliedCoupon(null);
    }
  };

  // Price Calculation
  const basePrice = selectedService ? (bargainPrice && selectedService.isNegotiable ? Number(bargainPrice) : selectedService.price) : 0;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'FLAT') {
      discountAmount = appliedCoupon.value;
    } else if (appliedCoupon.type === 'PERCENT') {
      discountAmount = Math.round((basePrice * appliedCoupon.value) / 100);
    }
  }
  const netPayable = Math.max(0, basePrice - discountAmount);

  // Confirm Booking & Generate 6-Digit Check-in OTP
  const handleConfirmBooking = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newRef = `SB-RAMNAD-${Math.floor(10 + Math.random() * 90)}`;
    const isAnyStylist = !selectedStylist || selectedStylist.id === 'ANY';
    const confirmationType = isAnyStylist ? 'Owner Assignment Pending' : 'Direct Stylist Confirmation';

    const newBooking = {
      reference: newRef,
      salon: selectedSalon ? selectedSalon.name : 'StyleBook Salon',
      branchId: selectedBranch ? selectedBranch.id : 'b1',
      branchName: selectedBranch ? selectedBranch.name : 'Main Branch',
      stylistId: isAnyStylist ? null : selectedStylist.id,
      stylistName: isAnyStylist ? 'Any Stylist (Owner will assign)' : selectedStylist.name,
      service: selectedService ? selectedService.name : 'Grooming Service',
      locality: selectedBranch ? selectedBranch.locality : selectedLocality,
      date: selectedDate,
      slot: selectedSlot,
      workType: selectedWorkType,
      amount: netPayable,
      couponApplied: appliedCoupon ? appliedCoupon.code : null,
      status: 'Confirmed',
      otp: generatedOtp,
      assignedBy: confirmationType,
      branchPoc: selectedBranch ? selectedBranch.poc : (selectedSalon ? selectedSalon.poc : null),
      hasReviewed: false
    };

    setCustomerBookings([newBooking, ...customerBookings]);
    setBookingConfirmed({
      reference: newRef,
      otp: generatedOtp,
      salon: newBooking.salon,
      branchName: newBooking.branchName,
      stylistName: newBooking.stylistName,
      service: newBooking.service,
      slot: selectedSlot,
      date: selectedDate,
      amount: netPayable,
      workType: selectedWorkType,
      confirmationType,
      branchPoc: newBooking.branchPoc
    });
  };

  // ==========================================
  // DUAL REVIEW & RATING SUBMISSION
  // ==========================================
  const handleOpenReviewModal = (booking) => {
    setActiveBookingForReview(booking);
    setReviewForm({
      branchRating: 5,
      branchComment: '',
      stylistRating: 5,
      stylistComment: ''
    });
    setReviewModalOpen(true);
  };

  const handleSubmitDualReview = (e) => {
    if (e) e.preventDefault();
    if (!activeBookingForReview) return;

    if (!reviewForm.branchComment.trim() || !reviewForm.stylistComment.trim()) {
      alert('Please provide written comments for both the salon branch and your stylist.');
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      bookingId: activeBookingForReview.reference,
      branchId: activeBookingForReview.branchId,
      branchRating: Number(reviewForm.branchRating),
      branchComment: reviewForm.branchComment,
      stylistId: activeBookingForReview.stylistId || 's1',
      stylistRating: Number(reviewForm.stylistRating),
      stylistComment: reviewForm.stylistComment,
      customerName: customerUser.name,
      date: 'Today, 25 Oct 2026',
      ownerReply: 'Thank you for your valuable feedback! We look forward to serving you again.',
      isModerated: true
    };

    // Update reviews list
    setReviewsList([newReview, ...reviewsList]);

    // Mark booking as reviewed
    setCustomerBookings(customerBookings.map(b => 
      b.reference === activeBookingForReview.reference 
        ? { ...b, hasReviewed: true, branchRating: reviewForm.branchRating, stylistRating: reviewForm.stylistRating }
        : b
    ));

    setReviewModalOpen(false);
    setActiveBookingForReview(null);
    showToast('Dual review published! Thank you for rating the Branch and Stylist.');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{
          position: 'fixed', top: 20, right: 20, background: '#10b981', color: '#ffffff',
          padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 99999, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 13
        }}>
          <Sparkles size={18} />
          {notificationMsg}
        </div>
      )}

      {/* 1. TOP MENU (Logo, Home, Contact Us, About Us, Login / Profile Dropdown) */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo & Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setActiveNav('Home')}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scissors size={20} color="#fff" />
              </div>
              <div>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>StyleBook</span>
                <span style={{ display: 'block', fontSize: 10, color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tamil Nadu • Ramanathapuram</span>
              </div>
            </div>

            {/* Top Menu Links */}
            <nav style={{ display: 'flex', gap: 24, fontSize: 14, fontWeight: 700 }}>
              <button 
                onClick={() => setActiveNav('Home')}
                style={{ background: 'transparent', color: activeNav === 'Home' ? '#2563eb' : '#475569', borderBottom: activeNav === 'Home' ? '2px solid #2563eb' : 'none', paddingBottom: 4, borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveNav('ContactUs')}
                style={{ background: 'transparent', color: activeNav === 'ContactUs' ? '#2563eb' : '#475569', borderBottom: activeNav === 'ContactUs' ? '2px solid #2563eb' : 'none', paddingBottom: 4, borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
              >
                Contact Us / POC Directory
              </button>
              <button 
                onClick={() => setActiveNav('AboutUs')}
                style={{ background: 'transparent', color: activeNav === 'AboutUs' ? '#2563eb' : '#475569', borderBottom: activeNav === 'AboutUs' ? '2px solid #2563eb' : 'none', paddingBottom: 4, borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
              >
                About Us & Coverage
              </button>
            </nav>
          </div>

          {/* Right Section: Guest Sign In OR Logged In Profile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            
            {!isLoggedIn ? (
              // GUEST VIEW: Sign In / Register Button
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: 12, fontWeight: 600 }}>
                  👤 Guest Mode
                </span>
                <button 
                  onClick={() => { setAuthReason('Sign in to access appointment booking, coupons, ratings, and customer history.'); setShowAuthModal(true); }}
                  style={{ background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none' }}
                >
                  <User size={15} /> Sign In / Register
                </button>
              </div>
            ) : (
              // AUTHENTICATED CUSTOMER VIEW: Profile Dropdown
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 24, cursor: 'pointer' }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {customerUser.name.charAt(0)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>{customerUser.name}</span>
                    <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>{customerUser.locality} (Customer)</span>
                  </div>
                  <ChevronDown size={14} color="#1e40af" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 48, width: 230, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '8px 0', zIndex: 2000 }}>
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: 13, fontWeight: 700 }}>{customerUser.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b' }}>{customerUser.phone}</p>
                    </div>

                    <button 
                      onClick={() => { setShowMyBookings(true); setProfileDropdownOpen(false); }}
                      style={{ width: '100%', padding: '10px 16px', background: 'transparent', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', border: 'none', cursor: 'pointer' }}
                    >
                      <Calendar size={16} color="#2563eb" /> My Bookings
                      <span style={{ marginLeft: 'auto', background: '#dbeafe', color: '#1d4ed8', fontSize: 11, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>
                        {customerBookings.filter(b => b.status === 'Confirmed').length}
                      </span>
                    </button>

                    <button 
                      onClick={() => { setShowHistory(true); setProfileDropdownOpen(false); }}
                      style={{ width: '100%', padding: '10px 16px', background: 'transparent', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', border: 'none', cursor: 'pointer' }}
                    >
                      <History size={16} color="#7c3aed" /> My History & Reviews
                    </button>

                    <button 
                      onClick={() => { setShowReports(true); setProfileDropdownOpen(false); }}
                      style={{ width: '100%', padding: '10px 16px', background: 'transparent', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', border: 'none', cursor: 'pointer' }}
                    >
                      <FileText size={16} color="#059669" /> Reports & Invoices
                    </button>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 4, paddingTop: 4 }}>
                      <button 
                        onClick={handleCustomerLogout}
                        style={{ width: '100%', padding: '10px 16px', background: 'transparent', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#ef4444', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                      >
                        <LogOut size={16} color="#ef4444" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </header>

      {/* COMPLIANCE & NOTICES BANNER (Targeted for CUSTOMER / Public) */}
      <div style={{ background: '#eff6ff', borderBottom: '1px solid #bfdbfe', padding: '10px 24px', fontSize: 12, color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <ShieldCheck size={16} color="#2563eb" />
        <span><strong>Zonal Compliance Notice:</strong> All partner salons in Ramanathapuram, Ramnad Town, Puduvalasai & Sakkarakottai follow 100% sanitized instruments and verified 6-digit OTP check-ins.</span>
      </div>

      {/* 2. ABOUT US VIEW */}
      {activeNav === 'AboutUs' && (
        <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 24px' }}>
          <div style={{ background: '#ffffff', borderRadius: 16, padding: 36, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900 }}>About StyleBook Tamil Nadu</h2>
            <p style={{ marginTop: 12, lineHeight: 1.7, color: '#475569' }}>
              StyleBook is Ramanathapuram's premier digital salon network and on-demand grooming platform. We empower physical salons, independent home beauticians, and doorstep stylists across <strong>Ramnad Town</strong>, <strong>Puduvalasai</strong>, <strong>Panaikulam</strong>, and <strong>Sakkarakottai</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 28 }}>
              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 800, color: '#2563eb' }}>Verified Local Salons</h4>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>All shops inspected and certified by regional zonal authorities.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 800, color: '#059669' }}>Doorstep Beauty Service</h4>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Certified beauticians visit your home in Puduvalasai, Panaikulam & Sakkarakottai.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 800, color: '#7c3aed' }}>6-Digit OTP Handshake</h4>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Fraud-proof arrival check-in sent to your phone via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTACT US & POC DIRECTORY VIEW */}
      {activeNav === 'ContactUs' && (
        <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 24px' }}>
          <div style={{ background: '#ffffff', borderRadius: 16, padding: 36, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900 }}>Customer Help Desk & POC Directory</h2>
            <p style={{ marginTop: 8, color: '#64748b' }}>
              Direct points of contact for Store Operations, Regional Administration, and Accounts across Ramanathapuram.
            </p>
            
            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {/* Manager POC */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Building size={20} color="#16a34a" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>Store Operations POC</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 8 }}>Senthil Nathan</h3>
                <p style={{ fontSize: 12, color: '#166534' }}>Ramnad Town & Puduvalasai Lead</p>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <span style={{ color: '#15803d', fontWeight: 700 }}><Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> +91 94431 77111</span>
                  <span style={{ color: '#15803d' }}><Mail size={12} style={{ display: 'inline', marginRight: 4 }} /> poc.town@royalclassic.in</span>
                </div>
              </div>

              {/* Admin POC */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Briefcase size={20} color="#2563eb" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>Territorial Admin POC</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 8 }}>M. Suresh Kumar</h3>
                <p style={{ fontSize: 12, color: '#1e40af' }}>District Grievance & Compliance</p>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <span style={{ color: '#1e40af', fontWeight: 700 }}><Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> +91 94431 88990</span>
                  <span style={{ color: '#1e40af' }}><Mail size={12} style={{ display: 'inline', marginRight: 4 }} /> admin.ramnad@stylebook.in</span>
                </div>
              </div>

              {/* Finance POC */}
              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag size={20} color="#7c3aed" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase' }}>Accounts & Billing POC</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 8 }}>R. Meenakshi</h3>
                <p style={{ fontSize: 12, color: '#6b21a8' }}>Refunds, Invoices & Coupon Desk</p>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <span style={{ color: '#6b21a8', fontWeight: 700 }}><Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> +91 94431 88994</span>
                  <span style={{ color: '#6b21a8' }}><Mail size={12} style={{ display: 'inline', marginRight: 4 }} /> finance.ramnad@stylebook.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HOME VIEW: HERO & SMART SEARCH */}
      {activeNav === 'Home' && (
        <>
          {/* Hero Banner */}
          <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)', color: '#ffffff', padding: '48px 24px' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto', textAlign: 'center' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Tamil Nadu Salon & Doorstep Grooming Network
              </span>
              <h1 style={{ fontSize: 36, fontWeight: 900, marginTop: 14, letterSpacing: -0.5 }}>
                Discover Verified Salons & Top Stylists in Ramanathapuram
              </h1>
              <p style={{ fontSize: 15, maxWidth: 720, margin: '12px auto 0', opacity: 0.9 }}>
                Two simple ways to book: <strong>Choose by Branch</strong> or <strong>Choose by Stylist</strong>. Real-time availability, floor-price protection, coupon discounts, and dual rating system.
              </p>

              {/* Guest Exploration Notice */}
              {!isLoggedIn && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, marginTop: 16, fontSize: 12 }}>
                  <Info size={14} color="#67e8f9" />
                  <span>Browsing as Guest. Explore branches, stylists and pricing freely. Sign in requested when confirming your slot.</span>
                </div>
              )}

              {/* 1. SMART GLOBAL SEARCH BOX */}
              <div style={{ maxWidth: 780, margin: '24px auto 0', background: '#ffffff', borderRadius: 14, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                <Search size={22} color="#2563eb" />
                <input 
                  type="text" 
                  placeholder="Global search by brand, salon/branch, stylist, town, service, or category (e.g. Royal, Karthik, Puduvalasai, Haircut, Bridal)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', color: '#0f172a', fontSize: 14, padding: '8px 0', fontWeight: 600 }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={18} color="#64748b" />
                  </button>
                )}
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '6px 12px', borderRadius: 8 }}>
                  Smart Search
                </span>
              </div>
            </div>
          </section>

          {/* COMBINED INTERACTIVE FILTER BAR */}
          <section style={{ maxWidth: 1240, margin: '-24px auto 20px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Locality Selector Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} color="#2563eb" /> LOCALITY:
                </span>
                {['All', 'Ramnad Town', 'Puduvalasai', 'Panaikulam', 'Sakkarakottai'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocality(loc)}
                    style={{
                      background: selectedLocality === loc ? '#2563eb' : '#f1f5f9',
                      color: selectedLocality === loc ? '#ffffff' : '#334155',
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {loc === 'All' ? '📍 All Localities' : loc}
                  </button>
                ))}
              </div>

              {/* Service Category Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Scissors size={14} color="#2563eb" /> CATEGORY:
                </span>
                {['All', 'Hair Care', 'Shave & Beard', 'Facial & Glow', 'Bridal', 'Head Massage'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ 
                      background: selectedCategory === cat ? '#2563eb' : '#f1f5f9', 
                      color: selectedCategory === cat ? '#ffffff' : '#334155',
                      padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      border: 'none', cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Work Type & Price Filters */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* Work Type Toggle */}
                <div style={{ display: 'flex', background: '#f1f5f9', padding: 3, borderRadius: 20 }}>
                  <button 
                    onClick={() => setWorkTypeFilter('ALL')}
                    style={{ padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: workTypeFilter === 'ALL' ? '#ffffff' : 'transparent', color: workTypeFilter === 'ALL' ? '#2563eb' : '#64748b', border: 'none', cursor: 'pointer' }}
                  >
                    All Services
                  </button>
                  <button 
                    onClick={() => setWorkTypeFilter('IN_SALON')}
                    style={{ padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: workTypeFilter === 'IN_SALON' ? '#2563eb' : 'transparent', color: workTypeFilter === 'IN_SALON' ? '#ffffff' : '#64748b', border: 'none', cursor: 'pointer' }}
                  >
                    In-Salon Only
                  </button>
                  <button 
                    onClick={() => setWorkTypeFilter('DOORSTEP')}
                    style={{ padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: workTypeFilter === 'DOORSTEP' ? '#2563eb' : 'transparent', color: workTypeFilter === 'DOORSTEP' ? '#ffffff' : '#64748b', border: 'none', cursor: 'pointer' }}
                  >
                    🏡 Doorstep / Home
                  </button>
                </div>

                {/* Price Filter */}
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700, color: '#334155' }}
                >
                  <option value="ALL">Any Budget</option>
                  <option value="UNDER_300">Under ₹300</option>
                  <option value="300_1000">₹300 - ₹1,000</option>
                  <option value="ABOVE_1000">Above ₹1,000</option>
                </select>
              </div>

            </div>
          </section>

          {/* PROMOTIONAL COUPONS BANNER */}
          <section style={{ maxWidth: 1240, margin: '20px auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ background: '#b45309', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>DISTRICT PROMO</span>
                  <h4 style={{ fontSize: 15, fontWeight: 800, marginTop: 4 }}>Flat ₹50 OFF across Ramanathapuram</h4>
                  <p style={{ fontSize: 12, color: '#78350f', marginTop: 2 }}>Valid in Ramnad Town, Puduvalasai & Sakkarakottai.</p>
                </div>
                <button 
                  onClick={() => { setCouponInput('RAMNAD50'); showToast('Coupon RAMNAD50 copied! Ready to use on checkout.'); }}
                  style={{ background: '#d97706', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  RAMNAD50
                </button>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>DOORSTEP GLOW</span>
                  <h4 style={{ fontSize: 15, fontWeight: 800, marginTop: 4 }}>15% OFF on Doorstep Makeovers</h4>
                  <p style={{ fontSize: 12, color: '#065f46', marginTop: 2 }}>Use promo code FESTIVE15 for home bridal & facials.</p>
                </div>
                <button 
                  onClick={() => { setCouponInput('FESTIVE15'); showToast('Coupon FESTIVE15 copied! Ready to use on checkout.'); }}
                  style={{ background: '#059669', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  FESTIVE15
                </button>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 2. DYNAMIC DISCOVERY SECTIONS: HORIZONTALLY SCROLLABLE   */}
          {/* ======================================================== */}
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>
            
            {/* 1. TOP-RATED BRANCHES (ENTRY POINT 1: CHOOSE A BRANCH) */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 0.5 }}>Entry Point 1</span>
                  <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 2 }}>🏢 Top-Rated Salon Branches</h2>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Select a branch to explore only its offered services and assign stylists</p>
                </div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Scroll horizontally &rarr;</span>
              </div>

              <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 12, scrollSnapType: 'x mandatory' }}>
                {filteredSalons.flatMap(s => s.branches).map(branch => (
                  <div 
                    key={branch.id}
                    style={{ minWidth: 320, maxWidth: 320, background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ height: 150, position: 'relative' }}>
                      <img src={branch.image} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" /> {branch.rating} ({branch.reviewsCount})
                      </div>
                      <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(37,99,235,0.9)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {branch.locality}
                      </div>
                    </div>

                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{branch.name}</h4>
                      <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{branch.address}</p>
                      
                      <div style={{ marginTop: 10, padding: '6px 10px', background: '#f8fafc', borderRadius: 6, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#475569' }}>Services: <strong>{branch.serviceIds.length}</strong></span>
                        <span style={{ color: '#475569' }}>Stylists: <strong>{branch.stylistIds.length}</strong></span>
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                        <button
                          onClick={() => openBranchBooking(branch)}
                          style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                        >
                          Book at this Branch &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. TOP-RATED STYLISTS (ENTRY POINT 2: CHOOSE A STYLIST) */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 0.5 }}>Entry Point 2</span>
                  <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 2 }}>✂️ Top-Rated Stylists & Beauticians</h2>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Select a stylist directly to view their certified skills and eligible branch studios</p>
                </div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Scroll horizontally &rarr;</span>
              </div>

              <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 12, scrollSnapType: 'x mandatory' }}>
                {filteredStylists.map(stylist => (
                  <div 
                    key={stylist.id}
                    style={{ minWidth: 280, maxWidth: 280, background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img src={stylist.avatar} alt={stylist.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #7c3aed' }} />
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 800 }}>{stylist.name}</h4>
                        <p style={{ fontSize: 11, color: '#64748b' }}>{stylist.role}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, fontWeight: 700, color: '#d97706' }}>
                          <Star size={13} fill="#d97706" color="#d97706" /> {stylist.rating} ({stylist.reviewsCount} reviews)
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: 11, color: '#475569', marginTop: 12, lineHeight: 1.4, flex: 1 }}>{stylist.bio}</p>

                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {stylist.doorstepSupport && (
                        <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          🏡 Doorstep
                        </span>
                      )}
                      <span style={{ background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                        {stylist.experience}
                      </span>
                    </div>

                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => openStylistBooking(stylist)}
                        style={{ width: '100%', background: '#7c3aed', color: '#fff', padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                      >
                        Book with {stylist.name.split(' ')[0]} &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. POPULAR SERVICES CAROUSEL */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900 }}>🔥 Popular Services in Ramanathapuram</h2>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Precision haircuts, herbal hair spa, bridal glow, and traditional shaves</p>
                </div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Scroll horizontally &rarr;</span>
              </div>

              <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, scrollSnapType: 'x mandatory' }}>
                {ALL_SERVICES_CATALOG.map(svc => (
                  <div 
                    key={svc.id}
                    style={{ minWidth: 260, maxWidth: 260, background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: '#eff6ff', color: '#1e40af', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>
                        {svc.category}
                      </span>
                      {svc.doorstep && (
                        <span style={{ background: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          🏡 Home
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, marginTop: 10, lineHeight: 1.3 }}>{svc.name}</h4>
                    <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Duration: {svc.duration} • {svc.salonName}</p>

                    <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>₹{svc.price}</span>
                        {svc.isNegotiable && (
                          <span style={{ display: 'block', fontSize: 10, color: '#16a34a', fontWeight: 700 }}>Bargain OK</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const salon = TAMILNADU_SALONS.find(s => s.services.some(x => x.id === svc.id)) || TAMILNADU_SALONS[0];
                          openBranchBooking(salon.branches[0], svc);
                        }}
                        style={{ background: '#0f172a', color: '#fff', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. DOORSTEP SERVICE SPECIALISTS */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900 }}>🏡 Doorstep & Home Visit Specialists</h2>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Certified beauticians delivering salon treatments to your home in Ramnad, Panaikulam & Puduvalasai</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                {TAMILNADU_SALONS.filter(s => s.doorstepAvailable).map(salon => (
                  <div key={salon.id} style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, display: 'flex', gap: 16 }}>
                    <img src={salon.image} alt={salon.name} style={{ width: 110, height: 110, borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                          VERIFIED DOORSTEP
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: '#d97706' }}>
                          <Star size={13} fill="#d97706" color="#d97706" /> {salon.rating}
                        </div>
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, marginTop: 6 }}>{salon.name}</h4>
                      <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{salon.doorstepRadius}</p>
                      
                      <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Free Travel Within Radius</span>
                        <button
                          onClick={() => openBranchBooking(salon.branches[0])}
                          style={{ background: '#059669', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer' }}
                        >
                          Book Doorstep &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. LIVE SEARCH RESULTS / COMPLETE SALON DIRECTORY */}
            <section style={{ marginBottom: 60 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900 }}>
                    All Verified Salons in {selectedLocality === 'All' ? 'Ramanathapuram District' : selectedLocality}
                  </h2>
                  <p style={{ color: '#64748b', fontSize: 13 }}>
                    Showing verified studios in Ramnad Town, Puduvalasai, Panaikulam, and Sakkarakottai.
                  </p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>
                  {filteredSalons.length} Salons Found
                </span>
              </div>

              {filteredSalons.length === 0 ? (
                <div style={{ background: '#ffffff', borderRadius: 12, padding: 48, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>No salons found matching your active filter criteria.</p>
                  <button 
                    onClick={() => { setSelectedLocality('All'); setSelectedCategory('All'); setWorkTypeFilter('ALL'); setSearchQuery(''); setPriceFilter('ALL'); }}
                    style={{ marginTop: 12, background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                  {filteredSalons.map(salon => (
                    <div key={salon.id} style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      
                      {/* Image Banner */}
                      <div style={{ height: 180, position: 'relative' }}>
                        <img src={salon.image} alt={salon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                          {salon.doorstepAvailable && (
                            <span style={{ background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                              🏡 Doorstep ({salon.doorstepRadius})
                            </span>
                          )}
                        </div>
                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" /> {salon.rating} ({salon.reviewsCount})
                        </div>
                      </div>

                      {/* Salon Card Details */}
                      <div style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800 }}>{salon.name}</h3>
                        <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{salon.type}</p>
                        
                        {/* Localities Badge */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                          {salon.localities.map(loc => (
                            <span key={loc} style={{ background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                              📍 {loc}
                            </span>
                          ))}
                        </div>

                        {/* Site Point of Contact (POC) Person */}
                        <div style={{ marginTop: 12, padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ fontSize: 10, color: '#15803d', fontWeight: 800, textTransform: 'uppercase' }}>Site POC for Inquiries</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>{salon.poc.name} <span style={{ fontWeight: 400, color: '#15803d' }}>({salon.poc.role})</span></p>
                          </div>
                          <a href={`tel:${salon.poc.phone}`} style={{ fontSize: 11, color: '#15803d', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Phone size={12} /> {salon.poc.phone}
                          </a>
                        </div>

                        {/* Services Snippet */}
                        <div style={{ marginTop: 14 }}>
                          <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Popular Services & Rates</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                            {salon.services.slice(0, 3).map(svc => (
                              <div key={svc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                                <span>{svc.name} <span style={{ color: '#94a3b8', fontSize: 11 }}>({svc.duration})</span></span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {svc.isNegotiable && (
                                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                                      Negotiable
                                    </span>
                                  )}
                                  <span style={{ fontWeight: 700 }}>₹{svc.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Booking Action Button */}
                        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                          <button 
                            onClick={() => openBranchBooking(salon.branches[0])}
                            style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '11px', borderRadius: 8, fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' }}
                          >
                            Book Slot & Apply Coupon <ArrowRight size={16} />
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 5. COMPREHENSIVE BOOKING MODAL (BRANCH OR STYLIST FIRST) */}
      {/* ======================================================== */}
      {bookingModalOpen && selectedSalon && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '92vh', overflowY: 'auto', padding: 28, position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            <button 
              onClick={() => setBookingModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            {!bookingConfirmed ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: bookingFlowMode === 'BRANCH' ? '#2563eb' : '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {bookingFlowMode === 'BRANCH' ? <Building size={22} color="#fff" /> : <Scissors size={22} color="#fff" />}
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: bookingFlowMode === 'BRANCH' ? '#2563eb' : '#7c3aed', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {bookingFlowMode === 'BRANCH' ? 'Entry Point 1: Branch-First Booking' : 'Entry Point 2: Stylist-First Booking'}
                    </span>
                    <h3 style={{ fontSize: 20, fontWeight: 900 }}>
                      {bookingFlowMode === 'BRANCH' ? (selectedBranch ? selectedBranch.name : selectedSalon.name) : `Booking with ${selectedStylist ? selectedStylist.name : 'Stylist'}`}
                    </h3>
                  </div>
                </div>

                {/* 1. Branch Selection (If Branch Mode, or eligible branches if Stylist Mode) */}
                <div style={{ marginTop: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Select Salon Branch / Facility
                  </label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    {(bookingFlowMode === 'STYLIST' && selectedStylist
                      ? selectedSalon.branches.filter(b => selectedStylist.assignedBranchIds.includes(b.id))
                      : selectedSalon.branches
                    ).map(br => (
                      <button
                        key={br.id}
                        onClick={() => setSelectedBranch(br)}
                        style={{
                          background: selectedBranch && selectedBranch.id === br.id ? '#2563eb' : '#f1f5f9',
                          color: selectedBranch && selectedBranch.id === br.id ? '#ffffff' : '#334155',
                          padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer'
                        }}
                      >
                        📍 {br.name} ({br.locality})
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Service Selection (Respects Relational Integrity) */}
                <div style={{ marginTop: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Select Service {bookingFlowMode === 'STYLIST' ? `(Certified for ${selectedStylist.name})` : `(Offered at Branch)`}
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                    {(bookingFlowMode === 'STYLIST' && selectedStylist
                      ? selectedSalon.services.filter(s => selectedStylist.supportedServiceIds.includes(s.id))
                      : (selectedBranch && selectedBranch.serviceIds ? selectedSalon.services.filter(s => selectedBranch.serviceIds.includes(s.id)) : selectedSalon.services)
                    ).map(svc => (
                      <div 
                        key={svc.id}
                        onClick={() => { setSelectedService(svc); setBargainPrice(''); }}
                        style={{
                          padding: '10px 14px', borderRadius: 8, border: '1px solid',
                          borderColor: selectedService && selectedService.id === svc.id ? '#2563eb' : '#e2e8f0',
                          background: selectedService && selectedService.id === svc.id ? '#eff6ff' : '#ffffff',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                        }}
                      >
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 800 }}>{svc.name}</p>
                          <p style={{ fontSize: 11, color: '#64748b' }}>Duration: {svc.duration} • {svc.category}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 15, fontWeight: 900 }}>₹{svc.price}</span>
                          {svc.isNegotiable && (
                            <span style={{ display: 'block', fontSize: 10, color: '#16a34a', fontWeight: 800 }}>
                              Eligible for Bargain
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Stylist Selection (If Branch Mode, show assigned stylists + Any Stylist option) */}
                {bookingFlowMode === 'BRANCH' && (
                  <div style={{ marginTop: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Select Stylist or Choose Owner Assignment
                    </label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedStylist({ id: 'ANY', name: 'Any Available Stylist (Owner Assigned)' })}
                        style={{
                          background: !selectedStylist || selectedStylist.id === 'ANY' ? '#0f172a' : '#f1f5f9',
                          color: !selectedStylist || selectedStylist.id === 'ANY' ? '#ffffff' : '#334155',
                          padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer'
                        }}
                      >
                        ✨ Any Stylist (Owner Will Assign)
                      </button>

                      {ALL_STYLISTS.filter(st => 
                        selectedBranch ? st.assignedBranchIds.includes(selectedBranch.id) : true
                      ).map(st => (
                        <button
                          key={st.id}
                          onClick={() => setSelectedStylist(st)}
                          style={{
                            background: selectedStylist && selectedStylist.id === st.id ? '#7c3aed' : '#f1f5f9',
                            color: selectedStylist && selectedStylist.id === st.id ? '#ffffff' : '#334155',
                            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer'
                          }}
                        >
                          👤 {st.name} ({st.rating}★)
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      {!selectedStylist || selectedStylist.id === 'ANY' 
                        ? 'Note: Choosing "Any Stylist" allows the Salon Owner to verify and assign the best available staff.'
                        : `Note: Booking with ${selectedStylist.name} will be confirmed directly by the stylist or branch owner.`}
                    </p>
                  </div>
                )}

                {/* Service Mode Toggle (In-Salon vs Doorstep) */}
                {selectedSalon.doorstepAvailable && (
                  <div style={{ marginTop: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Service Delivery Mode
                    </label>
                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                      <button
                        onClick={() => setSelectedWorkType('IN_SALON')}
                        style={{
                          flex: 1, padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                          background: selectedWorkType === 'IN_SALON' ? '#2563eb' : '#f1f5f9',
                          color: selectedWorkType === 'IN_SALON' ? '#ffffff' : '#334155'
                        }}
                      >
                        🏢 In-Salon Appointment
                      </button>
                      <button
                        onClick={() => setSelectedWorkType('DOORSTEP')}
                        style={{
                          flex: 1, padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                          background: selectedWorkType === 'DOORSTEP' ? '#059669' : '#f1f5f9',
                          color: selectedWorkType === 'DOORSTEP' ? '#ffffff' : '#334155'
                        }}
                      >
                        🏡 Doorstep Home Visit
                      </button>
                    </div>
                  </div>
                )}

                {/* Easy Bargain Section */}
                {selectedService && selectedService.isNegotiable && (
                  <div style={{ marginTop: 18, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#166534', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Tag size={14} /> Easy Price Bargain Enabled
                      </span>
                      <span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                        Min Floor Price: ₹{selectedService.minFloorPrice || selectedService.minPrice}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: '#14532d', marginTop: 4 }}>
                      Quickly counter-offer or use 1-click discount chips:
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button 
                        type="button"
                        onClick={() => setBargainPrice(String(selectedService.price - 50))}
                        style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        - ₹50 OFF
                      </button>
                      <button 
                        type="button"
                        onClick={() => setBargainPrice(String(selectedService.price - 100))}
                        style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        - ₹100 OFF
                      </button>
                      <input 
                        type="number"
                        placeholder={`Custom offer (Min ₹${selectedService.minFloorPrice || selectedService.minPrice})`}
                        value={bargainPrice}
                        onChange={(e) => setBargainPrice(e.target.value)}
                        style={{ flex: 1, padding: '6px 10px', border: '1px solid #86efac', borderRadius: 6, fontSize: 12 }}
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Slot Selection */}
                <div style={{ marginTop: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Select Appointment Slot</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 6 }}>
                    {availableSlots.map(slot => {
                      const isBlocked = slot.status.includes('Blocked');
                      return (
                        <button
                          key={slot.time}
                          disabled={isBlocked}
                          onClick={() => setSelectedSlot(slot.time)}
                          style={{
                            padding: '10px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            border: '1px solid',
                            borderColor: isBlocked ? '#e2e8f0' : (selectedSlot === slot.time ? '#2563eb' : '#cbd5e1'),
                            background: isBlocked ? '#f1f5f9' : (selectedSlot === slot.time ? '#2563eb' : '#ffffff'),
                            color: isBlocked ? '#94a3b8' : (selectedSlot === slot.time ? '#ffffff' : '#334155'),
                            cursor: isBlocked ? 'not-allowed' : 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <div>{slot.time}</div>
                          <span style={{ fontSize: 10, display: 'block', marginTop: 2, opacity: 0.8 }}>{slot.status}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Promotional Coupon Application */}
                <div style={{ marginTop: 18, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Apply Promotional Coupon</label>
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <input 
                      type="text" 
                      placeholder="Enter promo code (e.g. RAMNAD50 or FESTIVE15)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, textTransform: 'uppercase' }}
                    />
                    <button 
                      type="submit"
                      style={{ background: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{couponError}</p>}
                  {appliedCoupon && (
                    <div style={{ marginTop: 6, background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                      ✓ Applied {appliedCoupon.code}: {appliedCoupon.desc} (-₹{discountAmount})
                    </div>
                  )}
                </div>

                {/* Total & Confirmation */}
                <div style={{ marginTop: 20, background: '#f8fafc', padding: 16, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Net Total Payable</span>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>₹{netPayable}</h3>
                    {discountAmount > 0 && (
                      <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>Total Discount: ₹{discountAmount}</span>
                    )}
                  </div>
                  <button 
                    onClick={handleConfirmBooking}
                    style={{ background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    Confirm & Get 6-Digit OTP &rarr;
                  </button>
                </div>
              </>
            ) : (
              // BOOKING CONFIRMATION SCREEN
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={38} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900 }}>Appointment Confirmed!</h3>
                <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                  Booking Ref: <strong>{bookingConfirmed.reference}</strong> • {bookingConfirmed.confirmationType}
                </p>

                {/* 6-DIGIT ARRIVAL OTP BADGE */}
                <div style={{ margin: '24px auto', background: '#eff6ff', border: '2px dashed #3b82f6', borderRadius: 12, padding: 18, maxWidth: 360 }}>
                  <span style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Your Secure 6-Digit Check-in OTP
                  </span>
                  <div style={{ fontSize: 38, fontWeight: 900, color: '#1e3a8a', letterSpacing: 6, margin: '8px 0' }}>
                    {bookingConfirmed.otp}
                  </div>
                  <p style={{ fontSize: 11, color: '#3b82f6' }}>
                    Share this code with your stylist upon arrival to start your service.
                  </p>
                </div>

                {/* WhatsApp Notification Simulator */}
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 12, fontSize: 12, color: '#166534', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Smartphone size={20} color="#16a34a" />
                  <div>
                    <strong>WhatsApp Alert Sent to {customerUser.phone}</strong>
                    <p style={{ fontSize: 11, color: '#15803d' }}>
                      "StyleBook TN: Slot reserved at {bookingConfirmed.branchName} with {bookingConfirmed.stylistName} ({bookingConfirmed.slot}). Check-in OTP: {bookingConfirmed.otp}"
                    </p>
                  </div>
                </div>

                {/* Site POC for Booking */}
                {bookingConfirmed.branchPoc && (
                  <div style={{ marginTop: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 12, textAlign: 'left' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Site POC For Questions:</span>
                    <p style={{ fontWeight: 700, marginTop: 2 }}>{bookingConfirmed.branchPoc.name} ({bookingConfirmed.branchPoc.role}) — Phone: <a href={`tel:${bookingConfirmed.branchPoc.phone}`} style={{ color: '#0284c7' }}>{bookingConfirmed.branchPoc.phone}</a></p>
                  </div>
                )}

                <button 
                  onClick={() => setBookingModalOpen(false)}
                  style={{ marginTop: 24, background: '#0f172a', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
                >
                  Close & View Appointments
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. DUAL REVIEW & RATING SUBMISSION MODAL                 */}
      {/* ======================================================== */}
      {reviewModalOpen && activeBookingForReview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000, padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 540, padding: 28, position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            
            <button 
              onClick={() => setReviewModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={20} color="#d97706" />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>Dual Experience Review</h3>
                <p style={{ fontSize: 12, color: '#64748b' }}>Rate both the Salon Branch and your Stylist ({activeBookingForReview.reference})</p>
              </div>
            </div>

            <form onSubmit={handleSubmitDualReview}>
              
              {/* Part 1: Branch Rating */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: '#1e40af' }}>
                    🏢 1. Salon Branch: {activeBookingForReview.branchName || activeBookingForReview.salon}
                  </label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setReviewForm({ ...reviewForm, branchRating: star })}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Star size={20} fill={star <= reviewForm.branchRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  rows={2}
                  placeholder="Share feedback on cleanliness, ambiance, waiting time, and equipment..."
                  value={reviewForm.branchComment}
                  onChange={(e) => setReviewForm({ ...reviewForm, branchComment: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', marginTop: 8, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
                />
              </div>

              {/* Part 2: Stylist Rating */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: '#7c3aed' }}>
                    ✂️ 2. Stylist: {activeBookingForReview.stylistName || 'Assigned Stylist'}
                  </label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setReviewForm({ ...reviewForm, stylistRating: star })}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Star size={20} fill={star <= reviewForm.stylistRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  rows={2}
                  placeholder="Share feedback on stylist skills, precision, friendliness, and advice..."
                  value={reviewForm.stylistComment}
                  onChange={(e) => setReviewForm({ ...reviewForm, stylistComment: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', marginTop: 8, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}
              >
                Publish Dual Review &rarr;
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. CUSTOMER AUTHENTICATION MODAL (LOGIN GATE)            */}
      {/* ======================================================== */}
      {showAuthModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 460, padding: 28, position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            
            <button 
              onClick={() => { setShowAuthModal(false); setAuthError(''); }}
              style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={20} color="#2563eb" />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>Customer Authentication</h3>
                <p style={{ fontSize: 12, color: '#64748b' }}>Ramanathapuram Client Portal</p>
              </div>
            </div>

            {authReason && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#1e40af' }}>
                <p>{authReason}</p>
              </div>
            )}

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 12px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertTriangle size={16} color="#d97706" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>DEV SOURCE ENVIRONMENT</p>
                <p style={{ fontSize: 10, color: '#78350f' }}>1-Click demo test login is active for rapid review. In Production builds, quick logins are stripped and real phone OTP verification is enforced.</p>
              </div>
            </div>

            {authError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', marginBottom: 14, color: '#b91c1c', fontSize: 12 }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleCustomerLogin}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Phone Number or Email</label>
                <input 
                  type="text" 
                  placeholder="e.g. +91 99999 00006 or mohamed@gmail.com"
                  value={authForm.identifier}
                  onChange={(e) => setAuthForm({ ...authForm, identifier: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, marginTop: 4, fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="Enter password (default: Password@123)"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, marginTop: 4, fontSize: 13 }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '11px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}
              >
                Sign In & Continue
              </button>
            </form>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: 8 }}>
                ⚡ Fast 1-Click Demo Login
              </p>
              <button 
                onClick={handleQuickDemoLogin}
                style={{ width: '100%', background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px', borderRadius: 8, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
              >
                <UserCheck size={16} /> Sign In as Mohamed Irfan (Customer)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. MY ACTIVE BOOKINGS MODAL                              */}
      {/* ======================================================== */}
      {showMyBookings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
            <button 
              onClick={() => setShowMyBookings(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={22} color="#2563eb" />
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>My Active Bookings</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              {customerBookings.filter(b => b.status === 'Confirmed').map(b => (
                <div key={b.reference} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{b.reference}</span>
                    <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{b.status}</span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, marginTop: 8 }}>{b.service}</h4>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{b.branchName || b.salon} • {b.locality}</p>
                  <p style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, marginTop: 2 }}>Stylist: {b.stylistName}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>Slot: <strong>{b.slot}</strong></span>
                    <span style={{ fontSize: 12, background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 4, fontWeight: 800 }}>
                      Check-in OTP: {b.otp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. MY HISTORY & REVIEWS MODAL                            */}
      {/* ======================================================== */}
      {showHistory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
            <button 
              onClick={() => setShowHistory(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <History size={22} color="#7c3aed" />
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>Appointment History & Reviews</h3>
            </div>
            
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {customerBookings.map(b => (
                <div key={b.reference} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, background: b.status === 'Completed' ? '#f1f5f9' : '#dcfce7', color: b.status === 'Completed' ? '#475569' : '#15803d', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                      {b.status.toUpperCase()} • {b.date}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>₹{b.amount}</span>
                  </div>

                  <h4 style={{ fontSize: 15, fontWeight: 800, marginTop: 8 }}>{b.service}</h4>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{b.branchName || b.salon} • Stylist: <strong>{b.stylistName}</strong></p>

                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Ref: {b.reference}</span>
                    
                    {b.status === 'Completed' ? (
                      b.hasReviewed ? (
                        <span style={{ fontSize: 12, color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={14} /> Dual Review Submitted ({b.branchRating}★ Branch / {b.stylistRating}★ Stylist)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenReviewModal(b)}
                          style={{ background: '#f59e0b', color: '#fff', padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <Star size={13} fill="#fff" /> Leave Review / Rate
                        </button>
                      )
                    ) : (
                      <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>Active Booking (OTP: {b.otp})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. CUSTOMER REPORTS & INVOICES MODAL                    */}
      {/* ======================================================== */}
      {showReports && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 540, padding: 28, position: 'relative' }}>
            <button 
              onClick={() => setShowReports(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={22} color="#059669" />
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>Customer Invoices & Summary</h3>
            </div>
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Total Spent in 2026</span>
                <h4 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>₹3,580</h4>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Saved via Coupons</span>
                <h4 style={{ fontSize: 24, fontWeight: 900, color: '#16a34a', marginTop: 4 }}>₹450</h4>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
