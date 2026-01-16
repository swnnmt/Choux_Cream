import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AuthLayout from './AuthLayout';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { authApi } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    try {
        const result = await authApi.login({
            email,
            password,
            platform: 'android'
        });

        if (result.needsVerification) {
            await AsyncStorage.setItem('pendingEmail', email.trim().toLowerCase());
            navigation.navigate('OTPScreen', { email });
            return;
        }

        // Success
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    } catch (error: any) {
       Alert.alert(error.message || 'Đăng nhập thất bại');
    } finally {
        setLoading(false);
    }
  };

  const handleComplete = async () => {
    navigation.reset({ index: 0, routes: [{ name: 'Intro' }] });
  }

  return (
    <AuthLayout
      title="Choux Cream"
      subtitle="Đăng nhập để tiếp tục hành trình ngọt ngào"
      showBack={false}
    >
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6B7280"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#6B7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
      onPress={handleComplete}
      style={styles.forgotPassword}>
        <Text style={styles.linkText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>HOẶC</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('EmailScreen')}>
          <Text style={styles.linkText}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F9A8D4',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FBBF24',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: '#6B7280',
    marginHorizontal: 16,
    fontSize: 12,
  },
  socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 32,
  },
  socialButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#111827',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#4B5563',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  linkText: {
    color: '#EC4899',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
