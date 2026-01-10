import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApi = {
  register: async (data: any) => {
    try {
      const response = await client.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  requestOtp: async (email: string) => {
    try {
      const response = await client.post('/auth/request-otp', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  verify: async (data: any) => {
    try {
      const response = await client.post('/auth/verify', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  login: async (data: any) => {
    try {
      const response = await client.post('/auth/login', data);
      if (response.data.success && response.data.data.token) {
        await AsyncStorage.setItem('userToken', response.data.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error: any) {
        // If needs verification
        if (error.response?.status === 403 && error.response?.data?.data?.needsVerification) {
            return { needsVerification: true, message: error.response.data.message };
        }
      throw error.response?.data || error.message;
    }
  },

  resendOtp: async (email: string) => {
      try {
          const response = await client.post('/auth/resend-otp', { email });
          return response.data;
      } catch (error: any) {
          throw error.response?.data || error.message;
      }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  },

  updateProfile: async (data: any) => {
      const response = await client.put('/auth/profile', data);
      return response.data;
  }
};
