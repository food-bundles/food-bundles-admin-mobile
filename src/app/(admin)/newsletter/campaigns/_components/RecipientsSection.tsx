import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/modals/Sheet';
import { MOCK_SUBSCRIBERS } from '@/mocks/newsletter';
import type { Campaign } from '@/mocks/newsletter';

export interface RecipientsSectionProps {
  campaign: Campaign;
}

/** Recipient count + first 3 emails + "View all" opening a Sheet with the full list. */
export function RecipientsSection({ campaign }: RecipientsSectionProps) {
  const { colors } = useTheme();
  const t = useT();
  const [sheetOpen, setSheetOpen] = useState(false);
  const recipients = MOCK_SUBSCRIBERS.slice(0, campaign.recipientCount);

  return (
    <Card>
      <Text style={[styles.title, { color: colors.ink }]}>{t('newsletter.recipients', { count: campaign.recipientCount })}</Text>
      {recipients.slice(0, 3).map((s) => (
        <Text key={s.id} style={[styles.email, { color: colors.body }]}>
          {s.email}
        </Text>
      ))}
      {recipients.length > 3 ? (
        <Pressable onPress={() => setSheetOpen(true)} accessibilityRole="button" accessibilityLabel={t('common.viewAll')}>
          <Text style={[styles.viewAll, { color: colors.leaf }]}>{t('common.viewAll')}</Text>
        </Pressable>
      ) : null}

      <Sheet visible={sheetOpen} height="tall" onClose={() => setSheetOpen(false)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.sheetTitle, { color: colors.ink }]}>{t('newsletter.recipients', { count: campaign.recipientCount })}</Text>
          <FlatList
            data={recipients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.sheetRow, { borderBottomColor: colors.hairline }]}>
                <Text style={[styles.email, { color: colors.body }]}>{item.email}</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </ScrollView>
      </Sheet>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h3, marginBottom: space.sm },
  email: { ...text.body, marginBottom: space.xs },
  viewAll: { ...text.bodySemi, marginTop: space.xs },
  sheetTitle: { ...text.h2, marginBottom: space.md },
  sheetRow: { paddingVertical: space.sm, borderBottomWidth: 1 },
});
