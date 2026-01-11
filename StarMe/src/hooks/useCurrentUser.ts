import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';
import { useFocusEffect } from '@react-navigation/native';

export const useCurrentUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      // 1. Try local storage first
      const stored = await AsyncStorage.getItem('userInfo');
      if (stored) {
        setUser(JSON.parse(stored));
      }

      // 2. Fetch fresh data
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data));
      }
    } catch (e) {
      // console.log('Error loading user:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  return { user, loading, refreshUser: loadUser };
};
