import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image, Modal, Dimensions, Alert } from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationApi, NotificationItem } from '../api/notification';
import { userApi } from '../api/user';
import { SocketService } from '../services/socket.service';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onUnreadCountChange?: () => void;
}

const { height } = Dimensions.get('window');
const NOTIFICATION_CACHE_KEY = 'cached_notifications';

const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load cached notifications on mount
  useEffect(() => {
    loadCachedNotifications();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    const socketService = SocketService.getInstance();
    const handleNewNotification = (notification: any) => {
      console.log('New notification received in modal:', notification);
      setNotifications(prev => {
        const newNotif = { ...notification, isRead: false, createdAt: new Date().toISOString() };
        const updated = [newNotif, ...prev];
        saveNotificationsToCache(updated);
        return updated;
      });
      // Optionally notify parent to update badge (though parent usually handles socket too)
      if (onUnreadCountChange) onUnreadCountChange();
    };

    socketService.on('new_notification', handleNewNotification);

    return () => {
      socketService.off('new_notification', handleNewNotification);
    };
  }, []);

  const loadCachedNotifications = async () => {
    try {
      const cached = await AsyncStorage.getItem(NOTIFICATION_CACHE_KEY);
      if (cached) {
        setNotifications(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Failed to load cached notifications:', error);
    }
  };

  const saveNotificationsToCache = async (items: NotificationItem[]) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_CACHE_KEY, JSON.stringify(items.slice(0, 50))); // Cache top 50
    } catch (error) {
      console.error('Failed to save notifications to cache:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications();
      let notifs: NotificationItem[] = [];
      
      if (Array.isArray(response)) {
        notifs = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        notifs = response.data;
      } else {
        notifs = [];
      }

      // Check if we need to fetch user details
      const senderIdsToFetch = new Set<string>();
      notifs.forEach(n => {
        if (typeof n.fromUserId === 'string') {
          senderIdsToFetch.add(n.fromUserId);
        }
      });

      if (senderIdsToFetch.size > 0) {
        const userMap = new Map();
        await Promise.all(Array.from(senderIdsToFetch).map(async (id) => {
          try {
            const user = await userApi.getUserById(id);
            if (user) {
              const userData = user.data || user; 
              userMap.set(id, userData);
            }
          } catch (e) {
            console.warn(`Failed to fetch user ${id}`, e);
          }
        }));

        notifs = notifs.map(n => {
          if (typeof n.fromUserId === 'string' && userMap.has(n.fromUserId)) {
            return { ...n, fromUserId: userMap.get(n.fromUserId) };
          }
          return n;
        });
      }

      setNotifications(notifs);
      saveNotificationsToCache(notifs);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Fallback to cache is handled by initial load, but maybe we shouldn't wipe state if error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('NotificationModal visible changed:', visible);
    if (visible) {
      setLoading(true);
      loadNotifications();
    }
  }, [visible]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => {
        const updated = prev.map(n => n._id === id ? { ...n, isRead: true } : n);
        saveNotificationsToCache(updated);
        return updated;
      });
      if (onUnreadCountChange) onUnreadCountChange();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, isRead: true }));
        saveNotificationsToCache(updated);
        return updated;
      });
      if (onUnreadCountChange) onUnreadCountChange();
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read', error);
      Alert.alert('Error', 'Failed to mark notifications as read');
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch(type) {
      case 'new_post': return 'Khoảnh khắc';
      case 'reaction': return 'Reacted to your post';
      case 'friend_request': return 'Lời mời kết bạn';
      case 'like': return 'Đã thích ảnh của bạn'; // Keep for backward compatibility
      case 'comment': return 'Commented on your post';
      case 'follow': return 'Started following you';
      case 'mention': return 'Mentioned you';
      default: return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    }
  };

  const getNotificationMessage = (item: NotificationItem) => {
    // If backend doesn't provide message, generate one
    switch(item.type) {
      case 'new_post': return 'đã có 1 khoảnh khắc';
      case 'reaction': return 'reacted to your photo';
      case 'friend_request': return 'muốn trở thành bạn bè';
      default: return '';
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const sender = typeof item.fromUserId === 'object' ? item.fromUserId : null;
    const senderName = sender?.username || 'User';
    const senderAvatar = sender?.avatarUrl || `https://ui-avatars.com/api/?name=${senderName}`;
    const message = getNotificationMessage(item);

    return (
      <TouchableOpacity 
        style={[styles.itemContainer, !item.isRead && styles.unreadItem]}
        onPress={() => handleMarkRead(item._id)}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: senderAvatar }} 
            style={styles.avatar} 
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.username}>{senderName}</Text>
            <Text style={styles.timeAgo}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.typeLabel}>{getNotificationTypeLabel(item.type)}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
                    <Ionicons name="checkmark-done-outline" size={24} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#FFD700" />
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
              }
              ListEmptyComponent={
                <View style={styles.center}>
                  <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
              }
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start', // Top alignment
  },
  overlayTouch: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#111',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: height * 0.7, // 70% of screen height
    width: '100%',
    paddingTop: 40, // More padding for top status bar area
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16
  },
  markAllBtn: {
      padding: 4
  },
  closeButton: {
    // position: 'absolute' removed to fit in flex layout
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    alignItems: 'center',
  },
  unreadItem: {
    backgroundColor: '#1a1a1a',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeAgo: {
    color: '#888',
    fontSize: 12,
  },
  typeLabel: {
    color: '#FFD700', // Gold color for type
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    color: '#ccc',
    fontSize: 14,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginLeft: 8,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default NotificationModal;
