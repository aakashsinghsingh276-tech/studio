
"use server";

import {
  getSmartReplySuggestions,
  type SmartReplySuggestionsInput,
} from "@/ai/flows/smart-reply-suggestions";

import {
    describeImage as describeImageFlow,
    type DescribeImageInput,
} from "@/ai/flows/describe-image-flow";

import {
    generateAvatar as generateAvatarFlow,
} from "@/ai/flows/generate-avatar-flow";

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

export async function describeImage(
    input: DescribeImageInput
) {
    if (!input.photoDataUri) {
        return { description: "" };
    }
    try {
        const result = await describeImageFlow(input);
        return result;
    } catch (error) {
        console.error("Error describing image:", error);
        return { description: "Could not analyze image." };
    }
}

export async function generateAvatar(
    prompt: string
) {
    if (!prompt) {
        return { imageUrl: "" };
    }
    try {
        const result = await generateAvatarFlow(prompt);
        return result;
    } catch (error) {
        console.error("Error generating avatar:", error);
        return { imageUrl: null };
    }
}
