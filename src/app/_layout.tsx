import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { SignalRProvider } from '@/src/hooks/signalR';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
      SplashScreen.hideAsync();
  }, [loaded]);

  return (
    <SignalRProvider>
  
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{
                title: 'Devices',
            }}
          />
          <Stack.Screen name="homepage" options={{
                title: 'Home',
            }}
          />
          <Stack.Screen name="loginScreen" options={{
                title: 'Login',
            }}
          />
          <Stack.Screen name="createAccountScreen" options={{
                title: 'CreateAcocount',
            }}
          />
          {/*<Stack.Screen name="tokenScreen" options={{*/}
          {/*  title: 'Token',*/}
          {/*  }}*/}
          {/*/>*/}
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    
    </SignalRProvider>
  );
}
