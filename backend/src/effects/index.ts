/**
 * Effect-TS Utilities and Patterns for Backend
 * 
 * This module provides utility functions and common patterns
 * for using Effect-TS in the backend application.
 */

import { Effect, pipe } from "effect";
import { ApiResponse, ApiError, HttpStatus } from "@guerilla-teaching/shared-types";
import { logInfo, logError, withTimeout, withRetry } from "../config/effects";

// API response helpers using Effect
export const createSuccessResponse = <T>(
  data: T, 
  message?: string
): Effect.Effect<ApiResponse<T>, never, never> =>
  Effect.succeed({
    success: true,
    data,
    message: message || "Operation completed successfully",
    timestamp: new Date().toISOString()
  });

export const createErrorResponse = (
  error: string,
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): Effect.Effect<never, ApiError, never> =>
  Effect.fail({
    success: false,
    error,
    statusCode,
    details,
    timestamp: new Date().toISOString()
  });

// Database operation patterns
export const dbOperation = <T>(
  operation: () => Promise<T>,
  operationName: string
): Effect.Effect<T, ApiError, never> =>
  pipe(
    Effect.tryPromise({
      try: operation,
      catch: (error) => ({
        success: false as const,
        error: `Database operation failed: ${operationName}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: error,
        timestamp: new Date().toISOString()
      })
    }),
    Effect.tap(() => logInfo(`Database operation completed: ${operationName}`)),
    withTimeout(10000), // 10 second timeout for DB operations
    withRetry(2) // Retry DB operations twice on failure
  );

// HTTP request patterns
export const httpRequest = <T>(
  request: () => Promise<T>,
  requestName: string
): Effect.Effect<T, ApiError, never> =>
  pipe(
    Effect.tryPromise({
      try: request,
      catch: (error) => ({
        success: false as const,
        error: `HTTP request failed: ${requestName}`,
        statusCode: HttpStatus.BAD_GATEWAY,
        details: error,
        timestamp: new Date().toISOString()
      })
    }),
    Effect.tap(() => logInfo(`HTTP request completed: ${requestName}`)),
    withTimeout(30000), // 30 second timeout for HTTP requests
    withRetry(1) // Retry HTTP requests once on failure
  );

// Validation patterns
export const validate = <T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  errorMessage: string = "Validation failed"
): Effect.Effect<T, ApiError, never> =>
  validator(data)
    ? Effect.succeed(data)
    : createErrorResponse(errorMessage, HttpStatus.BAD_REQUEST);

// Safe JSON parsing
export const parseJSON = <T>(
  jsonString: string,
  errorMessage: string = "Invalid JSON format"
): Effect.Effect<T, ApiError, never> =>
  Effect.try({
    try: () => JSON.parse(jsonString) as T,
    catch: () => ({
      success: false as const,
      error: errorMessage,
      statusCode: HttpStatus.BAD_REQUEST,
      details: { input: jsonString },
      timestamp: new Date().toISOString()
    })
  });

// Async file operations
export const fileOperation = <T>(
  operation: () => Promise<T>,
  filename: string
): Effect.Effect<T, ApiError, never> =>
  pipe(
    Effect.tryPromise({
      try: operation,
      catch: (error) => ({
        success: false as const,
        error: `File operation failed: ${filename}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: error,
        timestamp: new Date().toISOString()
      })
    }),
    Effect.tap(() => logInfo(`File operation completed: ${filename}`)),
    withTimeout(5000) // 5 second timeout for file operations
  );

// Environment variable helpers
export const getEnvVar = (
  name: string,
  defaultValue?: string
): Effect.Effect<string, ApiError, never> => {
  const value = process.env[name] || defaultValue;
  return value
    ? Effect.succeed(value)
    : createErrorResponse(
        `Environment variable not found: ${name}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
};

// Concurrent operations
export const runConcurrently = <T extends readonly Effect.Effect<any, any, any>[]>(
  effects: T
): Effect.Effect<
  { [K in keyof T]: T[K] extends Effect.Effect<infer A, any, any> ? A : never },
  any,
  never
> =>
  pipe(
    Effect.all(effects, { concurrency: "unbounded" }),
    Effect.tap(() => logInfo(`Completed ${effects.length} concurrent operations`))
  );

// Sequential operations with logging
export const runSequentially = <T extends readonly Effect.Effect<any, any, any>[]>(
  effects: T
): Effect.Effect<
  { [K in keyof T]: T[K] extends Effect.Effect<infer A, any, any> ? A : never },
  any,
  never
> =>
  pipe(
    Effect.all(effects),
    Effect.tap(() => logInfo(`Completed ${effects.length} sequential operations`))
  );

// Error recovery patterns
export const withFallback = <A, E, R, A2>(
  effect: Effect.Effect<A, E, R>,
  fallback: Effect.Effect<A2, never, never>
): Effect.Effect<A | A2, never, R> =>
  pipe(
    effect,
    Effect.catchAll((error) =>
      pipe(
        logError("Effect failed, using fallback", { error }),
        Effect.andThen(() => fallback)
      )
    )
  );

// Export all utilities
export {
  createSuccessResponse,
  createErrorResponse,
  dbOperation,
  httpRequest,
  validate,
  parseJSON,
  fileOperation,
  getEnvVar,
  runConcurrently,
  runSequentially,
  withFallback
};