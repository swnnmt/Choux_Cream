import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const [streakEnabled, setStreakEnabled] = useState(false);

  const handleLogout = () => {
    // Reset navigation stack and go to LoginScreen (in Auth stack) or directly Auth
    // Assuming 'Auth' is the name of the stack in App.tsx containing LoginScreen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const renderSectionHeader = (icon: string, title: string) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color="#fff" style={styles.sectionIcon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderItem = (
    icon: string,
    title: string,
    subtitle?: string,
    hasSwitch?: boolean,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {hasSwitch ? (
        <Switch
          value={streakEnabled}
          onValueChange={setStreakEnabled}
          trackColor={{ false: '#3e3e3e', true: '#fff' }}
          thumbColor={streakEnabled ? '#000' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="arrow-forward" size={16} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Widgets Section */}
        {renderSectionHeader('happy-outline', 'Widgets')}
        <View style={styles.sectionContainer}>
          {renderItem('settings-outline', 'Widget Settings', 'Customize your home screen widget')}
        </View>

        {/* Customize Section */}
        {renderSectionHeader('build-outline', 'Customize')}
        <View style={styles.sectionContainer}>
          {renderItem('color-palette-outline', 'App Icon', 'Choose from 12 beautiful app icons')}
          <View style={styles.separator} />
          {renderItem('moon-outline', 'Theme', 'Switch between light, dark, or auto mode')}
          <View style={styles.separator} />
          {renderItem('flame-outline', 'Streak on widget', 'Personalize with your favorite colors', true)}
        </View>

        {/* General Section */}
        {renderSectionHeader('settings-sharp', 'General')}
        <View style={styles.sectionContainer}>
          {renderItem('person-outline', 'Edit Profile Picture', 'Update your profile photo')}
          <View style={styles.separator} />
          {renderItem('text-outline', 'Edit Name', 'Change your display name')}
          <View style={styles.separator} />
          {renderItem('calendar-outline', 'Edit Birthday', 'Set or update your birth date')}
          <View style={styles.separator} />
          {renderItem('call-outline', 'Change Phone Number', 'Update your contact number')}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>StarMe v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
      padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 24,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#111',
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemSubtitle: {
    color: '#888',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#222',
    marginLeft: 64, // Align with text start
  },
  logoutButton: {
      marginTop: 40,
      backgroundColor: '#1E1E22',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#333',
  },
  logoutText: {
      color: '#EF4444', // Red color for logout
      fontSize: 16,
      fontWeight: 'bold',
  },
  versionText: {
      color: '#444',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 12,
  }
});

export default SettingsScreen;
