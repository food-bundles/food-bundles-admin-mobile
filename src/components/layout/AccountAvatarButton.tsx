import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useT } from '@/i18n';
import { AccountPanel } from './AccountPanel';

export interface AccountAvatarButtonProps {
  avatarUri: string;
}

/** Header avatar: tapping opens the AccountPanel bottom sheet instead of doing nothing. */
export function AccountAvatarButton({ avatarUri }: AccountAvatarButtonProps) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t('account.title')}
        style={styles.hitArea}
      >
        <Image source={{ uri: avatarUri }} style={styles.avatar} accessibilityLabel={t('account.title')} />
      </Pressable>
      <AccountPanel visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  hitArea: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
});
