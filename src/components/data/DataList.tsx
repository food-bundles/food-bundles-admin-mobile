import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { RefreshControl, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useTheme } from '@/theme';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SkeletonRow } from '@/components/ui/SkeletonRow';
import { reportScrollOffset } from '@/stores/scrollNavStore';

export interface DataListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  isLoading: boolean;
  isEmpty: boolean;
  emptyTitle: string;
  emptyMessage: string;
  errorMessage?: string;
  onRetry?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyIcon: React.ReactNode;
}

/** FlashList-backed list with loading/empty/error states wired in. Mobile replacement for web's DataTable. */
export function DataList<T>({
  data,
  renderItem,
  keyExtractor,
  isLoading,
  isEmpty,
  emptyTitle,
  emptyMessage,
  errorMessage,
  onRetry,
  onRefresh,
  refreshing = false,
  emptyIcon,
}: DataListProps<T>) {
  const { colors } = useTheme();

  if (errorMessage && onRetry) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </>
    );
  }

  if (isEmpty) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    reportScrollOffset(event.nativeEvent.contentOffset.y);
  };

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => keyExtractor(item)}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.leaf} />
        ) : undefined
      }
    />
  );
}
