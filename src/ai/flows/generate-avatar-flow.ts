
'use server';

/**
 * @fileOverview An AI agent that generates a user avatar from a text prompt.
 *
 * - generateAvatar - A function that handles the avatar generation process.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAvatarOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated avatar image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(prompt: string): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(prompt);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: z.string(),
    outputSchema: GenerateAvatarOutputSchema,
  },
  async (prompt) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a circular profile picture avatar based on the following description: ${prompt}. The image should be suitable for a chat application avatar. Do not include any text or borders.`,
      config: {
        aspectRatio: "1:1"
      }
    });
    
    if (!media.url) {
        throw new Error("Image generation failed to return a URL.");
    }
    
    return { imageUrl: media.url };
  }
);
