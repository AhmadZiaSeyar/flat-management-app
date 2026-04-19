import { Redirect } from 'expo-router';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useAuthStore } from '@/store/auth-store';

export default function IndexScreen() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return <Redirect href={accessToken ? '/(tabs)' : '/(auth)/login'} />;
}
