import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Alert
} from 'react-native';
import AuthLayout from './AuthLayout';
import { useNavigation, useRoute } from '@react-navigation/native';

import { authApi } from '../../api/auth';

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email } = route.params || { email: 'example@email.com' };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleBackspace = (text: string, index: number) => {
      if (!text && index > 0) {
          inputs.current[index - 1]?.focus();
      }
  }

  const handleVerify = async (code: string) => {
    if (!email) return;
    
    setLoading(true);
    Keyboard.dismiss();
    try {
        await authApi.verify({
            email,
            otp: code
        });
        
        // Success - Navigate to Username Screen
        navigation.reset({
            index: 0,
            routes: [{ name: 'UsernameScreen' }],
        });
    } catch (error: any) {
       Alert.alert(error.message || 'Xác thực thất bại');
        // Clear OTP if failed?
        // setOtp(['', '', '', '', '', '']);
    } finally {
        setLoading(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <AuthLayout
      title="Xác nhận email"
      subtitle={`Chúng tôi đã gửi mã 6 chữ số đến\n${email}`}
    >
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputs.current[index] = ref; }}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                    handleBackspace(digit, index);
                }
            }}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, !isComplete && styles.buttonDisabled]}
        onPress={() => handleVerify(otp.join(''))}
        disabled={!isComplete}
      >
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {countdown > 0 ? (
          <Text style={styles.resendText}>Gửi lại mã sau {countdown}s</Text>
        ) : (
          // <TouchableOpacity onPress={handleResend}>
            <TouchableOpacity >
            <Text style={styles.linkText}>Gửi lại mã</Text>
          </TouchableOpacity>
        )}
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1E1E22',
    color: '#FFF',
    fontSize: 24,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#A78BFA',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  resendContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  linkText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OTPScreen;
