import type { MOVIES_PAGE_SEARCH_PARAMS_PARSER } from '@/configs/searchParams';

import type { useQueryStates } from 'nuqs';

export type MoviesQueryFilters = ReturnType<
  typeof useQueryStates<typeof MOVIES_PAGE_SEARCH_PARAMS_PARSER>
>[0];
export type MoviesSetFilters = ReturnType<
  typeof useQueryStates<typeof MOVIES_PAGE_SEARCH_PARAMS_PARSER>
>[1];
