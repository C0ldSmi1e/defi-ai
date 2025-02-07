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

      // Add empty response message
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
    <div className="w-full flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg whitespace-pre-wrap font-mono ${
              msg.type === "prompt"
                ? "bg-muted ml-auto max-w-[80%]"
                : msg.type === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 border-t p-4 bg-background">
        {isLoading && (
          <div className="absolute -top-8 left-0 right-0 text-center">
            <div className="inline-block px-3 py-1 text-sm text-muted-foreground bg-muted rounded-t-lg">
              Analyzing token data...
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Enter a Solana contract address to analyze..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Send"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Note: We currently only support Solana CA analysis.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
