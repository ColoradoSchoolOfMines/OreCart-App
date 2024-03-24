import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type Query<T, E = string> = SuccessQuery<T> | LoadingQuery | ErrorQuery<E>;

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

export interface ErrorQuery<E> {
  data: undefined;
  isSuccess: false;
  isLoading: false;
  isError: true;
  error: E;
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

export function error<E>(
  error: E,
): ErrorQuery<E> {
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
  query: Record<string, unknown>,
): Query<T> => {
  if (query.isSuccess as boolean) {
    return success(query.data as T);
  } else if (query.isError as boolean) {
    const err = query.error;
    if (isFetchBaseQueryError(err)) {
      const errMsg = 'error' in err ? err.error : JSON.stringify(err.data)
      return error(errMsg);
    } else if (isErrorWithMessage(err)) {
      return error(err.message);
    } else {
      return error(JSON.stringify(err));
    }
  } else {
    return loading();
  }
};

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

export const mapQuery = <T, U>(
  query: Query<T>,
  block: (data: T) => U,
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
  block: (data: T) => Query<U>,
): Query<U> => {
  if (query.isSuccess) {
    return block(query.data);
  }
  return query;
};
