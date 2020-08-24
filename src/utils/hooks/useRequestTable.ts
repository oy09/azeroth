import { useState, useEffect } from 'react';
import useDebounceFn from './useDebounceFn';

export interface RequestData<T> {
  data: T[];
  success?: boolean;
  total?: number;
  [key: string]: any;
}

export interface useReqeustTableAction<T extends RequestData<any>> {
  dataSouce: T['data'] | T;
  loading: boolean | undefined;
  hasMore: boolean;
  current: number;
  pageSize: number;
  total: number;
  cancel: () => void;
  reload: () => Promise<void>;
  fetchMore: () => void;
  resetPage: () => void;
  reset: () => void;
  setPageInfo: (pageInfo: Partial<PageInfo>) => void;
}

interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

const useReqeustTable = <T extends RequestData<any>>(
  getData: (params: { current: number; pageSize: number }) => Promise<T>,
  defaultData?: Partial<T['data']>,
  options?: {
    defaultCurrent?: number;
    defaultPageSize?: number;
    effects?: any[];
    onLoad: (dataSource: T['data']) => void;
    onRequestError: (e: Error) => void;
  },
): useReqeustTableAction<T> => {
  const {
    defaultCurrent = 1,
    defaultPageSize = 20,
    onLoad = () => null,
    onRequestError,
    effects = [],
  } = options || {};

  const [list, setList] = useState<T['data']>(defaultData as T['data']);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    page: defaultCurrent || 1,
    pageSize: defaultPageSize,
    total: 0,
    hasMore: false,
  });

  // 加载数据
  const fetchList = async (isAppend?: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const { page, pageSize } = pageInfo;

    try {
      const { data, success, total: dataTotal = 0 } = await getData({
        current: page,
        pageSize,
      });
      if (success !== false) {
        if (isAppend && list) {
          setList([...list, ...data]);
        } else {
          setList([...data]);
        }
        setPageInfo({
          ...pageInfo,
          total: dataTotal,
          hasMore: dataTotal > page * pageSize,
        });
      }
      if (onLoad) {
        onLoad(data);
      }
    } catch (e) {
      if (onRequestError === undefined) {
        throw new Error(e);
      } else {
        onRequestError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  // 加载下一页数据
  const fetchMore = () => {
    if (pageInfo.hasMore) {
      setPageInfo({
        ...pageInfo,
        page: pageInfo.page + 1,
      });
    }
  };

  // 重置页码
  const resetPage = () => {
    setPageInfo({
      ...pageInfo,
      page: 1,
    });
  };

  const fetchDebounceList = useDebounceFn(fetchList, [], 300);

  useEffect(() => {
    const { page, pageSize } = pageInfo;
    if (page !== undefined && list.length <= pageSize) {
      fetchDebounceList.run();
      return () => fetchDebounceList.cancel();
    }
    return () => undefined;
  }, [pageInfo.page]);

  useEffect(() => {
    setList([]);
    setPageInfo({ ...pageInfo, page: 1 });
    fetchDebounceList.run();
    return () => fetchDebounceList.cancel();
  }, [pageInfo.pageSize]);

  useEffect(() => {
    fetchDebounceList.run();

    return () => fetchDebounceList.cancel();
  }, effects);

  return {
    dataSouce: list,
    loading,
    hasMore: false,
    current: 0,
    pageSize: 0,
    total: 0,
    cancel: () => fetchDebounceList.cancel(),
    reload: async () => fetchDebounceList.run(),
    fetchMore,
    resetPage,
    reset: () => {
      setPageInfo({
        hasMore: false,
        page: defaultCurrent || 1,
        total: 0,
        pageSize: defaultPageSize,
      });
    },
    setPageInfo: info => {
      setPageInfo({
        ...pageInfo,
        ...info,
      });
    },
  };
};

export default useReqeustTable;
