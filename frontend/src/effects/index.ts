/**
 * Effect-RX Utilities and Patterns for Frontend
 * 
 * This module provides utility functions and common patterns
 * for using Effect-RX in the React frontend application.
 */

import * as Rx from "@effect-rx/rx-react";
import { Effect, pipe } from "effect";
import { ApiResponse, ApiError, HttpStatus } from "@guerilla-teaching/shared-types";
import { 
  runtime, 
  logInfoRx, 
  logErrorRx, 
  createApiUrl, 
  withFrontendTimeout, 
  withFrontendRetry,
  catchAndLog 
} from "../config/effects";

// HTTP request types
export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retryAttempts?: number;
}

// Loading state management
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const createLoadingState = (): LoadingState => ({
  isLoading: false,
  error: null,
  lastUpdated: null
});

// Create reactive atoms for common state patterns
export const createLoadingRx = (initialState = createLoadingState()) =>
  Rx.atom("loading", initialState);

// API request utility using Effect-RX
export const apiRequest = <T>(
  endpoint: string,
  config: RequestConfig = {}
): Effect.Effect<ApiResponse<T>, ApiError, never> => {
  const {
    method = "GET",
    headers = {},
    body,
    timeout,
    retryAttempts
  } = config;

  const url = createApiUrl(endpoint);
  
  const fetchEffect = Effect.tryPromise({
    try: async () => {
      const fetchConfig: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      };

      if (body && method !== "GET") {
        fetchConfig.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchConfig);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    catch: (error): ApiError => ({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString()
    })
  });

  return pipe(
    fetchEffect,
    Effect.tap(() => logInfoRx(`API request completed: ${method} ${endpoint}`)),
    withFrontendTimeout(timeout),
    withFrontendRetry(retryAttempts)
  );
};

// Reactive HTTP methods
export const apiGet = <T>(endpoint: string, config?: Omit<RequestConfig, "method">) =>
  apiRequest<T>(endpoint, { ...config, method: "GET" });

export const apiPost = <T>(endpoint: string, body?: any, config?: Omit<RequestConfig, "method" | "body">) =>
  apiRequest<T>(endpoint, { ...config, method: "POST", body });

export const apiPut = <T>(endpoint: string, body?: any, config?: Omit<RequestConfig, "method" | "body">) =>
  apiRequest<T>(endpoint, { ...config, method: "PUT", body });

export const apiDelete = <T>(endpoint: string, config?: Omit<RequestConfig, "method">) =>
  apiRequest<T>(endpoint, { ...config, method: "DELETE" });

// State management helpers
export const createAsyncRx = <T, E = string>(
  name: string,
  initialValue: T,
  effect: Effect.Effect<T, E, never>
) => {
  const dataRx = Rx.atom(name, initialValue);
  const loadingRx = createLoadingRx();

  const refresh = Rx.fn(`${name}Refresh`, () =>
    pipe(
      Effect.sync(() => {
        Rx.set(loadingRx, {
          isLoading: true,
          error: null,
          lastUpdated: null
        });
      }),
      Effect.andThen(() => effect),
      Effect.tap((data) =>
        Effect.sync(() => {
          Rx.set(dataRx, data);
          Rx.set(loadingRx, {
            isLoading: false,
            error: null,
            lastUpdated: new Date()
          });
        })
      ),
      Effect.catchAll((error) =>
        Effect.sync(() => {
          Rx.set(loadingRx, {
            isLoading: false,
            error: String(error),
            lastUpdated: new Date()
          });
        })
      )
    )
  );

  return {
    data: dataRx,
    loading: loadingRx,
    refresh
  };
};

// Form state management
export interface FormField<T> {
  value: T;
  error: string | null;
  touched: boolean;
  isDirty: boolean;
}

export const createFormField = <T>(initialValue: T): FormField<T> => ({
  value: initialValue,
  error: null,
  touched: false,
  isDirty: false
});

export const createFormRx = <T extends Record<string, any>>(
  name: string,
  initialValues: T
) => {
  type FormState = {
    [K in keyof T]: FormField<T[K]>;
  };

  const initialState = Object.entries(initialValues).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: createFormField(value)
    }),
    {} as FormState
  );

  const formRx = Rx.atom(`${name}Form`, initialState);

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    const currentState = Rx.get(formRx);
    const currentField = currentState[field];
    
    Rx.set(formRx, {
      ...currentState,
      [field]: {
        ...currentField,
        value,
        isDirty: value !== initialValues[field],
        touched: true
      }
    });
  };

  const setError = <K extends keyof T>(field: K, error: string | null) => {
    const currentState = Rx.get(formRx);
    const currentField = currentState[field];
    
    Rx.set(formRx, {
      ...currentState,
      [field]: {
        ...currentField,
        error
      }
    });
  };

  const resetForm = () => {
    Rx.set(formRx, initialState);
  };

  const getValues = (): T => {
    const state = Rx.get(formRx);
    return Object.entries(state).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: (field as FormField<any>).value
      }),
      {} as T
    );
  };

  const hasErrors = (): boolean => {
    const state = Rx.get(formRx);
    return Object.values(state).some((field) => (field as FormField<any>).error !== null);
  };

  const isDirty = (): boolean => {
    const state = Rx.get(formRx);
    return Object.values(state).some((field) => (field as FormField<any>).isDirty);
  };

  return {
    form: formRx,
    setValue,
    setError,
    resetForm,
    getValues,
    hasErrors,
    isDirty
  };
};

// Cache management
export const createCacheRx = <T>(name: string, ttlMs: number = 300000) => {
  interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
  }

  const cacheRx = Rx.atom<Map<string, CacheEntry<T>>>(name, new Map());

  const set = (key: string, data: T) => {
    const cache = new Map(Rx.get(cacheRx));
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
    Rx.set(cacheRx, cache);
  };

  const get = (key: string): T | null => {
    const cache = Rx.get(cacheRx);
    const entry = cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      // Entry expired, remove it
      const newCache = new Map(cache);
      newCache.delete(key);
      Rx.set(cacheRx, newCache);
      return null;
    }
    
    return entry.data;
  };

  const invalidate = (key: string) => {
    const cache = new Map(Rx.get(cacheRx));
    cache.delete(key);
    Rx.set(cacheRx, cache);
  };

  const clear = () => {
    Rx.set(cacheRx, new Map());
  };

  return {
    cache: cacheRx,
    set,
    get,
    invalidate,
    clear
  };
};

// Export all utilities
export {
  runtime,
  createLoadingRx,
  createLoadingState,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  createAsyncRx,
  createFormRx,
  createFormField,
  createCacheRx
};

// Export types
export { type RequestConfig, type LoadingState, type FormField };