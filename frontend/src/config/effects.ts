import * as Rx from "@effect-rx/rx-react";
import { Effect } from "effect";
import { logger } from "../utils/logger";
import { LogLevel } from "@guerilla-teaching/shared-types";

/**
 * Effect-RX Configuration for Frontend
 * 
 * This module sets up Effect-RX for reactive state management
 * and side effects in the React frontend.
 */

// Frontend effect configuration
export interface FrontendEffectConfig {
  apiBaseUrl: string;
  timeout: number;
  retryAttempts: number;
  logLevel: LogLevel;
  enableDevtools: boolean;
}

// Default configuration
export const defaultFrontendConfig: FrontendEffectConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "/api",
  timeout: parseInt(process.env.REACT_APP_TIMEOUT || "10000"),
  retryAttempts: parseInt(process.env.REACT_APP_RETRY_ATTEMPTS || "2"),
  logLevel: (process.env.REACT_APP_LOG_LEVEL as LogLevel) || "info",
  enableDevtools: process.env.NODE_ENV === "development"
};

// Create the main Effect-RX runtime
export const runtime = Rx.Runtime.make();

// Configuration atom
export const configRx = Rx.atom("config", defaultFrontendConfig);

// Logging utilities for Effect-RX
export const logEffect = (level: LogLevel, message: string, meta?: any) =>
  Effect.sync(() => {
    logger.log(level, message, meta);
  });

export const logInfoRx = (message: string, meta?: any) =>
  logEffect("info", message, meta);

export const logErrorRx = (message: string, meta?: any) =>
  logEffect("error", message, meta);

export const logWarnRx = (message: string, meta?: any) =>
  logEffect("warn", message, meta);

export const logDebugRx = (message: string, meta?: any) =>
  logEffect("debug", message, meta);

// HTTP request utilities for Effect-RX
export const createApiUrl = (endpoint: string) => {
  const config = Rx.get(configRx);
  return `${config.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Timeout utility for frontend effects
export const withFrontendTimeout = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  ms?: number
) => {
  const config = Rx.get(configRx);
  return Effect.timeout(effect, ms || config.timeout);
};

// Retry utility for frontend effects
export const withFrontendRetry = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  attempts?: number
) => {
  const config = Rx.get(configRx);
  return Effect.retry(effect, { times: attempts || config.retryAttempts });
};

// Error boundary for Effect-RX
export const catchAndLog = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  fallback: A
) =>
  Effect.catchAll(effect, (error) =>
    Effect.andThen(
      logErrorRx("Effect failed in frontend", { error }),
      () => Effect.succeed(fallback)
    )
  );

// Local storage utilities
export const getFromLocalStorage = (key: string): Effect.Effect<string | null, never, never> =>
  Effect.sync(() => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error("Failed to read from localStorage", { key, error });
      return null;
    }
  });

export const setToLocalStorage = (key: string, value: string): Effect.Effect<void, never, never> =>
  Effect.sync(() => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logger.error("Failed to write to localStorage", { key, error });
    }
  });

export const removeFromLocalStorage = (key: string): Effect.Effect<void, never, never> =>
  Effect.sync(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error("Failed to remove from localStorage", { key, error });
    }
  });

// Session storage utilities
export const getFromSessionStorage = (key: string): Effect.Effect<string | null, never, never> =>
  Effect.sync(() => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      logger.error("Failed to read from sessionStorage", { key, error });
      return null;
    }
  });

export const setToSessionStorage = (key: string, value: string): Effect.Effect<void, never, never> =>
  Effect.sync(() => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      logger.error("Failed to write to sessionStorage", { key, error });
    }
  });

// Environment helpers
export const getEnvVar = (name: string, defaultValue?: string): string => {
  return process.env[name] || defaultValue || "";
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

// Export types
export { type FrontendEffectConfig };