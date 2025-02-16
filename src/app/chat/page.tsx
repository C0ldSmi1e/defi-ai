"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Message {
  type: "prompt" | "response" | "error";
  content: string;
  id: string;
}

const ChatPage = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    const promptId = Date.now().toString();
    const responseId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, { type: "prompt", content: prompt, id: promptId }]);
    setPrompt("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      setMessages(prev => [...prev, { type: "response", content: "", id: responseId }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            
            try {
              const json = JSON.parse(data);
              const token = json.choices[0]?.delta?.content || "";
              
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === responseId 
                    ? { ...msg, content: msg.content + token }
                    : msg
                )
              );
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: "error", 
        content: error instanceof Error ? error.message : "Failed to send message",
        id: Date.now().toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  /*
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);

    const promptId = Date.now().toString();
    const responseId = (Date.now() + 1).toString();
    const thinkingId = (Date.now() + 2).toString();

    setMessages(prev => [...prev, { type: "prompt", content: prompt, id: promptId }]);
    setPrompt("");

    // Add initial delay of 2.5s
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Add thinking message first
    const agentThinking = `Agent Thinking:
I began by reviewing the key metrics: CWIF has a slight 2.37% increase in the last 24 hours, but its low market cap, liquidity, and volume highlight the high-risk nature of the token. The narrative reveals that CWIF is a community-driven Solana memecoin with a deflationary twist, though it lacks a formal team or roadmap. Given your past trading patterns on SolScan—where you've successfully capitalized on small movements in similar low-liquidity assets—I’ll provide precise entry, exit, and risk management steps tailored to your profile. I’m suggesting specific limit order prices, scaling techniques, and stop-loss levels that have worked well for your previous trades in volatile tokens.`;

    setMessages(prev => [...prev, { type: "response", content: "", id: thinkingId }]);

    // Stream thinking message
    for (let i = 0; i < agentThinking.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 15));
      setMessages(prev => 
        prev.map(msg => 
          msg.id === thinkingId 
            ? { ...msg, content: agentThinking.slice(0, i + 1) }
            : msg
        )
      );
    }

    // Wait a bit before starting the analysis
    await new Promise(resolve => setTimeout(resolve, 500));

    // Main analysis response
    const mockResponse = `📊 CWIF | Catwifhat ANALYSIS
━━━━━━━━━━━━━━━━━━━━━
💰 Price: $0.0000001296  
📈 24h Change: 2.37%  
💎 Market Cap: $4.0M  
💧 Liquidity: $1.2M  
📊 24h Volume: $15K  
👥 Holders: 18,618

🔍 ANALYSIS  
CWIF has experienced a modest 2.37% uptick in the past 24 hours, signaling a slight bullish move. However, its low liquidity and market cap underscore a high-risk profile, making it susceptible to sudden swings. The token's narrative as a community-driven Solana memecoin with a deflationary mechanism is intriguing, though the absence of a formal team or roadmap adds uncertainty regarding long-term direction.

🎯 SPECIFIC SUGGESTIONS  
Based on your wallet's historical trading behavior, here are tailored strategies for CWIF:

1. Entry Strategy:  
   - Primary Buy: Consider placing a limit order at $0.0000001280—this represents roughly a 1.2% pullback from the current price, which has worked well for your previous low-volume entries.  
   - Scaling In: If initial movement confirms your entry, add a second position with a limit order at $0.0000001270 to average down in case of further dips.

2. Exit Strategy:  
   - Initial Profit-Taking: Set a target to take partial profits at $0.0000001325 (about a 2.7% gain from current levels) to capture early momentum.  
   - Secondary Target: Consider a second exit point at $0.0000001350 for an additional 4% gain, similar to exit levels you’ve utilized in prior trades.

3. Risk Management:  
   - Stop Loss: Given the token's volatility, place a stop loss at $0.0000001260 (approximately a 2.5% drop from your primary entry), aligning with your standard risk threshold for high-risk assets.  
   - Trailing Stop: Once the price reaches the initial profit target, implement a trailing stop of 1.5% to protect gains while allowing room for further upward movement.

4. Monitoring & Adjustments:  
   - Liquidity & Volume Check: With such low trading volume, continuously monitor order book depth and recent trades to catch any signs of a sudden reversal.  
   - Community Sentiment: Engage with community channels to stay updated on any news or shifts in sentiment, as changes here might provide early warnings for adjustments.

These specific actions are calibrated to leverage small price movements while managing risk effectively, based on the trading patterns observed in your wallet history.`;

    // Add initial empty response
    setMessages(prev => [...prev, { type: "response", content: "", id: responseId }]);

    // Stream main analysis
    for (let i = 0; i < mockResponse.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 25));
      setMessages(prev => 
        prev.map(msg => 
          msg.id === responseId 
            ? { ...msg, content: mockResponse.slice(0, i + 1) }
            : msg
        )
      );
    }

    setIsLoading(false);
  };
  */

  return (
    <div className="w-full flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-xl backdrop-blur-sm transition-all ${
              msg.type === "prompt"
                ? "bg-blue-500/10 border border-blue-500/20 ml-auto max-w-[80%]"
                : msg.type === "error"
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-purple-500/10 border border-purple-500/20"
            }`}
          >
            <pre className="font-mono text-sm whitespace-pre-wrap break-words">
              {msg.content}
            </pre>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm p-4 rounded-xl">
        {isLoading && (
          <div className="absolute -top-8 left-0 right-0 text-center">
            <div className="inline-block px-3 py-1 text-sm bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              Processing...
            </div>
          </div>
        )}
        <form 
          onSubmit={handleSubmit} 
          className="w-full flex flex-col gap-2"
          autoComplete="off"
          spellCheck="false"
        >
          <div className="flex gap-2">
            <Input
              className="flex-1 bg-gray-800/50 border-gray-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-gray-500"
              placeholder="Enter a Solana contract address..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
            >
              {isLoading ? "Processing..." : "Send"}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Note: We currently only support Solana CA analysis.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
