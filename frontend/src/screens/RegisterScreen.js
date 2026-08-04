import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import NeonAuthScreen, { NeonInput, NeonButton } from '../components/NeonAuthScreen';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const ROLES = [
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'shop_owner', label: 'Shop Owner', icon: '🏪' },
  { id: 'library', label: 'Librarian', icon: '📚' },
];

export default function RegisterScreen({ route, navigation }) {
  const { register } = useAuth();

  const initialRole = route?.params?.role || 'student';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    // Student specific
    name: '',
    inCollege: '',
    department: '',
    profileImage: '',
    // Shop specific
    shopName: '',
    ownerName: '',
    address: '',
    // Library specific
    libraryName: '',
    librarianName: '',
  });

  function setValue(key, value) {
    setForm({ ...form, [key]: value });
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setValue('profileImage', response.data.imageUrl);
      Alert.alert('Success', 'Profile photo uploaded!');
    } catch (error) {
      console.log('Upload error', error);
      Alert.alert('Upload Failed', 'Could not upload image. Check backend connection.');
    } finally {
      setUploading(false);
    }
  };

  async function handleRegister() {
    try {
      if (!form.email || !form.password) {
        Alert.alert('Missing Details', 'Email and password are required');
        return;
      }
      setLoading(true);
      await register({
        ...form,
        name: form.name || form.username,
        role: selectedRole.trim().toLowerCase(),
        email: form.email.trim(),
      });
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Backend not connected. Please check backend server.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <NeonAuthScreen
      icon="+"
      title="Create Your Account"
      subtitle="Start smarter transactions with campus book exchange."
      footerText="Already have an account?"
      footerLinkText="Log in"
      onFooterLinkPress={() => navigation.navigate('Login', { role: selectedRole })}
    >
      {/* Role Selection Chips */}
      <Text style={styles.roleHeaderLabel}>Select Your Role</Text>
      <View style={styles.roleRow}>
        {ROLES.map((role) => {
          const isActive = selectedRole === role.id;
          return (
            <TouchableOpacity
              key={role.id}
              activeOpacity={0.8}
              onPress={() => setSelectedRole(role.id)}
              style={[
                styles.roleChip,
                isActive && styles.roleChipActive,
              ]}
            >
              <Text style={styles.roleChipIcon}>{role.icon}</Text>
              <Text style={[styles.roleChipText, isActive && styles.roleChipTextActive]}>
                {role.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Primary Common Fields (Matches Screenshot) */}
      <NeonInput
        label="Username / Full Name"
        placeholder="Choose a username"
        value={form.username || form.name}
        onChangeText={(v) => {
          setValue('username', v);
          setValue('name', v);
        }}
      />

      <NeonInput
        label="Email address"
        placeholder="Email address"
        value={form.email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(v) => setValue('email', v)}
      />

      <NeonInput
        label="Mobile number"
        placeholder="Mobile number (+123...)"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(v) => setValue('phone', v)}
      />

      <NeonInput
        label="Password"
        placeholder="Create a password"
        value={form.password}
        secureTextEntry
        onChangeText={(v) => setValue('password', v)}
      />

      {/* Role-Specific Fields */}
      {selectedRole === 'student' && (
        <>
          <NeonInput
            label="College Name"
            placeholder="e.g. Stanford University"
            value={form.inCollege}
            onChangeText={(v) => setValue('inCollege', v)}
          />
          <NeonInput
            label="Department"
            placeholder="Department (e.g. Computer Science)"
            value={form.department}
            onChangeText={(v) => setValue('department', v)}
          />
          <NeonInput
            label="Current Location"
            placeholder="City / Campus Location"
            value={form.location}
            onChangeText={(v) => setValue('location', v)}
          />
        </>
      )}

      {selectedRole === 'shop_owner' && (
        <>
          <NeonInput
            label="Shop Name"
            placeholder="Campus Bookstore"
            value={form.shopName}
            onChangeText={(v) => setValue('shopName', v)}
          />
          <NeonInput
            label="Shop Address"
            placeholder="Full Shop Address"
            value={form.address}
            onChangeText={(v) => setValue('address', v)}
          />
          <NeonInput
            label="Location"
            placeholder="Location (City / Area)"
            value={form.location}
            onChangeText={(v) => setValue('location', v)}
          />
          <NeonInput
            label="Business Description"
            placeholder="Brief description of shop inventory"
            value={form.businessDescription || ''}
            onChangeText={(v) => setValue('businessDescription', v)}
          />
        </>
      )}

      {selectedRole === 'library' && (
        <>
          <NeonInput
            label="Library Name"
            placeholder="Central City Library"
            value={form.libraryName}
            onChangeText={(v) => setValue('libraryName', v)}
          />
          <NeonInput
            label="Library Address"
            placeholder="Full Library Address"
            value={form.address}
            onChangeText={(v) => setValue('address', v)}
          />
          <NeonInput
            label="Location"
            placeholder="Location (City / District)"
            value={form.location}
            onChangeText={(v) => setValue('location', v)}
          />
        </>
      )}

      {/* Profile Image Picker for all roles */}
      <TouchableOpacity
        onPress={pickImage}
        style={styles.imageUploadBtn}
        activeOpacity={0.8}
      >
        {uploading ? (
          <ActivityIndicator color="#dc2626" />
        ) : (
          <Text style={[styles.imageUploadText, form.profileImage && styles.imageUploadTextSuccess]}>
            {form.profileImage ? '✓ Profile Image Uploaded' : '📷 Upload Profile Photo (Optional)'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Primary Register Action Button */}
      <NeonButton
        title="CREATE ACCOUNT"
        onPress={handleRegister}
        loading={loading}
      />
    </NeonAuthScreen>
  );
}

const styles = StyleSheet.create({
  roleHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#090d20',
    borderWidth: 1.5,
    borderColor: 'rgba(88, 101, 242, 0.2)',
  },
  roleChipActive: {
    borderColor: '#00f0ff',
    backgroundColor: '#0c122e',
    shadowColor: '#00f0ff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  roleChipIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  roleChipTextActive: {
    color: '#00f0ff',
    fontWeight: '700',
  },
  imageUploadBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderStyle: 'dashed',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#090d20',
  },
  imageUploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  imageUploadTextSuccess: {
    color: '#00f0ff',
    fontWeight: '700',
  },
});