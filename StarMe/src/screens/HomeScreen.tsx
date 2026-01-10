import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Text, Dimensions, StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Memory } from '../types/memory';
import StarDetailModal from '../components/StarDetailModal';
import ComponentHeader from '../components/ComponentHeader';
import { 
  CURRENT_USER_ID, 
  getFriendsFeed,
  getMyProfile,
  User,
  postToMemory
} from '../api/mockBackend';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  
  // Get data from Mock Backend
  const currentUser = getMyProfile();
  
  // Feed Data (Friends' posts) - Auto refresh when screen focused
  useFocusEffect(
    useCallback(() => {
      const loadFeed = () => {
        const posts = getFriendsFeed(CURRENT_USER_ID);
        const mappedMemories = posts.map(post => postToMemory(post, post.userDetails));
        setMemories(mappedMemories);
      };
      
      loadFeed();
      
      // Cleanup function (optional)
      return () => {};
    }, [])
  );

  const renderFeedItem = ({ item }: { item: Memory }) => (
    <View style={styles.feedCard}>
       {/* Card Header */}
       <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
             <Image 
                source={{ uri: item.author?.avatar || `https://ui-avatars.com/api/?name=${item.userId}&background=random` }} 
                style={styles.userAvatar} 
             />
             <View>
                <Text style={styles.userName}>{item.author?.username || item.userId}</Text>
                <Text style={styles.timeAgo}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
             </View>
          </View>
          <TouchableOpacity>
             <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
          </TouchableOpacity>
       </View>

       {/* Main Image */}
       <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedMemory(item)} style={styles.imageContainer}>
          {item.media && item.media.length > 0 && item.media[0].url ? (
            <Image source={{ uri: item.media[0].url }} style={styles.cardImage} resizeMode="cover" />
          ) : (
             <View style={[styles.cardImage, { backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="image-outline" size={40} color="#666" />
             </View>
          )}
          {item.text ? (
             <View style={styles.overlayTextContainer}>
                <Text style={styles.overlayText}>{item.text}</Text>
             </View>
          ) : null}
       </TouchableOpacity>

       {/* Action Bar */}
       <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.reactions}>
             <Text style={styles.reactionEmoji}>❤️</Text>
             <Text style={styles.reactionEmoji}>🔥</Text>
          </View>
       </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ComponentHeader 
        userAvatar={currentUser.avatar}
        renderCenter={() => <Text style={styles.headerTitle}>Locket Feed</Text>}
      />

      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedMemory && (
        <StarDetailModal
          visible={!!selectedMemory}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  listContent: { paddingBottom: 80 },
  feedCard: { marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  timeAgo: { color: '#888', fontSize: 12 },
  imageContainer: { width: width, height: width * 1.25, backgroundColor: '#111', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  overlayTextContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  overlayText: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  actionBtn: { padding: 4 },
  reactions: { flexDirection: 'row', gap: 8 },
  reactionEmoji: { fontSize: 18 },
});
