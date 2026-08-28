import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import type { Farmer, FarmerStatus } from '@/mocks/farmers';

export interface FarmerActionsProps {
  farmer: Farmer;
  onChangeStatus: (status: FarmerStatus) => void;
}

/** Approve / Suspend actions, per the spec's "Approve / Suspend / Add product". */
export function FarmerActions({ farmer, onChangeStatus }: FarmerActionsProps) {
  const t = useT();
  const [confirmTarget, setConfirmTarget] = useState<FarmerStatus | null>(null);

  return (
    <View style={styles.container}>
      {farmer.status !== 'APPROVED' ? (
        <Button variant="primary" fullWidth onPress={() => setConfirmTarget('APPROVED')}>
          {t('farmers.approve')}
        </Button>
      ) : null}
      {farmer.status !== 'SUSPENDED' ? (
        <Button variant="destructive" fullWidth onPress={() => setConfirmTarget('SUSPENDED')}>
          {t('farmers.suspend')}
        </Button>
      ) : null}

      <ConfirmDialog
        visible={confirmTarget !== null}
        title={confirmTarget === 'APPROVED' ? t('farmers.approve') : t('farmers.suspend')}
        message={farmer.name}
        confirmLabel={t('common.confirm')}
        variant={confirmTarget === 'SUSPENDED' ? 'danger' : 'warning'}
        onConfirm={() => {
          if (confirmTarget) onChangeStatus(confirmTarget);
          setConfirmTarget(null);
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
});
