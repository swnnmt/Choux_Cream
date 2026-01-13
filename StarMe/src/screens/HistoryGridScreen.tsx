import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Platform, StatusBar, Modal, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFriends, CURRENT_USER_ID, User } from '../api/mockBackend';
import { postApi } from '../api/post';
import ComponentHeader from '../components/ComponentHeader';
import StarDetailModal from '../components/StarDetailModal';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Memory } from '../types/memory';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HistoryGridScreen() {
  const { user: currentUser } = useCurrentUser();
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter State
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState<string>('all'); // 'all' or userId
  const [currentFilterName, setCurrentFilterName] = useState<string>('Everyone');

  // Friends Data for Filter
  const friends = useMemo(() => getFriends(CURRENT_USER_ID), []);
  const filterUsers = useMemo(() => [
    { _id: 'all', username: 'Everyone', avatar: '' }, 
    ...(currentUser ? [currentUser] : []), 
    ...friends
  ], [currentUser, friends]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      let posts = [];
      if (currentFilterId === 'all') {
        // If 'all', fetch feed (friends + me) or just use the same feed API
        // Reusing getFeed from postApi which returns friends' posts
        // But "History" usually means *MY* posts or specific user posts.
        // If "Everyone", let's assume it matches the Feed logic for now, or just My Posts?
        // Let's stick to "My Posts" + Friends if 'all' means Feed Grid.
        // Actually, let's use getFeed() for 'all' to be consistent with "Everyone".
        posts = await postApi.getFeed();
      } else {
        // Fetch specific user's posts
        posts = await postApi.getUserPosts(currentFilterId);
      }

      if (Array.isArray(posts)) {
         const mappedMemories: Memory[] = posts.map((post: any) => ({
          id: post._id,
          userId: post.user?._id || post.user,
          text: post.caption,
          media: post.imageUrl ? [{ type: 'image', url: post.imageUrl }] : [],
          createdAt: post.createdAt,
          x: Math.random(),
          y: Math.random(),
          author: post.user && typeof post.user === 'object' ? {
            username: post.user.username,
            avatar: post.user.avatar || post.user.avatarUrl
          } : undefined
        }));
        // Sort by new
        mappedMemories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMemories(mappedMemories);
      } else {
        setMemories([]);
      }
    } catch (error) {
      console.error('Failed to load history', error);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }, [currentFilterId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  
  const onSelectFilter = (user: any) => {
    setCurrentFilterId(user._id);
    setCurrentFilterName(user.username);
    setFilterVisible(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.gridItem} 
      onPress={() => setSelectedMemory(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.media?.[0]?.url }} 
        style={styles.gridImage} 
        resizeMode="cover"
      />
      {/* Optional: Show small avatar if it's 'all' view to distinguish users */}
      {currentFilterId === 'all' && (
        <View style={styles.miniAvatarContainer}>
           <Image source={{ uri: item.author?.avatar }} style={styles.miniAvatar} />
        </View>
      )}
    </TouchableOpacity>
  );

  // Custom Center Component for Header (Filter Button)
  const FilterBtn = () => (
    <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
      <Text style={styles.filterText}>{currentFilterName}</Text>
      <Ionicons name="chevron-down" size={16} color="#fff" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ComponentHeader 
        userAvatar={currentUser?.avatarUrl || currentUser?.avatar}
        renderCenter={() => <FilterBtn />}
        onChatPress={() => {}} // Dummy action
      />
      
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchHistory} tintColor="#fff" />
        }
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center', marginTop: 50 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#FFD700" />
            ) : (
              <Text style={{ color: '#888', textAlign: 'center' }}>
                No history found.{'\n'}Try selecting a different user.
              </Text>
            )}
          </View>
        }
      />

      {selectedMemory && (
        <StarDetailModal
          visible={!!selectedMemory}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterVisible} animationType="fade" transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <View style={styles.filterModalContent}>
            <Text style={styles.modalTitle}>Select User</Text>
            <FlatList
              data={filterUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.filterItem} onPress={() => onSelectFilter(item)}>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.filterAvatar} />
                  ) : (
                    <View style={[styles.filterAvatar, { backgroundColor: '#333' }]} />
                  )}
                  <Text style={[
                    styles.filterItemText, 
                    item._id === currentFilterId && { color: '#FFD700', fontWeight: 'bold' }
                  ]}>
                    {item.username}
                  </Text>
                  {item._id === currentFilterId && <Ionicons name="checkmark" size={20} color="#FFD700" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  listContent: { paddingTop: 10, paddingBottom: 80 },
  gridItem: { width: width / 3, height: width / 3 * 1.5, padding: 1, position: 'relative' },
  gridImage: { width: '100%', height: '100%', backgroundColor: '#222' },
  miniAvatarContainer: { position: 'absolute', bottom: 8, left: 8, width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#fff', overflow: 'hidden' },
  miniAvatar: { width: '100%', height: '100%' },
  
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  filterText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  filterModalContent: { width: '80%', maxHeight: '60%', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  filterItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  filterAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  filterItemText: { color: '#fff', fontSize: 16, flex: 1 },
});
