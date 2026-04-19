import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { ScreenShell } from '@/components/ui/screen-shell';
import { login } from '@/api/auth';
import { getErrorMessage } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth-store';
import { showErrorToast, showSuccessToast } from '@/store/toast-store';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const setSession = useAuthStore((state) => state.setSession);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (session) => {
      await setSession(session);
      showSuccessToast({
        title: 'Welcome back',
        message: 'You are signed in.',
      });
      router.replace('/(tabs)');
    },
    onError: (error) => {
      showErrorToast({
        title: 'Login failed',
        message: getErrorMessage(error, 'Check your details and try again.'),
      });
    },
  });

  const submit = () => {
    loginMutation.mutate({
      identifier,
      password: secret,
    });
  };

  return (
    <ScreenShell scroll={false}>
      <View className="flex-1 justify-between pb-8">
        <View className="gap-7">
          <LinearGradient
            colors={['#6AA8FF', '#2563EB', '#132B62']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="overflow-hidden rounded-[38px] p-6 shadow-float">
            <View className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <View className="absolute bottom-10 right-8 h-20 w-20 rounded-full bg-white/10" />

            <View className="flex-row items-start justify-between">
              <View className="h-14 w-14 items-center justify-center rounded-[18px] bg-white/15">
                <Ionicons name="wallet" size={30} color="#FFFFFF" />
              </View>
              <View className="rounded-full bg-white/15 px-4 py-2">
                <Text className="text-xs font-black uppercase tracking-[1.5px] text-white">
                  Shared Wallet
                </Text>
              </View>
            </View>

            <Text className="mt-8 text-4xl font-black text-white">Flat Wallet</Text>
            <Text className="mt-2 max-w-[250px] text-base font-semibold leading-6 text-white/80">
              Modern shared finance, shaped into a clear daily flow for your flat.
            </Text>

            <View className="mt-7 rounded-[26px] bg-white/14 p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs font-black uppercase tracking-[1.6px] text-white/70">
                    Monthly Snapshot
                  </Text>
                  <Text className="mt-2 text-3xl font-black text-white">12,450</Text>
                </View>
                <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-white/15">
                  <Ionicons name="trending-up" size={24} color="#FFFFFF" />
                </View>
              </View>

              <View className="mt-5 flex-row gap-3">
                {[
                  { icon: 'person-circle', label: 'Username' },
                  { icon: 'mail', label: 'Email' },
                  { icon: 'call', label: 'Phone' },
                ].map((item) => (
                  <View className="flex-1 rounded-[20px] bg-white/12 px-3 py-3" key={item.label}>
                    <Ionicons
                      color="#FFFFFF"
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={17}
                    />
                    <Text className="mt-3 text-xs font-black uppercase tracking-[1.2px] text-white/80">
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>

          <View className="rounded-[34px] border border-white/80 bg-panel/90 p-5 shadow-float">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-black text-ink">Sign In</Text>
                <Text className="mt-1 text-sm text-mute">
                  Use username, phone, or email with your password.
                </Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-skySoft">
                <Ionicons color="#2563EB" name="sparkles" size={22} />
              </View>
            </View>

            <View className="mt-5 rounded-[24px] bg-addSoft/70 p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-[16px] bg-panel">
                  <Ionicons color="#2563EB" name="shield-checkmark" size={22} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-ink">Easy sign-in</Text>
                  <Text className="mt-1 text-sm text-mute">
                    No PIN step anymore. One password keeps the flow simple.
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-6 gap-4">
              <AppInput
                autoCapitalize="none"
                icon="person"
                label="Login name"
                onChangeText={setIdentifier}
                placeholder="admin, +123..., or you@email.com"
                value={identifier}
              />
              <AppInput
                icon="lock-closed"
                label="Password"
                onChangeText={setSecret}
                placeholder="Your password"
                secureTextEntry
                value={secret}
              />
            </View>
          </View>
        </View>

        <AppButton
          disabled={!identifier || !secret || loginMutation.isPending}
          label={loginMutation.isPending ? 'Opening...' : 'Open Wallet'}
          onPress={submit}
        />
      </View>
    </ScreenShell>
  );
}
