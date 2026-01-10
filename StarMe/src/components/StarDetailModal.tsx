import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Memory } from '../types/memory';

type Props = {
  visible: boolean;
  memory?: Memory | null;
  onClose: () => void;
};

export default function StarDetailModal({ visible, memory, onClose }: Props) {
  if (!memory) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.title}>{memory.title || '✨ Kỷ niệm của bạn'}</Text>
            <Text style={styles.date}>
              {memory.createdAt ? new Date(memory.createdAt).toLocaleString() : 'Không rõ ngày'}
            </Text>

            {memory.media?.[0]?.url && (
              <Image source={{ uri: memory.media[0].url }} style={styles.image} resizeMode="cover" />
            )}

            <Text style={styles.text}>{memory.text || 'Không có ghi chú.'}</Text>
            {memory.emotion && <Text style={styles.emotion}>Cảm xúc: {memory.emotion}</Text>}
            {memory.privacy && <Text style={styles.privacy}>Quyền riêng tư: {memory.privacy}</Text>}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#0b1220',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  date: { color: '#9aa6b2', marginBottom: 12, fontSize: 12 },
  image: { height: 180, borderRadius: 8, marginBottom: 12 },
  text: { color: '#e6eef6', marginBottom: 12 },
  emotion: { color: '#ffd166', marginBottom: 6 },
  privacy: { color: '#9aa6b2', marginBottom: 12 },
  closeBtn: {
    backgroundColor: '#2b6cff',
    padding: 14,
    alignItems: 'center',
  },
});
