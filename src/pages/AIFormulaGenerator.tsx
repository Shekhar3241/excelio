import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIFormulaGenerator = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 20MB limit`,
          variant: "destructive",
        });
        continue;
      }
      setUploadedFiles((prev) => [...prev, file]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      role: "user",
      content: input || "Analyzing uploaded files...",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let fileContext = "";
      
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            if (file.type.includes('pdf')) {
              fileContext += `\n\n[PDF File: ${file.name} - PDF parsing in progress]`;
            } else if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
              fileContext += `\n\n[Excel File: ${file.name} - Excel data analysis available]`;
            } else {
              const text = await file.text();
              fileContext += `\n\nFile: ${file.name}\n${text.substring(0, 10000)}`;
            }
          } catch (e) {
            fileContext += `\n\n[File: ${file.name} - Binary file attached]`;
          }
        }
        setUploadedFiles([]);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/conversational-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            fileContext,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      if (reader) {
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
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  aiResponse += content;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    if (newMessages[newMessages.length - 1]?.role === "assistant") {
                      newMessages[newMessages.length - 1].content = aiResponse;
                    } else {
                      newMessages.push({ role: "assistant", content: aiResponse });
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      scrollToBottom();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Helmet>
        <title>AI Excel Assistant - Analyze Your Data</title>
        <meta
          name="description"
          content="Upload Excel, PDF, and other files to get AI-powered insights and analysis."
        />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {messages.length === 0 ? (
            <div className="animate-fade-in">
              <div className="bg-card rounded-3xl shadow-2xl p-12 border border-border/50">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12 animate-scale-in">
                  How can I help you with your Excel?
                </h1>
                
                <div className="flex gap-4 items-center justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full px-8 py-6 text-lg border-2 hover:scale-105 transition-transform"
                  >
                    <Paperclip className="h-5 w-5 mr-3" />
                    Add data
                  </Button>
                  
                  <Button
                    size="lg"
                    className="rounded-full p-6 hover:scale-105 transition-transform"
                    onClick={() => {
                      if (uploadedFiles.length > 0) {
                        handleSend();
                      }
                    }}
                    disabled={uploadedFiles.length === 0}
                  >
                    <ArrowUp className="h-6 w-6" />
                  </Button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-3 font-medium">
                      {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="text-sm px-3 py-1 bg-background rounded-full border border-border"
                        >
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
                <div className="max-h-[60vh] overflow-y-auto p-8 space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] rounded-3xl px-6 py-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-muted rounded-3xl px-6 py-4">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2.5 h-2.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2.5 h-2.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t border-border/50 bg-background/50">
                  <div className="flex gap-3 items-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.xlsx,.xls,.doc,.docx,.txt,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="rounded-full shrink-0"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Ask about your data..."
                        disabled={isLoading}
                        className="resize-none rounded-3xl min-h-[60px] pr-14"
                        rows={2}
                      />
                      {uploadedFiles.length > 0 && (
                        <div className="absolute bottom-2 left-3 text-xs text-muted-foreground">
                          {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleSend}
                      disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                      size="icon"
                      className="rounded-full shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ArrowUp className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIFormulaGenerator;
