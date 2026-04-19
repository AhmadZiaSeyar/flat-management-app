import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastViewport } from '@/components/ui/toast-viewport';
import { useAuthStore } from '@/store/auth-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastViewport />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
