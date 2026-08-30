import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, radius, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AvatarFace } from '@/components/navigation/AvatarFace';

interface ChatMessage {
  id: string;
  from: 'bot' | 'admin';
  text: string;
}

const GREETING = "Hi! I'm the FoodBundles AI assistant. Ask me about orders, restaurants, or reports.";

/**
 * Minimal placeholder AI support chat — no equivalent screen existed anywhere under (admin)/, so
 * this gives the bottom nav's centre avatar button somewhere real to navigate to. Fully mocked:
 * the bot echoes a canned reply, no backend wiring.
 */
export default function AiSupportChatScreen() {
  useRoleGuard('dashboard');
  const t = useT();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'm1', from: 'bot', text: GREETING }]);
  const [draft, setDraft] = useState('');

  const send = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, from: 'admin', text: trimmed };
    const botMsg: ChatMessage = { id: `b-${Date.now()}`, from: 'bot', text: "Thanks — I've noted that. A team member will follow up if needed." };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setDraft('');
  };

  return (
    <AdminScreen title={t('tab.aiSupport')} showBack>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.bubbleRow, m.from === 'admin' && styles.bubbleRowRight]}>
              {m.from === 'bot' ? (
                <View style={[styles.botIcon, { backgroundColor: colors.leaf }]}>
                  <AvatarFace size={20} />
                </View>
              ) : null}
              <View
                style={[
                  styles.bubble,
                  m.from === 'bot' ? { backgroundColor: colors.paper, borderColor: colors.hairline, borderWidth: 1 } : { backgroundColor: colors.leaf },
                ]}
              >
                <Text style={[text.body, { color: m.from === 'bot' ? colors.ink : colors.paper }]}>{m.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={[styles.inputRow, { borderColor: colors.hairline }]}>
          <View style={styles.inputField}>
            <Input label="" value={draft} onChangeText={setDraft} placeholder={t('common.search')} />
          </View>
          <Button variant="primary" size="sm" onPress={send} accessibilityLabel={t('common.confirm')}>
            {t('common.confirm')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: space.lg, gap: space.md },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, maxWidth: '85%' },
  bubbleRowRight: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  botIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bubble: { padding: space.md, borderRadius: radius.md },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, padding: space.md, borderTopWidth: 1 },
  inputField: { flex: 1 },
});
