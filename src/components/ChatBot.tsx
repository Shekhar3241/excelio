import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

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
      content: "Hi! I'm your Excel formula assistant. Ask me anything about Excel formulas or describe what you want to calculate, and I'll help you find the right solution! 📊"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatMessage = (content: string) => {
    // Split by code blocks and format formulas
    const parts = content.split(/(`[^`]+`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const formula = part.slice(1, -1);
        return (
          <code key={index} className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm block my-1">
            {formula}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus input when chat opens (desktop only)
  useEffect(() => {
    if (isOpen && !isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMobile]);

  // Prevent body scroll when chat is open on mobile
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

    // Blur input on mobile to hide keyboard
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
      // Remove user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed ${isMobile ? 'bottom-4 right-4 h-12 w-12' : 'bottom-6 right-6 h-14 w-14'} rounded-full shadow-lg hover:scale-110 transition-transform z-50`}
        size="icon"
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <MessageCircle className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed ${isMobile ? 'inset-0 rounded-none' : 'bottom-6 right-6 w-96 h-[600px] rounded-2xl'} shadow-2xl z-50 flex flex-col border-2 animate-in slide-in-from-bottom-4 duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-semibold">Excel Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-dark shrink-0"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className={`flex-1 ${isMobile ? 'p-3' : 'p-4'} overflow-y-auto`} ref={scrollRef}>
            <div className={`space-y-3 ${isMobile ? 'pb-4' : ''}`}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`${isMobile ? 'max-w-[85%]' : 'max-w-[80%]'} rounded-2xl ${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'} shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-accent text-accent-foreground rounded-bl-sm"
                    }`}
                  >
                    <div className={`${isMobile ? 'text-sm' : 'text-sm'} leading-relaxed whitespace-pre-wrap break-words`}>
                      {formatMessage(message.content)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="bg-accent text-accent-foreground rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className={`${isMobile ? 'p-3 pb-4' : 'p-4'} border-t bg-background`}>
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
                onKeyPress={handleKeyPress}
                placeholder={isMobile ? "Ask about formulas..." : "Ask about Excel formulas..."}
                disabled={isLoading}
                className={`flex-1 ${isMobile ? 'text-base' : ''}`}
                style={{ fontSize: isMobile ? '16px' : undefined }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="shrink-0 h-10 w-10"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
