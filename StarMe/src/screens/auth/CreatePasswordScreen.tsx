import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import AuthLayout from './AuthLayout';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreatePasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { username, avatarUrl } = route.params || {};

  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
  const isValid = hasMinLength && hasLetterAndNumber;
   
  const handleContinue = () => {
    if (isValid) {
     
      navigation.navigate('ConfirmPasswordScreen', { username, avatarUrl, password });
    }
  };

  return (
    <AuthLayout title="Tạo mật khẩu" subtitle="Bảo mật tài khoản của bạn">
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
          autoFocus
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rulesContainer}>
        <View style={styles.ruleItem}>
          <Ionicons
            name={hasMinLength ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={hasMinLength ? '#10B981' : '#6B7280'}
          />
          <Text style={[styles.ruleText, hasMinLength && styles.ruleTextValid]}>
            Ít nhất 8 ký tự
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Ionicons
            name={hasLetterAndNumber ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={hasLetterAndNumber ? '#10B981' : '#6B7280'}
          />
          <Text
            style={[
              styles.ruleText,
              hasLetterAndNumber && styles.ruleTextValid,
            ]}
          >
            Có chữ & số
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
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
    marginBottom: 24,
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
  rulesContainer: {
    marginBottom: 32,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    color: '#6B7280',
    marginLeft: 8,
    fontSize: 14,
  },
  ruleTextValid: {
    color: '#D1D5DB',
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
});

export default CreatePasswordScreen;
