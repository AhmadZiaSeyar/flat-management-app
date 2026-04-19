import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pressable, Text, View } from 'react-native';
import { createUser, getRoles, getUsers, updateUserRoles, updateUserStatus } from '@/api/users';
import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionTitle } from '@/components/ui/section-title';
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
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [roleNames, setRoleNames] = useState<RoleName[]>(['Member']);

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
      setPassword('');
      setPin('');
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
      password,
      pin: pin || undefined,
      roleNames,
    });
  };

  if (!canViewUsers) {
    return (
      <ScreenShell>
        <SectionTitle subtitle="Admin tools only" title="Users" />
        <View className="rounded-[30px] bg-panel p-6">
          <Text className="text-2xl font-black text-ink">Only admins can edit people</Text>
          <Text className="mt-2 text-sm text-mute">
            This tab stays simple for members so no one changes roles by mistake.
          </Text>
          <View className="mt-5 rounded-[24px] bg-sand p-4">
            <Text className="text-sm font-bold text-mute">You</Text>
            <Text className="mt-1 text-xl font-black text-ink">{user?.fullName}</Text>
            <Text className="mt-1 text-sm text-mute">{user?.roles.join(', ')}</Text>
          </View>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <SectionTitle subtitle="Manage roommates and roles" title="Users" />

      {canCreateUsers ? (
        <View className="rounded-[30px] bg-panel p-5">
          <Text className="text-xl font-black text-ink">Add Person</Text>
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
              icon="lock-closed"
              label="Password"
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />
            <AppInput
              icon="keypad"
              keyboardType="number-pad"
              label="PIN"
              onChangeText={setPin}
              secureTextEntry
              value={pin}
            />
          </View>

          <View className="mt-5 flex-row gap-3">
            {(['Admin', 'Member'] as RoleName[]).map((role) => {
              const selected = roleNames.includes(role);
              return (
                <Pressable
                  key={role}
                  className={`rounded-full px-5 py-3 ${
                    selected ? 'bg-addSoft' : 'bg-sand'
                  }`}
                  onPress={() =>
                    setRoleNames((current) => {
                      if (current.includes(role)) {
                        return current.length === 1 ? current : current.filter((item) => item !== role);
                      }

                      return [...current, role];
                    })
                  }>
                  <Text className="text-sm font-black text-ink">{role}</Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-5">
            <AppButton
              disabled={!fullName || !password || createUserMutation.isPending}
              label={createUserMutation.isPending ? 'Adding...' : 'Create User'}
              onPress={submit}
            />
          </View>
        </View>
      ) : null}

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-xl font-black text-ink">Roommates</Text>
        <Text className="mt-1 text-sm text-mute">
          {rolesQuery.data?.length ? `${rolesQuery.data.length} role options loaded` : 'Shared people list'}
        </Text>

        <View className="mt-5 gap-4">
          {(usersQuery.data ?? []).map((member) => (
            <View className="rounded-[24px] bg-sand p-4" key={member.id}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-black text-ink">{member.fullName}</Text>
                  <Text className="text-sm text-mute">
                    {member.username || member.phone || 'No login label'}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-2 ${
                    member.isActive ? 'bg-addSoft' : 'bg-spendSoft'
                  }`}>
                  <Text className="text-xs font-black text-ink">
                    {member.isActive ? 'Active' : 'Off'}
                  </Text>
                </View>
              </View>

              <Text className="mt-3 text-xs font-bold uppercase tracking-widest text-mute">
                {member.roles.join(' • ')}
              </Text>
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
                            selected ? 'bg-skySoft' : 'bg-panel'
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
                          <Text className="text-sm font-black text-ink">{role}</Text>
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
