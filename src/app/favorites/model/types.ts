import type { FAVORITE_PAGE_SEARCH_PARAMS_PARSER } from '@/configs/searchParams';

import type { useQueryStates } from 'nuqs';

export type FavoriteQueryFilters = ReturnType<
  typeof useQueryStates<typeof FAVORITE_PAGE_SEARCH_PARAMS_PARSER>
>[0];
export type FavoriteSetFilters = ReturnType<
  typeof useQueryStates<typeof FAVORITE_PAGE_SEARCH_PARAMS_PARSER>
>[1];
