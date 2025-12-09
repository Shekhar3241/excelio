import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Excel assistant. Ask me anything about Excel formulas or functions."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (isMobile && inputRef.current) {
      inputRef.current.blur();
    }

    try {
      const { data, error } = await supabase.functions.invoke("chat-assistant", {
        body: { messages: [...messages, userMessage] }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-all z-50 bg-primary`}
        size="icon"
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isMobile ? 'inset-0' : 'bottom-6 right-6 w-[380px] h-[520px] rounded-xl'} bg-background border shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-200`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <span className="font-medium text-sm">Excel Assistant</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          code: ({ className, children, ...props }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono text-primary" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-background/50 p-2 rounded text-xs font-mono my-2 overflow-x-auto" {...props}>
                                {children}
                              </code>
                            );
                          },
                          pre: ({ children }) => <pre className="overflow-x-auto">{children}</pre>,
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2 rounded border">
                              <table className="w-full text-xs border-collapse">{children}</table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
                          tbody: ({ children }) => <tbody>{children}</tbody>,
                          tr: ({ children }) => <tr className="border-b last:border-b-0">{children}</tr>,
                          th: ({ children }) => <th className="px-2 py-1.5 text-left font-medium border-r last:border-r-0">{children}</th>,
                          td: ({ children }) => <td className="px-2 py-1.5 border-r last:border-r-0">{children}</td>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <span className="leading-relaxed">{message.content}</span>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Excel..."
                disabled={isLoading}
                className="flex-1 h-9 text-sm bg-muted/30 border-0 focus-visible:ring-1"
                style={{ fontSize: isMobile ? '16px' : undefined }}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-9 w-9 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
