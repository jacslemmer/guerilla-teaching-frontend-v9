import { Effect, Runtime, Layer } from "effect";
import { logger } from "../utils/logger";
import { LogLevel, LoggerConfig } from "@guerilla-teaching/shared-types";

/**
 * Effect-TS Configuration for Backend
 * 
 * This module sets up the Effect-TS runtime and provides configuration
 * for functional programming patterns in the backend.
 */

// Environment configuration interface
export interface EffectConfig {
  concurrency: number;
  timeout: number;
  retryAttempts: number;
  logLevel: LogLevel;
}

// Default configuration
export const defaultEffectConfig: EffectConfig = {
  concurrency: parseInt(process.env.EFFECT_CONCURRENCY || "10"),
  timeout: parseInt(process.env.EFFECT_TIMEOUT || "30000"),
  retryAttempts: parseInt(process.env.EFFECT_RETRY_ATTEMPTS || "3"),
  logLevel: (process.env.LOG_LEVEL as LogLevel) || ("info" as LogLevel)
};

// Simple runtime without complex layers for now
export const AppRuntime = Runtime.defaultRuntime;

// Utility function to run effects in the application runtime
export const runEffect = <A, E = never>(effect: Effect.Effect<A, E, never>) => {
  return Runtime.runPromise(AppRuntime)(effect);
};

// Utility function to run effects with error handling
export const runEffectSafe = <A, E = never>(
  effect: Effect.Effect<A, E, never>,
  onError?: (error: E) => void
): Promise<A | null> => {
  return Runtime.runPromise(AppRuntime)(
    Effect.catchAll(effect, (error) => {
      if (onError) onError(error);
      return Effect.succeed(null as A);
    })
  ).catch(() => null);
};

// Configuration getter effect
export const getConfig = Effect.sync(() => defaultEffectConfig);

// Timeout utility effect
export const withTimeout = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  ms: number = defaultEffectConfig.timeout
) => Effect.timeout(effect, ms);

// Retry utility effect
export const withRetry = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  attempts: number = defaultEffectConfig.retryAttempts
) => Effect.retry(effect, { times: attempts });

// Logging utility effects
export const logInfo = (message: string, meta?: any) =>
  Effect.sync(() => logger.info(message, meta));

export const logError = (message: string, meta?: any) =>
  Effect.sync(() => logger.error(message, meta));

export const logWarn = (message: string, meta?: any) =>
  Effect.sync(() => logger.warn(message, meta));

export const logDebug = (message: string, meta?: any) =>
  Effect.sync(() => logger.debug(message, meta));

// Export types for external use
// Note: EffectConfig is already exported above