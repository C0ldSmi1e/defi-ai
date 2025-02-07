import { NextRequest } from "next/server";
import { analyzeDexScreener } from "@/services/dexscreener";
import { validateSolanaCA, ValidationResponse } from "@/services/validation";
import { together } from "@/lib/together-ai";
import { TokenInfo } from "@/app/types/token";

async function analyzeTokenData(tokenInfo: TokenInfo) {
  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: `You are a crypto analyst. Create a concise analysis of the token using the provided data.
          Format your response in this style:
          
          📊 TOKEN_SYMBOL | TOKEN_NAME
          ━━━━━━━━━━━━━━━━━━━━━━
          💰 Price: $X.XX
          📈 24h Change: XX%
          💎 Market Cap: $XXX
          💧 Liquidity: $XXX
          📊 24h Volume: $XXX
          👥 Holders: XXX
          
          🔍 ANALYSIS
          Brief 2-3 sentence market analysis based on metrics
          
          ${tokenInfo.narrative ? "🎯 NARRATIVE\nBrief analysis of project narrative and potential" : ""}

          🗣️ REMARKS
          The feature of round table, where you can get remarks from experts from various fields, is COMING SOON 🚀!
          `

        },
        {
          role: "user",
          content: JSON.stringify(tokenInfo)
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || "Failed to analyze token";
  } catch (error) {
    console.error("Error analyzing token:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    // First validate if it's a CA request
    const validationResponse = await validateSolanaCA(message);

    if (!validationResponse.isValid) {
      return new Response(validationResponse.message, { status: 400 });
    }


    const validation = validationResponse as ValidationResponse;

    if (!validation.isValid || !validation.ca) {
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(new TextEncoder().encode(
            `data: ${JSON.stringify({ choices: [{ delta: { content: "Please provide a valid Solana contract address." } }] })}\n\n`
          ));
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/event-stream" },
      });
    }

    // Get DEXScreener data
    const dexData = await analyzeDexScreener(validation.ca);
    
    // Analyze the token data
    const analysis = await analyzeTokenData(dexData);

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(new TextEncoder().encode(
          `data: ${JSON.stringify({ choices: [{ delta: { content: analysis } }] })}\n\n`
        ));
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}