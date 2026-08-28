import type { TranslationKey } from '@/i18n';
import type { PaymentMethod } from '@/mocks/orders';

export const PAYMENT_METHOD_KEY: Record<PaymentMethod, TranslationKey> = {
  CASH: 'orders.paymentCash',
  MOBILE_MONEY: 'orders.paymentMobileMoney',
  CARD: 'orders.paymentCard',
  BANK_TRANSFER: 'orders.paymentBankTransfer',
  VOUCHER: 'orders.paymentVoucher',
};
