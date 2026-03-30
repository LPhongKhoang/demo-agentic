import { openAIGeminiClient } from "../core/ai-model/gemini.model.js";

export async function getGeminiResponse(prompt) {
  try {
    const response = await openAIGeminiClient.chat.completions.create({
      model: 'gemini-3-flash-preview',
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching Gemini response:', error);
    throw error;
  }
}

function exampleUsage() {
  const prompt = "Explain the theory of relativity in simple terms.";
  getGeminiResponse(prompt)
    .then(response => {
      console.log("Gemini Response:", response);
    })
    .catch(error => {
      console.error("Failed to get response:", error);
    });
}

// Uncomment the line below to run the example usage when this file is executed directly
// exampleUsage();