import { randomUUID } from 'expo-crypto';

/** ID for any record created at runtime (not static mock seed data, which uses fixed ids). */
export const generateId = (prefix: string): string => `${prefix}-${randomUUID().slice(0, 8)}`;
