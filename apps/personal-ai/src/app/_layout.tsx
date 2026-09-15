import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useSessions } from "@/lib/session-store";
import { useSettings } from "@/lib/settings-store";
import { useTheme, type ThemeColors } from "@/theme";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const settingsHydrated = useSettings((s) => s.hydrated);
  const sessionsHydrated = useSessions((s) => s.hydrated);

  useEffect(() => {
    void useSettings.getState().hydrate();
    void useSessions.getState().hydrate();
  }, []);

  const ready = (fontsLoaded || fontError) && settingsHydrated && sessionsHydrated;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  // Holding the splash until state is loaded keeps the first frame from
  // flashing an empty roster or the wrong engine badge.
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.canvas }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? 780 : undefined, alignSelf: "center", backgroundColor: colors.canvas }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.canvas },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="welcome" options={{ animation: "fade" }} />
          <Stack.Screen name="room/[id]" />
          <Stack.Screen
            name="agent/[id]"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
