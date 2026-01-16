import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AuthLayout from './AuthLayout';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { authApi } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmPasswordScreen = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { username, avatarUrl, password } = route.params || {};

  const isMatch = confirmPassword === password;
  const showMismatchError = confirmPassword.length > 0 && !isMatch;

  const handleComplete = async () => {
    if (isMatch) {
      setLoading(true);
      try {
        const email = await AsyncStorage.getItem('pendingEmail');
        if (!email) {
          Alert.alert('Thiếu email', 'Vui lòng bắt đầu lại từ bước nhập email');
          return;
        }
        const payload = {
          username,
          email,
          password,
          confirmPassword,
          avatarUrl,
          deviceToken: "fcm_device_token_example_1232",
          platform: 'android'
        };
        await authApi.register(payload);
        navigation.reset({ index: 0, routes: [{ name: 'Intro' }] });
      } catch (error: any) {
          Alert.alert(error.message || 'Đăng ký thất bại');
      } finally {
        setLoading(false);
      }
    }
  };
// Alert.alert (avatarUrl);
  return (
    <AuthLayout title="Xác nhận mật khẩu" subtitle="Nhập lại mật khẩu để hoàn tất">
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#6B7280"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoFocus
        />
      </View>
      
      {showMismatchError && (
          <Text style={styles.errorText}>Mật khẩu không trùng khớp</Text>
      )}

      <TouchableOpacity
        style={[styles.button, (!isMatch || loading) && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={!isMatch || loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Hoàn tất đăng ký</Text>
        )}
      </TouchableOpacity>
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
    backgroundColor: '#A78BFA',
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
});

export default ConfirmPasswordScreen;
