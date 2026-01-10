import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import TabNavigator
import TabNavigator from './src/navigation/TabNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          barStyle={'light-content'} // Force light content for dark theme
          backgroundColor={'#000'}
        />

        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
            {/* Auth Flow */}
            <Stack.Screen name="Auth" component={AuthNavigator} />
            
            {/* Tab chính */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

            {/* sau này bạn có thể thêm màn khác như */}
            {/* <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
