import { type SerializedError } from "@reduxjs/toolkit";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type Query<T> = SuccessQuery<T> | LoadingQuery | ErrorQuery;

export interface SuccessQuery<T> {
  data: T;
  isSuccess: true;
  isError: false;
  isLoading: false;
  error: undefined;
}

export interface LoadingQuery {
  data: undefined;
  isSuccess: false;
  isLoading: true;
  isError: false;
  error: undefined;
}

export interface ErrorQuery {
  data: undefined;
  isSuccess: false;
  isLoading: false;
  isError: true;
  error: string | FetchBaseQueryError | SerializedError;
}

export function success<T>(data: T): SuccessQuery<T> {
  return {
    data,
    isSuccess: true,
    isError: false,
    isLoading: false,
    error: undefined,
  };
}

const LOADING: LoadingQuery = {
  data: undefined,
  isSuccess: false,
  isLoading: true,
  isError: false,
  error: undefined,
}; 

export function loading(): LoadingQuery {
  return LOADING;
}

export function error(
  error: string | FetchBaseQueryError | SerializedError
): ErrorQuery {
  return {
    data: undefined,
    isSuccess: false,
    isLoading: false,
    isError: true,
    error,
  };
}

export const wrapReduxQuery = <T>(
  // I didn't want to figure out RTK Query's insane type soup. Just use a big wildcard.
  query: Record<
    string,
    | object
    | boolean
    | number
    | string
    | T
    | undefined
    | FetchBaseQueryError
    | SerializedError
  >
): Query<T> => {
  if (query.isSuccess as boolean) {
    return success(query.data as T);
  } else if (query.isError as boolean) {
    return error(query.error as string | FetchBaseQueryError | SerializedError);
  } else {
    return loading();
  }
};

export const mapQuery = <T, U>(
  query: Query<T>,
  block: (data: T) => U
): Query<U> => {
  if (query.isSuccess) {
    return {
      ...query,
      data: block(query.data),
    };
  }
  return query;
};

export const deepMapQuery = <T, U>(
  query: Query<T>,
  block: (data: T) => Query<U>
): Query<U> => {
  if (query.isSuccess) {
    return block(query.data);
  }
  return query;
};
