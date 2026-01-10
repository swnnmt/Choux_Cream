import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import AuthLayout from './AuthLayout';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/auth';

const EmailScreen = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation<any>();

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(text));
  };

  const handleContinue = async () => {
    if (!isValid) return;
    try {
      await authApi.requestOtp(email.trim().toLowerCase());
      await AsyncStorage.setItem('pendingEmail', email.trim().toLowerCase());
      navigation.navigate('OTPScreen', { email });
    } catch (error: any) {
      Alert.alert(error.message || 'Gửi OTP thất bại');
    }
  };

  return (
    <AuthLayout
      title="Đăng ký tài khoản"
      subtitle="Nhập email để bắt đầu"
      showBack={false}
    >
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email của bạn"
          placeholderTextColor="#6B7280"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
      </View>
      {!isValid && email.length > 0 && (
        <Text style={styles.errorText}>Email không hợp lệ</Text>
      )}

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.linkText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E22',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#A78BFA', // Soft Purple
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#4B5563',
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  linkText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmailScreen;
