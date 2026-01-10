import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AuthLayout from './AuthLayout';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../../api/auth';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

const UsernameScreen = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleContinue = async () => {
    if (!username) return;
    navigation.navigate('AvatarScreen', { username });
  };

  return (
    <AuthLayout
      title="Tên người dùng"
      subtitle="Chọn một tên hiển thị độc đáo"
      showBack={false}
    >
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#6B7280"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
      </View>

      <TouchableOpacity
        style={[styles.button, (!username || loading) && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!username || loading}
      >
        {loading ? (
            <ActivityIndicator color="#000" />
        ) : (
            <Text style={styles.buttonText}>Hoàn tất</Text>
        )}
      </TouchableOpacity>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#374151',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UsernameScreen;
