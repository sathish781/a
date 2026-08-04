import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    loadSavedUser();
  }, []);

  async function loadSavedUser() {
    try {
      const token = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('Load user error:', error);
    } finally {
      setLoadingUser(false);
    }
  }

  async function login(email, password, role) {
    const res = await api.post('/auth/login', {
      email,
      password,
      role,
    });

    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

    setUser(res.data.user);

    return res.data.user;
  }

  async function register(data) {
    const res = await api.post('/auth/register', data);

    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

    setUser(res.data.user);

    return res.data.user;
  }

  async function updateLocalUser(newUser) {
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }

  async function logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        login,
        register,
        updateLocalUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}