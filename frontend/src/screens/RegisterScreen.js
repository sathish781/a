import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import NeonAuthScreen, { NeonInput, NeonButton } from '../components/NeonAuthScreen';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';

const ROLES = [
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'shop', label: 'Shop Owner', icon: '🏪' },
  { id: 'library', label: 'Librarian', icon: '📚' },
];

export default function RegisterScreen({ route, navigation }) {
  const { register } = useAuth();
  const { theme } = useThemeMode();
  const { showToast } = useToast();

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
    name: '',
    college: '',
    department: '',
    profileImage: '',
    shopName: '',
    shopAddress: '',
    libraryName: '',
    libraryAddress: '',
    recoveryHint: '',
  });

  function setValue(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
      showToast('Profile photo uploaded! 📷', 'success');
    } catch (error) {
      showToast('Could not upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  async function handleRegister() {
    try {
      if (!form.email || !form.password) {
        showToast('Email and password are required.', 'error');
        return;
      }
      const trimmedEmail = form.email.trim().toLowerCase();
      if (!trimmedEmail.includes('@')) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      setLoading(true);
      await register({
        ...form,
        name: form.name || form.username || (selectedRole === 'shop' ? form.shopName : selectedRole === 'library' ? form.libraryName : 'New User'),
        role: selectedRole,
        email: trimmedEmail,
      });

      if (selectedRole === 'shop' || selectedRole === 'library') {
        showToast('Account submitted for Admin approval! ⏳', 'info', 4000);
      } else {
        showToast('Account created successfully! 🎉', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed. Check connection.', 'error');
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
                {
                  backgroundColor: theme.backgroundOne,
                  borderColor: isActive ? theme.primary : theme.glassBorder,
                },
                isActive && {
                  shadowColor: theme.primary,
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
            >
              <Text style={styles.roleChipIcon}>{role.icon}</Text>
              <Text
                style={[
                  styles.roleChipText,
                  { color: isActive ? theme.primary : theme.muted, fontWeight: isActive ? '800' : '600' },
                ]}
              >
                {role.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <NeonInput
        label="Username / Full Name"
        placeholder="Choose a username"
        value={form.username || form.name}
        icon="👤"
        onChangeText={(v) => {
          setValue('username', v);
          setValue('name', v);
        }}
      />

      <NeonInput
        label="Email address"
        placeholder="you@university.edu"
        value={form.email}
        autoCapitalize="none"
        keyboardType="email-address"
        icon="✉️"
        onChangeText={(v) => setValue('email', v)}
      />

      <NeonInput
        label="Mobile number"
        placeholder="e.g. +91 9876543210"
        value={form.phone}
        keyboardType="phone-pad"
        icon="📱"
        onChangeText={(v) => setValue('phone', v)}
      />

      <NeonInput
        label="Password"
        placeholder="Create a password"
        value={form.password}
        secureTextEntry
        icon="🔑"
        onChangeText={(v) => setValue('password', v)}
      />

      <NeonInput
        label="Recovery Hint (for password reset)"
        placeholder="e.g. Your first pet's name"
        value={form.recoveryHint}
        icon="💡"
        onChangeText={(v) => setValue('recoveryHint', v)}
      />

      {/* Dynamic Role Specific Fields */}
      {selectedRole === 'student' && (
        <>
          <NeonInput
            label="College / University Name"
            placeholder="e.g. National Institute of Tech"
            value={form.college}
            icon="🎓"
            onChangeText={(v) => setValue('college', v)}
          />
          <NeonInput
            label="Department"
            placeholder="e.g. Computer Science & Eng"
            value={form.department}
            icon="🏛️"
            onChangeText={(v) => setValue('department', v)}
          />
          <NeonInput
            label="Current Location / Campus"
            placeholder="City or Campus Area"
            value={form.location}
            icon="📍"
            onChangeText={(v) => setValue('location', v)}
          />
        </>
      )}

      {selectedRole === 'shop' && (
        <>
          <NeonInput
            label="Shop / Store Name"
            placeholder="Bookstore Name"
            value={form.shopName}
            icon="🏪"
            onChangeText={(v) => setValue('shopName', v)}
          />
          <NeonInput
            label="Shop Address"
            placeholder="Full Store Address"
            value={form.shopAddress}
            icon="🏢"
            onChangeText={(v) => setValue('shopAddress', v)}
          />
          <NeonInput
            label="City / Location"
            placeholder="City or District"
            value={form.location}
            icon="📍"
            onChangeText={(v) => setValue('location', v)}
          />
        </>
      )}

      {selectedRole === 'library' && (
        <>
          <NeonInput
            label="Library Name"
            placeholder="Institutional Library Name"
            value={form.libraryName}
            icon="📚"
            onChangeText={(v) => setValue('libraryName', v)}
          />
          <NeonInput
            label="Library Address"
            placeholder="Campus Building / Address"
            value={form.libraryAddress}
            icon="🏛️"
            onChangeText={(v) => setValue('libraryAddress', v)}
          />
          <NeonInput
            label="City / District"
            placeholder="City or District"
            value={form.location}
            icon="📍"
            onChangeText={(v) => setValue('location', v)}
          />
        </>
      )}

      <TouchableOpacity
        onPress={pickImage}
        style={[
          styles.imageUploadBtn,
          {
            backgroundColor: theme.backgroundOne,
            borderColor: form.profileImage ? theme.primary : theme.glassBorder,
          },
        ]}
        activeOpacity={0.8}
      >
        {uploading ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <Text
            style={[
              styles.imageUploadText,
              { color: theme.muted },
              form.profileImage && { color: theme.primary, fontWeight: '800' },
            ]}
          >
            {form.profileImage ? '✓ Profile Photo Uploaded' : '📷 Upload Profile Photo (Optional)'}
          </Text>
        )}
      </TouchableOpacity>

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
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  roleChipIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  roleChipText: {
    fontSize: 12,
  },
  imageUploadBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageUploadText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
