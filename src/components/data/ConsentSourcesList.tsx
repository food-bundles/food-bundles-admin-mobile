import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { SourceLogo } from './SourceLogo';
import { ALL_CONSENT_SOURCES } from '@/lib/creditScoring';
import type { ConsentRecord } from '@/mocks/loanApplications';

const SOURCE_LABEL_KEY = {
  rra: 'consent.sourceRra',
  eucl: 'consent.sourceEucl',
  vubaVuba: 'consent.sourceVubaVuba',
  kayko: 'consent.sourceKayko',
  foodbundles: 'consent.sourceFoodbundles',
  creditBureau: 'consent.sourceCreditBureau',
} as const;

export interface ConsentSourcesListProps {
  consent: ConsentRecord[];
}

/**
 * "Data sources authorized" grid: 6 source cards, each with logo, granted/
 * denied state, and expiry. Shared between the Loan Application detail sheet
 * (Section 2) and the restaurant "Data & Credit" tab (Section 4).
 */
export function ConsentSourcesList({ consent }: ConsentSourcesListProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const now = Date.now();

  return (
    <View style={styles.grid}>
      {ALL_CONSENT_SOURCES.map((source) => {
        const record = consent.find((c) => c.source === source);
        const granted = record?.granted ?? false;
        const isExpired = granted && record?.expiresAt !== null && record?.expiresAt !== undefined && new Date(record.expiresAt).getTime() < now;

        let statusText = t('consent.denied');
        let statusColor = colors.muted;
        if (granted && isExpired) {
          statusText = t('consent.expired');
          statusColor = colors.chili;
        } else if (granted && record?.expiresAt === null) {
          statusText = t('consent.forever');
          statusColor = colors.leaf;
        } else if (granted && record?.expiresAt) {
          statusText = t('consent.expiresOn', { date: formatDate(record.expiresAt, language) });
          statusColor = colors.leaf;
        }

        return (
          <Card key={source} style={styles.card}>
            <SourceLogo source={source} />
            <Text style={[styles.name, { color: colors.ink }]}>{t(SOURCE_LABEL_KEY[source])}</Text>
            <Text style={[styles.status, { color: statusColor }]}>{statusText}</Text>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  card: { width: '31%', alignItems: 'center', gap: space.xs },
  name: { ...text.caption, textAlign: 'center' },
  status: { ...text.micro, textAlign: 'center' },
});
