import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Platform, StatusBar, Modal, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMyProfile, getUserMemories, postToMemory, getFriends, CURRENT_USER_ID, User } from '../api/mockBackend';
import ComponentHeader from '../components/ComponentHeader';
import StarDetailModal from '../components/StarDetailModal';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HistoryGridScreen() {
  const currentUser = getMyProfile();
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  
  // Filter State
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState<string>('all'); // 'all' or userId
  const [currentFilterName, setCurrentFilterName] = useState<string>('Everyone');

  // Friends Data for Filter
  const friends = useMemo(() => getFriends(CURRENT_USER_ID), []);
  const filterUsers = useMemo(() => [
    { _id: 'all', username: 'Everyone', avatar: '' }, 
    currentUser, 
    ...friends
  ], [currentUser, friends]);

  // Filtered Memories
  const memories = useMemo(() => {
    // If 'all', we might want to show everyone's memories OR just mine?
    // Locket "History" usually implies MY history.
    // But user asked: "view friends list, click one -> show their photos".
    // So 'all' -> maybe just Friends Feed (or mixed history)?
    // Let's assume 'all' -> My History + Friends History (Feed Grid) OR just My History.
    // Given the prompt "view friends list", let's make the default view "My History" or "All Friends".
    // Let's go with: 'all' = My History (Standard Locket behavior for main grid is user-centric, but user asked for friend explorer).
    
    // Logic: 
    // If 'all': show current user's memories (or feed?). 
    // Let's follow the specific instruction: "view friends list... show their photos".
    // So default 'Everyone' might actually mean "All Friends Feed" or just "Me".
    // Let's try: 'all' -> All Friends Feed (Grid version).
    
    let posts;
    if (currentFilterId === 'all') {
      // Show my memories + friends memories (All Public/Friends posts)
      // For simplicity, let's just reuse getUserMemories for everyone in the list
      // Or better, let's filter POSTS directly.
      // Since we don't have a "getAllMemories" helper, let's iterate.
      // But wait, getFriendsFeed returns the feed. Let's use that for 'all' to show latest stuff.
      // OR better: Default to Current User if no filter selected?
      // The user wants to "view friends list".
      
      // Let's implement: 'all' -> Current User's History (Standard Profile Grid)
      // And then switch to friend.
      // OR 'all' -> Feed Grid.
      
      // Let's go with: 'all' -> All Friends + Me (Feed Grid).
      const allIds = [CURRENT_USER_ID, ...friends.map(f => f._id)];
      // We need a helper or just filter raw POSTS (we can import POSTS if we export it, or add helper)
      // For now, let's just use getUserMemories(currentUser) for default if logic is complex, 
      // BUT user wants to see friends.
      
      // Let's assume for 'all' we show the User's Own History (Locket style).
      // If they pick a friend, we show that friend's history.
      
      // Wait, "Everyone" implies... Everyone.
      // Let's stick to: 'all' -> Feed (Friends + Me).
      const { POSTS } = require('../api/mockBackend'); // Dynamic import to access raw data if needed or add helper
      posts = POSTS.filter((p: any) => allIds.includes(p.user));
    } else {
      posts = getUserMemories(currentFilterId);
    }
    
    // Sort by new
    posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Map to frontend memory
    return posts.map((p: any) => {
      // Find user for this post
      const author = filterUsers.find(u => u._id === p.user) || currentUser;
      return postToMemory(p, author as User);
    });
  }, [currentFilterId, filterUsers, currentUser, friends]);

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
        userAvatar={currentUser.avatar}
        renderCenter={() => <FilterBtn />}
        onChatPress={() => {}} // Dummy action
      />
      
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
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
