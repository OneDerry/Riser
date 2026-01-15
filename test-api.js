// Test script to verify Nigeria states API functionality
import { fetchStates, fetchLGAsByState } from "./src/lib/api/nigeria-states.js";

async function testAPI() {
  console.log("Testing fetchStates...");
  try {
    const states = await fetchStates();
    console.log("✅ States fetched successfully:", states.length, "states");
    console.log("First 5 states:", states.slice(0, 5));

    // Test LGAs for a specific state
    console.log("\nTesting fetchLGAsByState for Lagos...");
    const lagosLGAs = await fetchLGAsByState("Lagos");
    console.log(
      "✅ Lagos LGAs fetched successfully:",
      lagosLGAs.length,
      "LGAs"
    );
    console.log("First 5 Lagos LGAs:", lagosLGAs.slice(0, 5));

    // Test LGAs for another state
    console.log("\nTesting fetchLGAsByState for Kano...");
    const kanoLGAs = await fetchLGAsByState("Kano");
    console.log("✅ Kano LGAs fetched successfully:", kanoLGAs.length, "LGAs");
    console.log("First 5 Kano LGAs:", kanoLGAs.slice(0, 5));

    // Test with invalid state
    console.log("\nTesting fetchLGAsByState for invalid state...");
    const invalidLGAs = await fetchLGAsByState("InvalidState");
    console.log(
      "✅ Invalid state handled correctly:",
      invalidLGAs.length,
      "LGAs"
    );
  } catch (error) {
    console.error("❌ Error testing API:", error);
  }
}

testAPI();
