import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  AppState,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
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
import { ToastNotification } from '../components/ToastNotification';
import { postApi } from '../api/post';
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
  const [loading, setLoading] = useState(false);

  const updateUnreadCount = useCallback(async () => {
    try {
      const { count } = await notificationApi.getUnreadCount();
      setUnreadCount(count || 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const socketService = SocketService.getInstance();
        socketService.connect(token);

        const handleNewNotification = (data: any) => {
          setUnreadCount(prev => prev + 1);

          let msg = 'You have a new notification';
          if (data.type === 'new_post')
            msg = `${data.fromUserId?.username || 'Someone'} đã có 1 khoảnh khắc mới`;
          else if (data.type === 'reaction')
            msg = `${data.fromUserId?.username || 'Someone'} đã phản hồi ảnh của bạn`;
          else if (data.type === 'friend_request')
            msg = `${data.fromUserId?.username || 'Someone'} đã gửi lời mời kết bạn`;

          setToastMessage(msg);
          setToastVisible(true);
        };

        socketService.on('new_notification', handleNewNotification);

        return () => {
          socketService.off('new_notification', handleNewNotification);
        };
      } catch (e) {
        console.log('Socket error', e);
      }
    };

    initSocket();

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') updateUnreadCount();
    });

    updateUnreadCount();

    return () => sub.remove();
  }, [updateUnreadCount]);

  /* ================= FETCH FEED ================= */
  const fetchFeed = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    try {
      const res = await postApi.getFeed();
      const posts = res?.data || res;

      if (!Array.isArray(posts)) {
        if (!isLoadMore) setMemories([]);
        return;
      }

      const mapped: Memory[] = posts.map((post: any) => {
        const userData = post.user || post.userId;
        return {
          id: post._id,
          userId: userData?._id || userData,
          text: post.caption,
          media: post.imageUrl
            ? [{ type: 'image', url: post.imageUrl }]
            : [],
          createdAt: post.createdAt,
          x: Math.random(),
          y: Math.random(),
          author: userData && typeof userData === 'object'
            ? {
                username: userData.username,
                avatar: userData.avatarUrl,
              }
            : undefined,
        };
      });

      if (isLoadMore) {
        setMemories(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = mapped.filter(p => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      } else {
        setMemories(mapped);
      }
    } catch (e) {
      if (!isLoadMore) Alert.alert('Error', 'Failed to load feed');
    } finally {
      if (!isLoadMore) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFeed();
    }, [fetchFeed])
  );

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // Pull to refresh at start (Pull Right)
    if (offsetX < -80 && !loading) {
      fetchFeed(false);
    }
  };

  /* ================= RENDER ITEM ================= */
  const renderFeedItem = ({ item }: { item: Memory }) => (
    <View style={styles.fullScreenItem}>
      {/* Image Container */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedMemory(item)}
          style={styles.imageWrapper}
        >
          {item.media?.[0]?.url ? (
            <Image
              source={{ uri: item.media[0].url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mainImage, styles.emptyImage]}>
              <Ionicons name="image-outline" size={60} color="#333" />
            </View>
          )}

          {/* Text Overlay */}
          {item.text ? (
            <View style={styles.textOverlay}>
              <Text style={styles.overlayText} numberOfLines={3}>
                {item.text}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* User Info (Below Image) */}
      <View style={styles.userInfoContainer}>
        <Image
          source={{
            uri:
              item.author?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                item.author?.username || 'User'
              )}`,
          }}
          style={styles.avatarSmall}
        />
        <Text style={styles.usernameSmall}>
          {item.author?.username || 'User'}
        </Text>
        <Text style={styles.timeSmall}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageInput} activeOpacity={0.8}>
          <Text style={styles.placeholderText}>Gửi tin nhắn...</Text>
        </TouchableOpacity>
        
        <View style={styles.reactionContainer}>
          <TouchableOpacity style={styles.reactionButton}>
             <Ionicons name="heart" size={28} color="#FFD700" />
          </TouchableOpacity>
           <TouchableOpacity style={styles.reactionButton}>
             <Ionicons name="flame" size={28} color="#FF4500" />
          </TouchableOpacity>
           <TouchableOpacity style={styles.reactionButton}>
             <Ionicons name="happy" size={28} color="#FF69B4" />
          </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Choux Cream</Text>
        )}
        renderRight={() => (
          <TouchableOpacity
            style={styles.bellContainer}
            onPress={() => setShowNotifications(true)}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="small" color="#FFD700" />
      </View>

      <FlatList
        data={memories}
        keyExtractor={item => item.id}
        renderItem={renderFeedItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        overScrollMode="always"
        onEndReached={() => fetchFeed(true)}
        onEndReachedThreshold={0.5}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        ListEmptyComponent={
          loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <Text style={{ color: '#888', textAlign: 'center' }}>
                No moments yet
              </Text>
            </View>
          )
        }
      />

      {selectedMemory && (
        <StarDetailModal
          visible
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

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerTitle: { color: '#FFD700', fontSize: 20, fontWeight: 'bold' },

  fullScreenItem: {
    width: width,
    flex: 1, // Ensure it takes vertical space
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  cardContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imageWrapper: {
    width: width * 0.9,
    height: width * 1.15, // Tall aspect ratio
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  emptyImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  textOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    fontWeight: '600',
  },

  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  usernameSmall: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  timeSmall: {
    color: '#888',
    fontSize: 12,
  },

  bottomBar: {
    flexDirection: 'row',
    width: width * 0.9,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  reactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionButton: {
    marginLeft: 12,
  },

  centerContainer: {
    width: width,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bellContainer: { marginRight: 16 },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  loadingIndicator: {
    position: 'absolute',
    left: 20,
    top: width * 0.6,
    zIndex: -1,
  },
});
