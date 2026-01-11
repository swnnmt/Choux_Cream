import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Text, Dimensions, StatusBar, Platform, Animated, AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Memory } from '../types/memory';
import StarDetailModal from '../components/StarDetailModal';
import NotificationModal from '../components/NotificationModal';
import ComponentHeader from '../components/ComponentHeader';
import { SocketService } from '../services/socket.service';
import { notificationApi } from '../api/notification';
import {ToastNotification }from '../components/ToastNotification';
import { 
  CURRENT_USER_ID, 
  getFriendsFeed,
  User,
  postToMemory
} from '../api/mockBackend';
import { useCurrentUser } from '../hooks/useCurrentUser';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const { user } = useCurrentUser();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = useCallback(async () => {
    try {
      const { count } = await notificationApi.getUnreadCount();
      console.log('Unread count fetched:', count);
      setUnreadCount(count || 0);
    } catch (error) {
      console.log('Failed to fetch unread count');
      setUnreadCount(0);
    }
  }, []);

  // Socket Connection
  useEffect(() => {
    const initSocket = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const socketService = SocketService.getInstance();
                socketService.connect(token);
                
                const handleNewNotification = (data: any) => {
                  console.log('New notification received:', data);
                  setUnreadCount(prev => prev + 1);
                  
                  // Show toast
                  let msg = 'You have a new notification';
                  if (data.type === 'new_post') msg = `${data.fromUserId?.username || 'Someone'} posted a new photo`;
                  else if (data.type === 'reaction') msg = `${data.fromUserId?.username || 'Someone'} reacted to your photo`;
                  else if (data.type === 'friend_request') msg = `${data.fromUserId?.username || 'Someone'} sent you a friend request`;
                  
                  setToastMessage(msg);
                  setToastVisible(true);
                };

                socketService.on('new_notification', handleNewNotification);
                
                return () => {
                  socketService.off('new_notification', handleNewNotification);
                };
            }
        } catch (e) {
            console.error('Socket init failed', e);
        }
    };

    initSocket();
    
    // AppState listener to reconnect/refresh
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        updateUnreadCount();
      }
    });

    updateUnreadCount();

    return () => {
      subscription.remove();
    };
  }, []);
  
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
      <ToastNotification 
        visible={toastVisible} 
        message={toastMessage} 
        onPress={() => {
            setToastVisible(false);
            setShowNotifications(true);
        }}
        onClose={() => setToastVisible(false)}
      />

      <ComponentHeader 
        userAvatar={user?.avatarUrl || user?.avatar}
        renderCenter={() => (
          <Text style={styles.headerTitle}>Locket Feed</Text>
        )}
        renderRight={() => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity 
                    onPress={() => {
                        console.log('Notification button pressed');
                        setShowNotifications(true);
                    }} 
                    style={[styles.bellContainer, { marginRight: 16 }]}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        )}
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

      <NotificationModal 
        visible={showNotifications}
        onClose={() => {
            setShowNotifications(false);
            updateUnreadCount();
        }}
        onUnreadCountChange={updateUnreadCount}
      />
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
  
  // Header styles
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  bellContainer: { marginLeft: 8, position: 'relative' },
  badge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: '#FF3B30',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 1.5,
      borderColor: '#000',
      zIndex: 10,
      elevation: 2
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  // Toast styles
  toastContainer: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      left: 16,
      right: 16,
      zIndex: 9999,
      backgroundColor: 'transparent',
      alignItems: 'center'
  },
  toastContent: {
      backgroundColor: 'rgba(30, 30, 30, 0.95)',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      width: '100%',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
      borderWidth: 1,
      borderColor: '#333'
  },
  toastIcon: {
      marginRight: 12,
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      padding: 8,
      borderRadius: 20
  },
  toastTextContainer: { flex: 1 },
  toastTitle: { color: '#FFD700', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  toastMessage: { color: '#fff', fontSize: 13 }
});
