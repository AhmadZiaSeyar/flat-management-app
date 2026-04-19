import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useAuthStore } from '@/store/auth-store';

export default function TabsLayout() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#7B89A1',
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.88)',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          bottom: 18,
          height: 82,
          left: 18,
          position: 'absolute',
          right: 18,
          borderRadius: 32,
          shadowColor: '#0F1E37',
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.12,
          shadowRadius: 28,
          elevation: 14,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons color={color} name="home" size={24} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
            marginTop: 2,
          },
          tabBarIcon: ({ focused }) => (
            <LinearGradient
              colors={focused ? ['#60A5FA', '#2563EB', '#1E40AF'] : ['#7DB8FF', '#3B82F6', '#1E40AF']}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -18,
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.28,
                shadowRadius: 22,
                elevation: 10,
              }}>
              <View className="h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-white/10">
                <Ionicons color="#FFFFFF" name="add" size={28} />
              </View>
            </LinearGradient>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <Ionicons color={color} name="pie-chart" size={24} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <Ionicons color={color} name="people" size={24} />,
        }}
      />
    </Tabs>
  );
}
