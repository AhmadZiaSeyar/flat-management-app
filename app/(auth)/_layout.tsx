import { Redirect, Stack } from 'expo-router';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useAuthStore } from '@/store/auth-store';

export default function AuthLayout() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (accessToken) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
