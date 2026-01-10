import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AuthLayout from './AuthLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadApi } from '../../api/upload';


const AvatarScreen = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { username } = route.params || {};

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      setAvatar(image.path);
    } catch (error) {}
  };


const handleContinue = async () => {
  if (!avatar) {
    Alert.alert('Chưa có ảnh');
    return;
  }

  try {
    const avatarUrl = await uploadApi.uploadAvatar(avatar);

    navigation.navigate('CreatePasswordScreen', {
      username,
      avatarUrl,
    });
  } catch (e) {
    Alert.alert('Lỗi upload ảnh');
  }
};

  return (
    <AuthLayout
      title="Ảnh đại diện"
      subtitle="Chọn và căn chỉnh ảnh đại diện"
      showBack
    >
      {/* AVATAR + CAMERA ICON */}
      <View style={styles.preview}>
        <View style={styles.avatarWrapper}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]}>
              <Ionicons name="person" size={64} color="#9CA3AF" />
            </View>
          )}

          {/* CAMERA ICON */}
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Ionicons name="camera" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTINUE */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  preview: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1E1E22',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000', // viền để nổi trên avatar
  },
  button: {
    backgroundColor: '#A78BFA',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AvatarScreen;
