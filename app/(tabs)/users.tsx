import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { createUser, getRoles, getUsers, updateUserRoles, updateUserStatus } from '@/api/users';
import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { ScreenShell } from '@/components/ui/screen-shell';
import { getErrorMessage } from '@/lib/api-error';
import { formatLongDateLabel } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import { showErrorToast, showSuccessToast } from '@/store/toast-store';
import { RoleName } from '@/types/api';
import { useState } from 'react';

export default function UsersScreen() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const canViewUsers = user?.permissions.includes('view_user');
  const canCreateUsers = user?.permissions.includes('create_user');
  const canAssignRoles = user?.permissions.includes('assign_role');

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleNames, setRoleNames] = useState<RoleName[]>(['Member']);
  const hasLoginIdentifier = Boolean(username.trim() || phone.trim() || email.trim());

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: Boolean(canViewUsers),
  });
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    enabled: Boolean(canAssignRoles),
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async (createdUser) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setFullName('');
      setUsername('');
      setPhone('');
      setEmail('');
      setPassword('');
      setRoleNames(['Member']);
      showSuccessToast({
        title: 'User added',
        message: `${createdUser.fullName} is ready to join the flat.`,
      });
    },
    onError: (error) => {
      showErrorToast({
        title: 'Could not add user',
        message: getErrorMessage(error, 'Check the info and try again.'),
      });
    },
  });

  const updateRolesMutation = useMutation({
    mutationFn: ({ userId, nextRoles }: { userId: string; nextRoles: RoleName[] }) =>
      updateUserRoles(userId, nextRoles),
    onSuccess: async (updatedUser) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccessToast({
        title: 'Roles updated',
        message: `${updatedUser.fullName} now has ${updatedUser.roles.join(', ')} access.`,
      });
    },
    onError: (error) => {
      showErrorToast({
        title: 'Roles not updated',
        message: getErrorMessage(error, 'Try again in a moment.'),
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateUserStatus(userId, isActive),
    onSuccess: async (updatedUser) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccessToast({
        title: updatedUser.isActive ? 'User enabled' : 'User disabled',
        message: updatedUser.isActive
          ? `${updatedUser.fullName} can use the app again.`
          : `${updatedUser.fullName} is paused for now.`,
      });
    },
    onError: (error) => {
      showErrorToast({
        title: 'Status not updated',
        message: getErrorMessage(error, 'Try again in a moment.'),
      });
    },
  });

  const submit = () => {
    createUserMutation.mutate({
      fullName,
      username: username || undefined,
      phone: phone || undefined,
      email: email || undefined,
      password,
      roleNames,
    });
  };

  if (!canViewUsers) {
    return (
      <ScreenShell>
        <LinearGradient
          colors={['#72B6FF', '#2563EB', '#132B62']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="overflow-hidden rounded-[38px] p-6 shadow-float">
          <View className="absolute -left-10 top-2 h-28 w-28 rounded-full bg-white/14" />
          <View className="absolute right-4 top-10 h-24 w-24 rounded-full bg-white/10" />
          <Text className="text-xs font-black uppercase tracking-[2px] text-white/74">Admin tools</Text>
          <Text className="mt-3 text-[34px] font-black leading-10 text-white">Users</Text>
          <Text className="mt-2 text-sm text-white/74">
            This tab stays simple for members so no one changes roles by mistake.
          </Text>
          <View className="mt-6 rounded-[28px] border border-white/15 bg-white/12 p-5">
            <Text className="text-xs font-black uppercase tracking-[2px] text-white/72">You</Text>
            <Text className="mt-2 text-xl font-black text-white">{user?.fullName}</Text>
            <Text className="mt-1 text-sm text-white/74">{user?.roles.join(', ')}</Text>
          </View>
        </LinearGradient>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <LinearGradient
        colors={['#72B6FF', '#2563EB', '#132B62']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[38px] p-6 shadow-float">
        <View className="absolute -left-10 top-2 h-28 w-28 rounded-full bg-white/14" />
        <View className="absolute right-4 top-10 h-24 w-24 rounded-full bg-white/10" />

        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xs font-black uppercase tracking-[2px] text-white/74">
              Shared access
            </Text>
            <Text className="mt-3 text-[34px] font-black leading-10 text-white">Users</Text>
            <Text className="mt-2 text-sm text-white/74">
              Manage roommates and roles from one clear admin view.
            </Text>
          </View>
          <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-white/14">
            <Ionicons color="#FFFFFF" name="people" size={24} />
          </View>
        </View>

        <View className="mt-6 rounded-[28px] border border-white/15 bg-white/12 p-5">
          <Text className="text-xs font-black uppercase tracking-[2px] text-white/72">
            Room size
          </Text>
          <Text className="mt-3 text-2xl font-black text-white">{(usersQuery.data ?? []).length}</Text>
          <Text className="mt-2 text-sm font-semibold text-white/74">
            {rolesQuery.data?.length
              ? `${rolesQuery.data.length} role options loaded`
              : 'Shared people list ready'}
          </Text>
        </View>
      </LinearGradient>

      {canCreateUsers ? (
        <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
          <Text className="text-[26px] font-black text-ink">Add Person</Text>
          <Text className="mt-2 text-sm text-mute">
            Add at least one login name: username, phone, or email.
          </Text>
          <View className="mt-4 rounded-[26px] border border-white/70 bg-skySoft/90 p-4">
            <Text className="text-xs font-black uppercase tracking-[2px] text-sky">Cleaner sign-in</Text>
            <Text className="mt-2 text-sm text-mute">
              PIN is removed now, so roommates only need one password.
            </Text>
          </View>
          <View className="mt-5 gap-4">
            <AppInput icon="person" label="Full name" onChangeText={setFullName} value={fullName} />
            <AppInput
              autoCapitalize="none"
              icon="at"
              label="Username"
              onChangeText={setUsername}
              value={username}
            />
            <AppInput
              keyboardType="phone-pad"
              icon="call"
              label="Phone"
              onChangeText={setPhone}
              value={phone}
            />
            <AppInput
              autoCapitalize="none"
              icon="mail"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              value={email}
            />
            <AppInput
              icon="lock-closed"
              label="Password"
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />
          </View>

          <View className="mt-5 flex-row gap-3">
            {(['Admin', 'Member'] as RoleName[]).map((role) => {
              const selected = roleNames.includes(role);
              return (
                <Pressable
                  key={role}
                  className={`rounded-full px-5 py-3 ${
                    selected ? 'bg-sky shadow-card' : 'bg-sand'
                  }`}
                  onPress={() =>
                    setRoleNames((current) => {
                      if (current.includes(role)) {
                        return current.length === 1 ? current : current.filter((item) => item !== role);
                      }

                      return [...current, role];
                    })
                  }>
                  <Text className={`text-sm font-black ${selected ? 'text-white' : 'text-ink'}`}>
                    {role}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-5">
            <AppButton
              disabled={!fullName || !password || !hasLoginIdentifier || createUserMutation.isPending}
              label={createUserMutation.isPending ? 'Adding...' : 'Create User'}
              onPress={submit}
            />
          </View>
        </View>
      ) : null}

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <Text className="text-[26px] font-black text-ink">Roommates</Text>
        <Text className="mt-2 text-sm text-mute">
          {rolesQuery.data?.length ? `${rolesQuery.data.length} role options loaded` : 'Shared people list'}
        </Text>

        <View className="mt-5 gap-4">
          {(usersQuery.data ?? []).map((member) => (
            <View className="rounded-[28px] border border-white/70 bg-sand/90 p-4 shadow-card" key={member.id}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-black text-ink">{member.fullName}</Text>
                  <Text className="text-sm text-mute">
                    {member.email || member.username || member.phone || 'No login label'}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-2 ${
                    member.isActive ? 'bg-skySoft' : 'bg-spendSoft'
                  }`}>
                  <Text className={`text-xs font-black ${member.isActive ? 'text-sky' : 'text-spend'}`}>
                    {member.isActive ? 'Active' : 'Off'}
                  </Text>
                </View>
              </View>

              <Text className="mt-3 text-xs font-bold uppercase tracking-widest text-mute">
                {member.roles.join(' • ')}
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                {member.username ? (
                  <View className="rounded-full bg-panel px-3 py-2">
                    <Text className="text-xs font-bold text-ink">@{member.username}</Text>
                  </View>
                ) : null}
                {member.email ? (
                  <View className="rounded-full bg-panel px-3 py-2">
                    <Text className="text-xs font-bold text-ink">{member.email}</Text>
                  </View>
                ) : null}
                {member.phone ? (
                  <View className="rounded-full bg-panel px-3 py-2">
                    <Text className="text-xs font-bold text-ink">{member.phone}</Text>
                  </View>
                ) : null}
              </View>
              <Text className="mt-1 text-xs text-mute">Joined {formatLongDateLabel(member.createdAt)}</Text>

              {canAssignRoles ? (
                <View className="mt-4 gap-3">
                  <View className="flex-row gap-3">
                    {(['Admin', 'Member'] as RoleName[]).map((role) => {
                      const selected = member.roles.includes(role);

                      return (
                        <Pressable
                          key={role}
                          className={`rounded-full px-4 py-3 ${
                            selected ? 'bg-sky' : 'bg-panel'
                          }`}
                          onPress={() => {
                            const nextRoles = selected
                              ? member.roles.filter((item) => item !== role)
                              : [...member.roles, role];

                            if (!nextRoles.length) {
                              return;
                            }

                            updateRolesMutation.mutate({
                              userId: member.id,
                              nextRoles,
                            });
                          }}>
                          <Text className={`text-sm font-black ${selected ? 'text-white' : 'text-ink'}`}>
                            {role}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <AppButton
                    label={member.isActive ? 'Disable User' : 'Enable User'}
                    onPress={() =>
                      updateStatusMutation.mutate({
                        userId: member.id,
                        isActive: !member.isActive,
                      })
                    }
                    variant={member.isActive ? 'secondary' : 'primary'}
                  />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}
