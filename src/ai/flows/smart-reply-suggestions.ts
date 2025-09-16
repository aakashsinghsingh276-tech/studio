'use server';

/**
 * @fileOverview An AI agent that suggests smart replies based on message content.
 *
 * - getSmartReplySuggestions - A function that generates smart reply suggestions for a given message.
 * - SmartReplySuggestionsInput - The input type for the getSmartReplySuggestions function.
 * - SmartReplySuggestionsOutput - The return type for the getSmartReplySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartReplySuggestionsInputSchema = z.object({
  message: z.string().describe('The content of the message to generate smart replies for.'),
});
export type SmartReplySuggestionsInput = z.infer<typeof SmartReplySuggestionsInputSchema>;

const SmartReplySuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested smart replies.'),
});
export type SmartReplySuggestionsOutput = z.infer<typeof SmartReplySuggestionsOutputSchema>;

export async function getSmartReplySuggestions(input: SmartReplySuggestionsInput): Promise<SmartReplySuggestionsOutput> {
  return smartReplySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartReplySuggestionsPrompt',
  input: {schema: SmartReplySuggestionsInputSchema},
  output: {schema: SmartReplySuggestionsOutputSchema},
  prompt: `You are a helpful assistant that suggests smart replies for a given message.

  Message: {{{message}}}

  Suggest 3 short and relevant replies to the message.  The replies should be no more than 5 words each.`,
});

const smartReplySuggestionsFlow = ai.defineFlow(
  {
    name: 'smartReplySuggestionsFlow',
    inputSchema: SmartReplySuggestionsInputSchema,
    outputSchema: SmartReplySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
