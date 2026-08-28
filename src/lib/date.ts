import type { Language, TranslationKey } from '@/i18n';

const LOCALE: Record<Language, string> = { en: 'en-GB', rw: 'en-GB', fr: 'fr-FR' };

/** Absolute date, language-aware month names. Kinyarwanda has no Intl locale, so it falls back to en-GB formatting. */
export const formatDate = (iso: string, lang: Language): string => {
  const d = new Date(iso);
  return d.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatTime = (iso: string, lang: Language): string => {
  const d = new Date(iso);
  return d.toLocaleTimeString(LOCALE[lang], { hour: '2-digit', minute: '2-digit' });
};

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

/** Relative for < 48h ("2 min ago", "Yesterday"), absolute after — per the screen-specs skill. */
export const formatRelative = (iso: string, lang: Language, t: Translate, now: Date = new Date()): string => {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return t('date.justNow');
  if (diffMin < 60) return t('date.minAgo', { count: diffMin });

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return t('date.hoursAgo', { count: diffHours });

  const isYesterday = diffHours < 48 && then.getDate() !== now.getDate();
  if (isYesterday) return t('date.yesterday');

  return formatDate(iso, lang);
};
