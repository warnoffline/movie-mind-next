import { parseAsString, parseAsInteger } from 'nuqs/server';

export const MOVIES_PAGE_SEARCH_PARAMS_PARSER = {
  category: parseAsString,
  page: parseAsInteger,
};

export const SEARCH_PAGE_SEARCH_PARAMS_PARSER = {
  query: parseAsString,
};

export const FAVORITE_PAGE_SEARCH_PARAMS_PARSER = {
  page: parseAsInteger,
};
