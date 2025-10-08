import type { SEARCH_PAGE_SEARCH_PARAMS_PARSER } from '@/configs/searchParams';

import type { useQueryStates } from 'nuqs';

export type SearchQueryFilters = ReturnType<
  typeof useQueryStates<typeof SEARCH_PAGE_SEARCH_PARAMS_PARSER>
>[0];
export type SearchSetFilters = ReturnType<
  typeof useQueryStates<typeof SEARCH_PAGE_SEARCH_PARAMS_PARSER>
>[1];
