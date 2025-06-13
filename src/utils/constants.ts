import { CriteriaGroup } from 'core';
import { Result } from 'types';

export const LOADING_DELAY = 500;
export const HELPER_TEXT =
  'Insert data url. Returning data MUST be an array JSON with each element is key/value pair.';
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://jsonplaceholder.typicode.com/todos';
export const SKELETON_ROWS_COUNT = 18;
export const EMPTY_RESULT: Result = {
  columns: [],
  data: []
};
export const EMPTY_CRITERIA_GROUP = new CriteriaGroup();
