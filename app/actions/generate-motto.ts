"use server"

import { generateText } from "ai"

export async function generateMotto(): Promise<string> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate a short, inspiring English motto or quote about learning, growth, or language study. 
Keep it under 15 words. Only return the quote itself, no attribution or quotation marks.
Make it motivational and suitable for a language learning app.`,
    })

    return text.trim()
  } catch (error) {
    console.error("Failed to generate motto:", error)
    return "Every word you learn opens a new door."
  }
}
