import FirecrawlApp from "@mendable/firecrawl-js";
import { together } from "@/lib/together-ai";

if (!process.env.FIRECRAWL_API_KEY) {
  throw new Error("Missing FIRECRAWL_API_KEY environment variable");
}

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY
});

const getTokenNarrative = async (website: string) => {
  try {
    const result = await firecrawl.scrapeUrl(website, {
      formats: ["markdown"]
    });

    if (!result.success || !result.markdown) {
      return "No narrative found";
    }

    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "Summarize the project's narrative, vision, and unique value proposition in 2-3 sentences. Focus on what makes this project special."
        },
        {
          role: "user",
          content: result.markdown
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    return response.choices[0]?.message?.content || "No narrative found";
  } catch (error) {
    console.error("Error fetching narrative:", error);
    return "Failed to fetch narrative";
  }
};

const validateAndCleanJson = async (jsonString: string) => {
  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
      messages: [
        {
          role: "system",
          content: "You are a JSON validator. Return ONLY the valid JSON string, without any markdown tags or additional text. If the input is not valid JSON, fix it and return the corrected JSON."
        },
        {
          role: "user",
          content: jsonString
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const cleanJson = response.choices[0]?.message?.content || "";
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error validating JSON:", error);
    throw new Error("Failed to validate JSON response");
  }
};

const analyzeDexScreener = async (ca: string) => {
  try {
    const result = await firecrawl.scrapeUrl(`https://dexscreener.com/solana/${ca}`, {
      formats: ["html"]
    });

    if (!result.success) {
      throw new Error(`Failed to scrape: ${result.error}`);
    }

    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
      messages: [
        {
          role: "system",
          content: `Extract token information from the DEXScreener HTML into this JSON format:
          {
            "name": string,
            "symbol": string,
            "price": string,
            "marketCap": string,
            "liquidity": string,
            "volume24h": string,
            "priceChange24h": string,
            "holders": string,
            "website": string,
            "twitter": string (optional),
            "telegram": string (optional),
          }

          Your response should be in JSON format without any other text).
          You do NOT need to give any other text or markdown tags.
          `
        },
        {
          role: "user",
          content: result.html || ""
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("Invalid response from AI");
    }

    console.log("Raw response:", response.choices[0].message.content);
    
    const tokenInfo = await validateAndCleanJson(response.choices[0].message.content);

    if (tokenInfo.website) {
      const narrative = await getTokenNarrative(tokenInfo.website);
      return { ...tokenInfo, narrative };
    }

    return tokenInfo;

  } catch (error) {
    console.error("Error fetching DEXScreener data:", error);
    throw error;
  }
}; 

export { analyzeDexScreener };