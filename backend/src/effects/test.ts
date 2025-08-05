/**
 * Simple test to verify Effect-TS integration is working
 */

import { Effect } from "effect";
import { runEffect, logInfo } from "../config/effects";
import { createSuccessResponse, dbOperation } from "./index";

// Simple test function
const testEffect = async () => {
  console.log("Testing Effect-TS integration...");
  
  try {
    // Test basic Effect creation and execution
    const result = await runEffect(
      Effect.succeed("Effect-TS is working!")
    );
    console.log("✅ Basic Effect:", result);

    // Test logging
    await runEffect(logInfo("Test log message", { test: true }));
    console.log("✅ Logging: Working");

    // Test success response creation
    const apiResponse = await runEffect(
      createSuccessResponse({ message: "Test data" }, "Test successful")
    );
    console.log("✅ API Response:", apiResponse);

    // Test database operation simulation
    const dbResult = await runEffect(
      dbOperation(
        async () => ({ id: "123", name: "Test User" }),
        "testDatabaseOperation"
      )
    );
    console.log("✅ DB Operation:", dbResult);

    console.log("\n🎉 All Effect-TS tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Effect-TS test failed:", error);
    return false;
  }
};

// Export for testing
export { testEffect };