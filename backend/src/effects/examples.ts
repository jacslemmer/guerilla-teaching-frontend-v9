/**
 * Effect-TS Usage Examples for Backend
 * 
 * This module demonstrates how to use Effect-TS patterns
 * in real backend scenarios.
 */

import { Effect, pipe } from "effect";
import { Request, Response } from "express";
import { runEffect } from "../config/effects";
import {
  createSuccessResponse,
  createErrorResponse,
  dbOperation,
  httpRequest,
  validate,
  parseJSON,
  withFallback
} from "./index";
import { ApiResponse, HttpStatus } from "@guerilla-teaching/shared-types";

// Example: User validation
interface User {
  id: string;
  email: string;
  name: string;
}

const isUser = (data: unknown): data is User => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as any).id === "string" &&
    typeof (data as any).email === "string" &&
    typeof (data as any).name === "string"
  );
};

// Example: Database user lookup with Effect patterns
export const getUserFromDatabase = (userId: string): Effect.Effect<User, any, never> =>
  dbOperation(
    async () => {
      // Simulate database lookup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (userId === "invalid") {
        throw new Error("User not found");
      }
      
      return {
        id: userId,
        email: `user${userId}@example.com`,
        name: `User ${userId}`
      };
    },
    `getUserFromDatabase(${userId})`
  );

// Example: External API call with fallback
export const getUserFromExternalAPI = (userId: string): Effect.Effect<User, any, never> =>
  pipe(
    httpRequest(
      async () => {
        // Simulate external API call
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error("API request failed");
        return response.json();
      },
      `getUserFromExternalAPI(${userId})`
    ),
    Effect.andThen((data) => validate(data, isUser, "Invalid user data from external API"))
  );

// Example: Complete user service with fallback strategy
export const getUser = (userId: string): Effect.Effect<ApiResponse<User>, any, never> =>
  pipe(
    // Try database first
    getUserFromDatabase(userId),
    // Fallback to external API if database fails
    withFallback(getUserFromExternalAPI(userId)),
    // Fallback to default user if everything fails
    withFallback(
      Effect.succeed({
        id: userId,
        email: "fallback@example.com",
        name: "Fallback User"
      })
    ),
    Effect.andThen((user) => createSuccessResponse(user, "User retrieved successfully"))
  );

// Example: Express route handler using Effect
export const handleGetUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  if (!userId) {
    const errorResponse = await runEffect(
      createErrorResponse("User ID is required", HttpStatus.BAD_REQUEST)
    ).catch(err => err);
    
    return res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  try {
    const result = await runEffect(getUser(userId));
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    const errorResponse = await runEffect(
      createErrorResponse(
        "Failed to retrieve user", 
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      )
    ).catch(err => err);
    
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};

// Example: JSON parsing with validation
export const parseUserJSON = (jsonString: string): Effect.Effect<User, any, never> =>
  pipe(
    parseJSON<unknown>(jsonString, "Invalid user JSON"),
    Effect.andThen((data) => validate(data, isUser, "Invalid user data structure"))
  );

// Example: Batch user processing
export const processBatchUsers = (userIds: string[]): Effect.Effect<ApiResponse<User[]>, any, never> =>
  pipe(
    Effect.all(
      userIds.map((id) => 
        pipe(
          getUser(id),
          Effect.andThen((response) => Effect.succeed(response.data))
        )
      ),
      { concurrency: 5 } // Process up to 5 users concurrently
    ),
    Effect.andThen((users) => 
      createSuccessResponse(users, `Processed ${users.length} users successfully`)
    )
  );

// Example: Express route for batch processing
export const handleBatchUsers = async (req: Request, res: Response) => {
  try {
    const userIds = req.body.userIds;
    
    if (!Array.isArray(userIds)) {
      const errorResponse = await runEffect(
        createErrorResponse("userIds must be an array", HttpStatus.BAD_REQUEST)
      ).catch(err => err);
      
      return res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    }

    const result = await runEffect(processBatchUsers(userIds));
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    const errorResponse = await runEffect(
      createErrorResponse(
        "Batch processing failed", 
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      )
    ).catch(err => err);
    
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};

// Export example handlers for documentation
export const examples = {
  getUserFromDatabase,
  getUserFromExternalAPI,
  getUser,
  handleGetUser,
  parseUserJSON,
  processBatchUsers,
  handleBatchUsers
};