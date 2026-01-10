import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform, StatusBar, Text } from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ComponentHeaderProps {
  userAvatar?: string;
  onAvatarPress?: () => void;
  
  // Custom slots
  renderLeft?: () => React.ReactNode;
  renderCenter?: () => React.ReactNode;
  renderRight?: () => React.ReactNode;
  
  // Shortcuts
  title?: string;
  onChatPress?: () => void;
  
  containerStyle?: object;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({ 
  userAvatar,
  onAvatarPress,
  renderLeft,
  renderCenter,
  renderRight,
  title,
  onChatPress,
  containerStyle
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      {/* LEFT */}
      <View style={styles.leftContainer}>
        {renderLeft ? (
          renderLeft()
        ) : userAvatar ? (
          <TouchableOpacity onPress={onAvatarPress} style={styles.avatarContainer}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* CENTER */}
      <View style={styles.centerContainer}>
        {renderCenter ? (
          renderCenter()
        ) : title ? (
          <Text style={styles.title}>{title}</Text>
        ) : null}
      </View>

      {/* RIGHT */}
      <View style={styles.rightContainer}>
        {renderRight ? (
          renderRight()
        ) : onChatPress ? (
          <TouchableOpacity onPress={onChatPress} style={styles.iconBtn}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} /> // Placeholder balance
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    paddingBottom: 10,
    backgroundColor: 'transparent', // Can be overridden
    zIndex: 10,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconBtn: {
    padding: 4,
  },
});

export default ComponentHeader;
