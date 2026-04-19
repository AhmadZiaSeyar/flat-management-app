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
        tabBarActiveTintColor: '#16855D',
        tabBarInactiveTintColor: '#8E8373',
        tabBarStyle: {
          backgroundColor: '#FFF9F0',
          borderTopWidth: 0,
          height: 86,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
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
              className={`-mt-6 h-16 w-16 items-center justify-center rounded-full ${
                focused ? 'bg-add' : 'bg-ink'
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
