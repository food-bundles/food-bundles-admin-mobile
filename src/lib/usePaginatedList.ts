import { useCallback, useEffect, useMemo, useState } from 'react';
import { translate } from '@/i18n';

export interface PaginatedListState<T> {
  items: T[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | undefined;
  setPage: (page: number) => void;
  refresh: () => void;
  retry: () => void;
}

export interface UsePaginatedListOptions<T> {
  pageSize?: number;
  fetchPage: (page: number, pageSize: number) => Promise<{ items: T[]; total: number }>;
}

/**
 * Shared page/limit/total/loading state for every mock list screen.
 * Replaces the 6+ hand-rolled copies of this logic on the web dashboard.
 */
export function usePaginatedList<T>({ pageSize = 20, fetchPage }: UsePaginatedListOptions<T>): PaginatedListState<T> {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [requestId, setRequestId] = useState(0);

  const load = useCallback(
    async (targetPage: number, mode: 'load' | 'refresh') => {
      if (mode === 'load') setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMessage(undefined);
      try {
        const result = await fetchPage(targetPage, pageSize);
        setItems(result.items);
        setTotal(result.total);
      } catch {
        setErrorMessage(translate('common.error'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [fetchPage, pageSize],
  );

  useEffect(() => {
    load(page, 'load');
  }, [page, requestId, load]);

  const refresh = useCallback(() => load(page, 'refresh'), [load, page]);
  const retry = useCallback(() => setRequestId((id) => id + 1), []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  return { items, page, totalPages, isLoading, isRefreshing, errorMessage, setPage, refresh, retry };
}
