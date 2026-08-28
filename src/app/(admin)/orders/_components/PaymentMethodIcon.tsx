import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import type { PaymentMethod } from '@/mocks/orders';

const ICON: Record<PaymentMethod, keyof typeof Ionicons.glyphMap> = {
  CASH: 'cash-outline',
  MOBILE_MONEY: 'phone-portrait-outline',
  CARD: 'card-outline',
  BANK_TRANSFER: 'business-outline',
  VOUCHER: 'ticket-outline',
};

export interface PaymentMethodIconProps {
  method: PaymentMethod;
  size?: number;
}

/** Small icon representing the order's payment method. */
export function PaymentMethodIcon({ method, size = 16 }: PaymentMethodIconProps) {
  const { colors } = useTheme();
  return <Ionicons name={ICON[method]} size={size} color={colors.muted} />;
}
