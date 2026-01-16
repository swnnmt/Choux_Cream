import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import ComponentHeader from '../components/ComponentHeader';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { postApi } from '../api/post';
import { userApi } from '../api/user';
import { Memory } from '../types/memory';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user: currentUser, loading } = useCurrentUser();
  const navigation = useNavigation<any>();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setMemories([]);
        setFriendCount(0);
        return;
      }

      try {
        const posts = await postApi.getMemories();

        if (Array.isArray(posts)) {
          const mapped: Memory[] = posts.map((post: any) => {
            const userData = post.user || post.userId || currentUser;
            return {
              id: post._id,
              userId: userData?._id || userData,
              text: post.caption,
              media: post.imageUrl ? [{ type: 'image', url: post.imageUrl }] : [],
              createdAt: post.createdAt,
              x: Math.random(),
              y: Math.random(),
              author:
                userData && typeof userData === 'object'
                  ? {
                      username: userData.username,
                      avatar: userData.avatar || userData.avatarUrl,
                    }
                  : undefined,
            };
          });
          setMemories(mapped);
        } else {
          setMemories([]);
        }

        const friendsResponse = await userApi.getFriends();
        let friendsList: any[] = [];

        if (Array.isArray(friendsResponse)) {
          friendsList = friendsResponse;
        } else if (friendsResponse && Array.isArray(friendsResponse.data)) {
          friendsList = friendsResponse.data;
        }

        setFriendCount(friendsList.length);
      } catch (error) {
        setMemories([]);
        setFriendCount(0);
      }
    };

    fetchData();
  }, [currentUser]);

  const renderHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: currentUser.avatarUrl || currentUser.avatar }} style={styles.avatar} />
      </View>
      <Text style={styles.username}>{currentUser.username}</Text>
      <Text style={styles.email}>{currentUser.email}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
           <Text style={styles.statNumber}>{memories.length}</Text>
           <Text style={styles.statLabel}>Memories</Text>
        </View>
        <View style={styles.statItem}>
           <Text style={styles.statNumber}>{friendCount}</Text>
           <Text style={styles.statLabel}>Friends</Text>
        </View>
      </View>
    </View>
  );

  if (loading && !currentUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  if (!currentUser) {
     return (
       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
         <Text style={{ color: '#fff' }}>Please login</Text>
       </View>
     );
  }

  return (
    <View style={styles.container}>
      <ComponentHeader 
        userAvatar={currentUser.avatarUrl || currentUser.avatar}
        renderCenter={() => <Text style={styles.headerTitle}>@{currentUser.username}</Text>}
        renderRight={() => (
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
             <Image source={{ uri: item.media?.[0]?.url }} style={styles.gridImage} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  profileHeader: { alignItems: 'center', paddingVertical: 20 },
  avatarContainer: { 
    width: 100, height: 100, borderRadius: 50, 
    borderWidth: 3, borderColor: '#333', 
    overflow: 'hidden', marginBottom: 12 
  },
  avatar: { width: '100%', height: '100%' },
  username: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { color: '#888', fontSize: 14, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 40, marginBottom: 10 },
  statItem: { alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12 },
  listContent: { paddingBottom: 20 },
  gridItem: { width: width / 3, height: width / 3, padding: 1 },
  gridImage: { width: '100%', height: '100%', backgroundColor: '#222' },
});
