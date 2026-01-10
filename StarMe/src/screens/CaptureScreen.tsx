import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMyProfile, createPost, CURRENT_USER_ID } from '../api/mockBackend';
import { uploadImage } from '../services/uploadService';
import ComponentHeader from '../components/ComponentHeader';

export default function CaptureScreen() {
  const currentUser = getMyProfile();
  const navigation = useNavigation<any>();
  
  // State quản lý ảnh và caption
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  
  // State quản lý trạng thái upload
  const [isUploading, setIsUploading] = useState(false);

  // Giả lập chụp ảnh (Thay thế bằng react-native-image-picker hoặc react-native-vision-camera ở đây)
  const capture = () => {
    const r = Math.floor(Math.random() * 10000);
    // Trong thực tế, đây sẽ là đường dẫn file:// trên điện thoại
    const uri = `https://picsum.photos/600/800?random=${r}`;
    setImageUri(uri);
  };

  // Hàm đăng bài chuẩn "Backend Flow"
  const post = async () => {
    if (!imageUri) return;

    try {
      setIsUploading(true); // Bắt đầu loading

      // BƯỚC 1: Upload ảnh lên Storage Server
      // (Hàm này giả lập delay và trả về URL)
      const remoteImageUrl = await uploadImage(imageUri);

      // BƯỚC 2: Gọi API tạo bài viết với URL ảnh đã upload
      createPost(CURRENT_USER_ID, remoteImageUrl, caption);

      // Reset form
      setCaption('');
      setImageUri(null);
      
      // Navigate về Feed
      navigation.navigate('Memory'); 

    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng bài. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsUploading(false); // Kết thúc loading
    }
  };

  return (
    <View style={styles.container}>
      <ComponentHeader 
        userAvatar={currentUser.avatar}
        renderCenter={() => (
          <TouchableOpacity style={styles.scopeBtn}>
            <Text style={styles.scopeText}>Everyone ▾</Text>
          </TouchableOpacity>
        )}
        renderRight={() => <View style={styles.inboxIcon} />}
      />

      <View style={styles.cameraArea}>
        <View style={styles.cameraPreview}>
          {isUploading ? (
            // Hiển thị loading khi đang upload
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffd700" />
              <Text style={styles.loadingText}>Đang đăng...</Text>
            </View>
          ) : imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.cameraImage} />
          ) : (
            <View style={styles.cameraPlaceholder} />
          )}
        </View>
        
        {/* Overlay Icons */}
        {!isUploading && (
          <>
            <View style={styles.cameraOverlayLeft}>
              <Ionicons name="leaf" size={18} color="#fff" />
            </View>
            <View style={styles.cameraOverlayRight}>
              <Text style={styles.zoomText}>1.0x</Text>
            </View>
          </>
        )}
      </View>

      {/* Bottom Control Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomIcon} disabled={isUploading}>
          <Ionicons name="image" size={22} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.shutter, 
            imageUri ? styles.shutterActive : null,
            isUploading ? styles.shutterDisabled : null
          ]}
          onPress={imageUri ? post : capture}
          disabled={isUploading}
        >
          {isUploading ? (
            <View style={styles.shutterInner} /> 
          ) : imageUri ? (
            <Ionicons name="paper-plane" size={30} color="#fff" /> // Icon gửi đi
          ) : (
            <View style={styles.shutterInner} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomIcon} disabled={isUploading}>
          <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Caption Input */}
      {imageUri && !isUploading ? (
        <View style={styles.emotionRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
          <TextInput
            style={styles.emotionInput}
            placeholder="Viết chú thích..."
            placeholderTextColor="#9aa6b2"
            value={caption}
            onChangeText={setCaption}
            editable={!isUploading}
          />
        </View>
      ) : null}
      
      <View style={styles.pullHandle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  scopeBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#1a1a1a', borderRadius: 16 },
  scopeText: { color: '#fff' },
  inboxIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#333' },
  
  cameraArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraPreview: { width: '86%', aspectRatio: 1, borderRadius: 24, overflow: 'hidden', backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  cameraImage: { width: '100%', height: '100%' },
  cameraPlaceholder: { flex: 1, width: '100%', backgroundColor: '#0b0b0b' },
  
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#ffd700', marginTop: 10, fontWeight: 'bold' },
  
  cameraOverlayLeft: { position: 'absolute', left: 24, top: '20%' },
  cameraOverlayRight: { position: 'absolute', right: 24, top: '20%' },
  zoomText: { color: '#fff' },
  
  bottomBar: { height: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  bottomIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  
  shutter: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: '#ffd700', alignItems: 'center', justifyContent: 'center' },
  shutterActive: { backgroundColor: '#ffd70022', borderColor: '#ffd700' },
  shutterDisabled: { opacity: 0.5, borderColor: '#555' },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
  
  emotionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  emotionInput: { flex: 1, marginLeft: 8, backgroundColor: '#111', color: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  pullHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#333', marginVertical: 8 },
});
