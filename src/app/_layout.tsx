import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {Slot, Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { SignalRProvider } from '@/src/hooks/signalR';
import { SecureStoreProvider } from '@/src/providers/SecureStoreProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
      if(loaded){
          SplashScreen.hideAsync();
      }
  }, [loaded]);
  
  return (
    <SignalRProvider>
        <SecureStoreProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Slot/>
            </ThemeProvider>
        </SecureStoreProvider>
    </SignalRProvider>
  );
}
