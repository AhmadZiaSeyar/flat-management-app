import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
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
          height: 80,
          left: 18,
          position: 'absolute',
          right: 18,
          borderRadius: 30,
          shadowColor: '#0F1E37',
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.12,
          shadowRadius: 28,
          elevation: 14,
          paddingBottom: 12,
          paddingTop: 12,
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
          tabBarIcon: ({ focused }) => (
            <View
              className={`-mt-7 h-[68px] w-[68px] items-center justify-center rounded-full ${
                focused ? 'bg-add' : 'bg-sky'
              }`}>
              <Ionicons color="#FFFFFF" name="add" size={30} />
            </View>
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
