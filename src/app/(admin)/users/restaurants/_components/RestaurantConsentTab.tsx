import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import { formatRwf } from '@/lib/formatRwf';
import { formatRelative } from '@/lib/date';
import { deriveConsentActivity, type ConsentEventKind } from '@/lib/consentActivity';
import { computeWeightedScore, ALL_CONSENT_SOURCES } from '@/lib/creditScoring';
import { MOCK_LOAN_APPLICATIONS } from '@/mocks/loanApplications';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreditScoreGauge } from '@/components/charts/CreditScoreGauge';
import { ConsentSourcesList } from '@/components/data/ConsentSourcesList';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { OtpConfirmSheet } from '@/components/modals/OtpConfirmSheet';

const CAN_MANAGE_ROLES = ['SUPERUSER', 'ADMIN'];

const EVENT_LABEL_KEY: Record<ConsentEventKind, TranslationKey> = {
  GRANTED: 'consent.eventGranted',
  REVOKED: 'consent.eventRevoked',
  EXPIRED: 'consent.eventExpired',
};

const SOURCE_LABEL_KEY = {
  rra: 'consent.sourceRra',
  eucl: 'consent.sourceEucl',
  vubaVuba: 'consent.sourceVubaVuba',
  kayko: 'consent.sourceKayko',
  foodbundles: 'consent.sourceFoodbundles',
  creditBureau: 'consent.sourceCreditBureau',
} as const;

export interface RestaurantConsentTabProps {
  restaurantId: string;
}

/**
 * Data & Credit tab: credit score gauge (reused from Section 2), 6 data-
 * source cards with a per-source revoke action, a re-request-consent flow,
 * and a derived consent activity log. Sources its score/consent from the
 * restaurant's most recent loan application, since consent is captured at
 * application time, not as a standalone restaurant field.
 */
export function RestaurantConsentTab({ restaurantId }: RestaurantConsentTabProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const role = useAuthStore((state) => state.user?.role);
  const canManage = role ? CAN_MANAGE_ROLES.includes(role) : false;

  const application = useMemo(
    () =>
      MOCK_LOAN_APPLICATIONS.filter((a) => a.restaurantId === restaurantId).sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )[0],
    [restaurantId],
  );

  const [revokedSources, setRevokedSources] = useState<Set<string>>(new Set());
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [rerequestOpen, setRerequestOpen] = useState(false);
  const [rerequestSuccess, setRerequestSuccess] = useState(false);

  if (!application) {
    return <EmptyState icon={null} title={t('consent.emptyActivityTitle')} message={t('consent.emptyActivityMessage')} />;
  }

  const consent = application.consent.map((record) =>
    revokedSources.has(record.source) ? { ...record, granted: false, expiresAt: null } : record,
  );
  const grantedSet = new Set(consent.filter((c) => c.granted).map((c) => c.source));
  const score = computeWeightedScore(grantedSet);
  const anyDenied = ALL_CONSENT_SOURCES.some((s) => !grantedSet.has(s));
  const activity = deriveConsentActivity(application.consent).slice(0, 5);

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[styles.title, { color: colors.ink }]}>{t('consent.creditScore')}</Text>
        <CreditScoreGauge score={score} anyDenied={anyDenied} />
        {application.approvedLimit !== null ? (
          <Text style={[styles.limit, { color: colors.leaf }]}>{formatRwf(application.approvedLimit)}</Text>
        ) : null}
      </Card>

      <Card>
        <Text style={[styles.title, { color: colors.ink }]}>{t('consent.dataSources')}</Text>
        <ConsentSourcesList consent={consent} />
        {canManage ? (
          <View style={styles.revokeRow}>
            {consent
              .filter((c) => c.granted && c.source !== 'foodbundles')
              .map((c) => (
                <Button key={c.source} variant="ghost" size="sm" onPress={() => setRevokeTarget(c.source)}>
                  {`${t('consent.revokeAccess')}: ${t(SOURCE_LABEL_KEY[c.source])}`}
                </Button>
              ))}
          </View>
        ) : null}
      </Card>

      {canManage ? (
        <Button variant="secondary" fullWidth onPress={() => setRerequestOpen(true)}>
          {t('consent.rerequest')}
        </Button>
      ) : null}
      {rerequestSuccess ? <Text style={[styles.success, { color: colors.ripe }]}>{t('consent.rerequestSuccess')}</Text> : null}

      <Card>
        <Text style={[styles.title, { color: colors.ink }]}>{t('consent.activityLog')}</Text>
        {activity.map((event, index) => (
          <View
            key={`${event.source}-${event.kind}-${event.timestamp}`}
            style={[styles.eventRow, index < activity.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
          >
            <Text style={[styles.eventLabel, { color: colors.ink }]}>
              {t(SOURCE_LABEL_KEY[event.source])} · {t(EVENT_LABEL_KEY[event.kind])}
            </Text>
            <Text style={[styles.eventTime, { color: colors.muted }]}>{formatRelative(event.timestamp, language, t)}</Text>
          </View>
        ))}
      </Card>

      <ConfirmDialog
        visible={revokeTarget !== null}
        title={t('consent.revokeAccess')}
        message={revokeTarget ? t('consent.revokeConfirm', { source: t(SOURCE_LABEL_KEY[revokeTarget as keyof typeof SOURCE_LABEL_KEY]) }) : ''}
        confirmLabel={t('consent.revokeAccess')}
        variant="danger"
        onConfirm={() => {
          if (revokeTarget) setRevokedSources((prev) => new Set(prev).add(revokeTarget));
          setRevokeTarget(null);
        }}
        onCancel={() => setRevokeTarget(null)}
      />

      <OtpConfirmSheet
        visible={rerequestOpen}
        title={t('consent.rerequestConfirmTitle')}
        message={t('consent.rerequestConfirmMessage')}
        onClose={() => setRerequestOpen(false)}
        onConfirm={() => {
          setRerequestOpen(false);
          setRerequestSuccess(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  title: { ...text.h3, marginBottom: space.sm },
  limit: { ...text.priceLg, textAlign: 'center', marginTop: space.sm },
  revokeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, marginTop: space.sm },
  success: { ...text.bodySemi },
  eventRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  eventLabel: { ...text.body, flex: 1 },
  eventTime: { ...text.caption },
});
