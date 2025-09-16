"use server";

import {
  getSmartReplySuggestions,
  type SmartReplySuggestionsInput,
} from "@/ai/flows/smart-reply-suggestions";

export async function generateSmartReplies(
  input: SmartReplySuggestionsInput
) {
  if (!input.message) {
    return { suggestions: [] };
  }
  try {
    const result = await getSmartReplySuggestions(input);
    return result;
  } catch (error) {
    console.error("Error generating smart replies:", error);
    // Gracefully fail by returning no suggestions
    return { suggestions: [] };
  }
}
