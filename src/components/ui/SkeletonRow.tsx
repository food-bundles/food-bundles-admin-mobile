import { StyleSheet, View } from 'react-native';
import { radius, space } from '@/theme';
import { Skeleton } from './Skeleton';

/** Generic list-row shimmer: avatar circle + two text lines + trailing chip. */
export function SkeletonRow() {
  return (
    <View style={styles.row}>
      <Skeleton width={40} height={40} radius={radius.pill} />
      <View style={styles.lines}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="45%" height={12} />
      </View>
      <Skeleton width={56} height={22} radius={radius.pill} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  lines: { flex: 1, gap: space.xs },
});
