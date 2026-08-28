import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface TotpQrCodeProps {
  otpauthUri: string;
  secret: string;
}

/** Renders a real scannable TOTP QR code plus the raw secret with a copy action. */
export function TotpQrCode({ otpauthUri, secret }: TotpQrCodeProps) {
  const t = useT();
  const { colors } = useTheme();

  const onCopy = () => {
    Clipboard.setStringAsync(secret);
  };

  return (
    <View>
      <View style={[styles.qrWrap, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        <QRCode value={otpauthUri} size={200} color={colors.ink} backgroundColor={colors.paper} />
      </View>
      <View style={[styles.keyRow, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        <Text style={[styles.keyText, { color: colors.ink }]}>{secret}</Text>
        <Pressable onPress={onCopy} accessibilityRole="button" accessibilityLabel={t('settings.copy')} style={styles.copyButton}>
          <Text style={[styles.copyLabel, { color: colors.leaf }]}>{t('settings.copy')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.md,
    marginTop: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  keyText: { ...text.bodySemi, letterSpacing: 1, flex: 1 },
  copyButton: { minHeight: 44, paddingHorizontal: space.sm, alignItems: 'center', justifyContent: 'center' },
  copyLabel: { ...text.label },
});
