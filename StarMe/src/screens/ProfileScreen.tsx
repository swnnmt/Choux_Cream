import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMyProfile, getUserMemories, postToMemory } from '../api/mockBackend';
import ComponentHeader from '../components/ComponentHeader';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const currentUser = getMyProfile();
  const navigation = useNavigation<any>();
  
  const memories = useMemo(() => {
    const posts = getUserMemories(currentUser._id);
    return posts.map(p => postToMemory(p, currentUser));
  }, [currentUser]);

  const renderHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
      </View>
      <Text style={styles.username}>{currentUser.username}</Text>
      <Text style={styles.email}>{currentUser.email}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
           <Text style={styles.statNumber}>{memories.length}</Text>
           <Text style={styles.statLabel}>Memories</Text>
        </View>
        <View style={styles.statItem}>
           <Text style={styles.statNumber}>120</Text>
           <Text style={styles.statLabel}>Friends</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ComponentHeader 
        userAvatar={currentUser.avatar}
        renderCenter={() => <Text style={styles.headerTitle}>Profile</Text>}
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
