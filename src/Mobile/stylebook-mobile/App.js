import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, ScrollView, 
  TextInput, SafeAreaView, StatusBar, Alert, Linking 
} from 'react-native';

export default function App() {
  const [activeMode, setActiveMode] = useState('CUSTOMER'); // 'CUSTOMER' or 'STYLIST'
  const [otpInput, setOtpInput] = useState('');
  const [activeBooking, setActiveBooking] = useState({
    id: 'BK-883921',
    salon: 'Glamour Luxury Unisex Studio',
    branch: 'Bandra West Branch',
    service: 'Classic Precision Haircut',
    stylist: 'Arjun Kapoor',
    time: 'Today, 02:00 PM',
    status: 'Confirmed',
    otp: '739201',
    amount: '₹300'
  });

  const [stylistStatus, setStylistStatus] = useState({
    name: 'Arjun Kapoor',
    isAvailable: true,
    todayBookingsCount: 3,
    shift: '09:00 AM - 08:00 PM'
  });

  const handleVerifyOtp = () => {
    if (otpInput === activeBooking.otp) {
      Alert.alert('✅ OTP Verified!', 'Appointment is now In-Progress. Customer is checked in.');
      setActiveBooking({ ...activeBooking, status: 'In-Progress' });
      setOtpInput('');
    } else {
      Alert.alert('❌ Invalid OTP', 'Please recheck the 6-digit OTP provided by the customer.');
    }
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${activeBooking.salon}, my booking reference is ${activeBooking.id}. My service start OTP is ${activeBooking.otp}.`);
    Linking.openURL(`https://wa.me/919999900003?text=${text}`).catch(() => {
      Alert.alert('WhatsApp Alert', `Message prepared: "Booking ${activeBooking.id} OTP: ${activeBooking.otp}"`);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>StyleBook Mobile</Text>
          <Text style={styles.brandSubtitle}>Pocket-Friendly Quick Access</Text>
        </View>

        {/* Mode Switcher */}
        <View style={styles.modeToggle}>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeMode === 'CUSTOMER' && styles.toggleBtnActive]}
            onPress={() => setActiveMode('CUSTOMER')}
          >
            <Text style={[styles.toggleText, activeMode === 'CUSTOMER' && styles.toggleTextActive]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeMode === 'STYLIST' && styles.toggleBtnActive]}
            onPress={() => setActiveMode('STYLIST')}
          >
            <Text style={[styles.toggleText, activeMode === 'STYLIST' && styles.toggleTextActive]}>Stylist</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* CUSTOMER MODE */}
        {activeMode === 'CUSTOMER' ? (
          <View>
            {/* Active Appointment Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.badgeConfirmed}>{activeBooking.status}</Text>
                <Text style={styles.bookingRef}>{activeBooking.id}</Text>
              </View>

              <Text style={styles.salonName}>{activeBooking.salon}</Text>
              <Text style={styles.serviceName}>{activeBooking.service}</Text>
              <Text style={styles.branchText}>📍 {activeBooking.branch}</Text>
              <Text style={styles.timeText}>🕒 {activeBooking.time} &bull; Stylist: {activeBooking.stylist}</Text>

              {/* 6-DIGIT OTP BOX */}
              <View style={styles.otpBox}>
                <Text style={styles.otpLabel}>YOUR SERVICE START OTP</Text>
                <Text style={styles.otpNumber}>{activeBooking.otp}</Text>
                <Text style={styles.otpSub}>Show this 6-digit code to your stylist to begin service.</Text>
              </View>

              {/* Quick Actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.btnWhatsApp} onPress={handleOpenWhatsApp}>
                  <Text style={styles.btnWhatsAppText}>💬 Share on WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.btnReschedule}
                  onPress={() => Alert.alert('Reschedule', 'Please pick an alternate time slot on the booking calendar.')}
                >
                  <Text style={styles.btnRescheduleText}>Reschedule</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick 1-Tap Booking Shortcuts */}
            <Text style={styles.sectionTitle}>Quick Bookings & Re-order</Text>
            <View style={styles.quickGrid}>
              <TouchableOpacity style={styles.quickCard} onPress={() => Alert.alert('Booking', 'Initiating 1-click booking for Classic Haircut...')}>
                <Text style={styles.quickIcon}>✂️</Text>
                <Text style={styles.quickTitle}>Classic Haircut</Text>
                <Text style={styles.quickPrice}>₹300</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCard} onPress={() => Alert.alert('Booking', 'Initiating 1-click booking for Royal Shave...')}>
                <Text style={styles.quickIcon}>🪒</Text>
                <Text style={styles.quickTitle}>Royal Shave</Text>
                <Text style={styles.quickPrice}>₹220</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* STYLIST OPERATIONAL MODE */
          <View>
            {/* Shift Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.salonName}>{stylistStatus.name}</Text>
                <TouchableOpacity 
                  onPress={() => setStylistStatus({ ...stylistStatus, isAvailable: !stylistStatus.isAvailable })}
                  style={[styles.badgeAvailability, { backgroundColor: stylistStatus.isAvailable ? '#10b981' : '#ef4444' }]}
                >
                  <Text style={styles.badgeAvailText}>{stylistStatus.isAvailable ? '🟢 Online' : '🔴 On Break'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.branchText}>Today's Shift: {stylistStatus.shift}</Text>
              <Text style={styles.timeText}>Scheduled Appointments: {stylistStatus.todayBookingsCount}</Text>
            </View>

            {/* Stylist OTP Verification Keypad */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Customer Check-in OTP Verification</Text>
              <Text style={styles.branchText}>Enter the customer's 6-digit OTP upon arrival to verify booking and start service:</Text>

              <TextInput 
                style={styles.otpInput}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                maxLength={6}
                value={otpInput}
                onChangeText={setOtpInput}
              />

              <TouchableOpacity style={styles.btnVerify} onPress={handleVerifyOtp}>
                <Text style={styles.btnVerifyText}>Verify OTP & Start Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d1a' },
  header: {
    padding: 18,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  brandSubtitle: { color: '#64748b', fontSize: 11 },
  modeToggle: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 20, padding: 3 },
  toggleBtn: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 16 },
  toggleBtnActive: { backgroundColor: '#2563eb' },
  toggleText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  toggleTextActive: { color: '#ffffff' },
  content: { padding: 18 },
  card: {
    backgroundColor: '#111c44',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e295d'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeConfirmed: { backgroundColor: '#0369a1', color: '#ffffff', fontSize: 10, fontWeight: '800', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, textTransform: 'uppercase' },
  bookingRef: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  salonName: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  serviceName: { color: '#38bdf8', fontSize: 14, fontWeight: '700', marginTop: 2 },
  branchText: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  timeText: { color: '#cbd5e1', fontSize: 12, marginTop: 4 },
  otpBox: {
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#38bdf8',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginVertical: 14
  },
  otpLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  otpNumber: { color: '#38bdf8', fontSize: 36, fontWeight: '900', letterSpacing: 6, marginVertical: 4 },
  otpSub: { color: '#64748b', fontSize: 11, textAlign: 'center' },
  actionRow: { flexDirection: 'row', gap: 10 },
  btnWhatsApp: { flex: 1, backgroundColor: '#10b981', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnWhatsAppText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  btnReschedule: { flex: 1, backgroundColor: '#334155', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnRescheduleText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  sectionTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800', marginVertical: 10 },
  quickGrid: { flexDirection: 'row', gap: 12 },
  quickCard: { flex: 1, backgroundColor: '#182559', borderRadius: 10, padding: 14, alignItems: 'center' },
  quickIcon: { fontSize: 24, marginBottom: 4 },
  quickTitle: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  quickPrice: { color: '#10b981', fontSize: 12, fontWeight: '800', marginTop: 2 },
  badgeAvailability: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeAvailText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  otpInput: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 4,
    marginVertical: 12
  },
  btnVerify: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnVerifyText: { color: '#ffffff', fontSize: 13, fontWeight: '800' }
});
