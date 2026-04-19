import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Pressable, Text, View } from 'react-native';
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
  const loginMode = useAuthStore((state) => state.loginMode);
  const setLoginMode = useAuthStore((state) => state.setLoginMode);
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
      password: loginMode === 'password' ? secret : undefined,
      pin: loginMode === 'pin' ? secret : undefined,
    });
  };

  return (
    <ScreenShell scroll={false}>
      <View className="flex-1 justify-between pb-8">
        <View className="gap-6">
          <LinearGradient
            colors={['#16855D', '#0E5A45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[34px] p-6">
            <View className="h-14 w-14 items-center justify-center rounded-[18px] bg-white/15">
              <Ionicons name="wallet" size={30} color="#FFFFFF" />
            </View>
            <Text className="mt-6 text-4xl font-black text-white">Flat Wallet</Text>
            <Text className="mt-2 text-base font-semibold text-white/80">
              Shared home money, made easy.
            </Text>
          </LinearGradient>

          <View className="rounded-[30px] bg-panel p-5">
            <Text className="text-lg font-black text-ink">Enter</Text>
            <Text className="mt-1 text-sm text-mute">Use name, phone, or PIN.</Text>

            <View className="mt-5 flex-row gap-3">
              <Pressable
                className={`flex-1 rounded-[20px] px-4 py-4 ${
                  loginMode === 'password' ? 'bg-skySoft' : 'bg-sand'
                }`}
                onPress={() => {
                  setSecret('');
                  setLoginMode('password');
                }}>
                <Ionicons
                  color={loginMode === 'password' ? '#2C69D1' : '#716759'}
                  name="lock-closed"
                  size={22}
                />
                <Text className="mt-2 text-base font-black text-ink">Password</Text>
              </Pressable>
              <Pressable
                className={`flex-1 rounded-[20px] px-4 py-4 ${
                  loginMode === 'pin' ? 'bg-goldSoft' : 'bg-sand'
                }`}
                onPress={() => {
                  setSecret('');
                  setLoginMode('pin');
                }}>
                <Ionicons
                  color={loginMode === 'pin' ? '#D9A21B' : '#716759'}
                  name="keypad"
                  size={22}
                />
                <Text className="mt-2 text-base font-black text-ink">PIN</Text>
              </Pressable>
            </View>

            <View className="mt-5 gap-4">
              <AppInput
                autoCapitalize="none"
                icon="person"
                label="User or phone"
                onChangeText={setIdentifier}
                placeholder="admin or +123..."
                value={identifier}
              />
              <AppInput
                icon={loginMode === 'password' ? 'lock-closed' : 'keypad'}
                keyboardType={loginMode === 'password' ? 'default' : 'number-pad'}
                label={loginMode === 'password' ? 'Password' : 'PIN'}
                onChangeText={setSecret}
                placeholder={loginMode === 'password' ? 'Your password' : '4 to 6 digits'}
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
