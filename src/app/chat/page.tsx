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
            <div className="font-mono text-sm">{msg.content}</div>
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
