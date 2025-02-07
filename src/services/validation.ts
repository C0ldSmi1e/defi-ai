import { together } from "@/lib/together-ai";

export type ValidationResponse = {
  isValid: boolean;
  message?: string;
  ca?: string;
}

const validateSolanaCA = async (input: string): Promise<ValidationResponse> => {
  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
      messages: [
        {
          role: "system",
          content: `You are a validator that checks if the user's input contains a Solana contract address (CA) for analysis. 
          A Solana address is a base58-encoded string, 32-44 characters long. 
          Only respond with JSON in the following format:
          {
            "isValid": boolean,
            "message": string (error message if invalid, or null if valid),
            "ca": string (the extracted CA if valid, or null if invalid)
          }`
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0,
      max_tokens: 200,
    });

    if (!response.choices[0]?.message?.content) {
      return {
        isValid: false,
        message: "Invalid response from AI"
      };
    }

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error validating input:", error);
    return {
      isValid: false,
      message: "Sorry, there was an error processing your request. Please try again."
    };
  }
}; 

export { validateSolanaCA };