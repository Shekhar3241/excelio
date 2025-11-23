import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X, Loader2, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FileContext {
  fileName: string;
  fileType: string;
  content: string;
}

const AIFormulaGenerator = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI data assistant. Upload any file (Excel, PDF, images, documents) and I'll help you analyze and understand your data. You can also ask me questions!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let fileContent = "";
      const fileType = file.type;

      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        fileContent = XLSX.utils.sheet_to_csv(firstSheet);
      } else if (file.type.startsWith("text/") || file.name.endsWith(".csv")) {
        fileContent = await file.text();
      } else if (file.type.startsWith("image/")) {
        fileContent = "Image file uploaded. AI can analyze the image content.";
      } else {
        fileContent = "File uploaded successfully. Content type: " + fileType;
      }

      const context: FileContext = {
        fileName: file.name,
        fileType: fileType,
        content: fileContent,
      };

      setUploadedFile(context);
      toast({
        title: "File uploaded",
        description: `${file.name} uploaded successfully!`,
      });

      const userMessage: Message = {
        role: "user",
        content: `I've uploaded a file: ${file.name}`,
      };
      setMessages((prev) => [...prev, userMessage]);

      await sendMessage([userMessage], context);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messagesToSend: Message[], fileContext?: FileContext) => {
    setIsLoading(true);
    
    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/conversational-ai`;
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messagesToSend,
          fileContext: fileContext || uploadedFile,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    await sendMessage([...messages, userMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    toast({
      title: "File removed",
      description: "File context cleared",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>AI Chat Assistant - Analyze Your Data</title>
        <meta name="description" content="Chat with AI to analyze Excel, PDF, images, and documents." />
      </Helmet>

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-accent/20 rounded-full animate-scale-in">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold text-accent">AI-Powered Chat</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
              Chat with AI
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload files and get instant insights
            </p>
          </div>

          <Card className="h-[600px] flex flex-col border-2 border-border shadow-2xl animate-scale-in">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                <Bot className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Always online</p>
              </div>
              {uploadedFile && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full animate-fade-in">
                  <span className="text-xs text-foreground truncate max-w-[200px]">
                    {uploadedFile.fileName}
                  </span>
                  <Button
                    onClick={removeFile}
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-accent/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-fade-in ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary/20"
                        : "bg-accent/20 animate-pulse"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card text-foreground border border-border rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                    <Bot className="h-4 w-4 text-accent" />
                  </div>
                  <div className="bg-card text-foreground border border-border px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-accent rounded-full animate-[bounce_1s_ease-in-out_0s_infinite]" />
                      <div className="h-2 w-2 bg-accent rounded-full animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
                      <div className="h-2 w-2 bg-accent rounded-full animate-[bounce_1s_ease-in-out_0.4s_infinite]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf,.txt,.png,.jpg,.jpeg,.webp,.doc,.docx"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="icon"
                  className="shrink-0 hover:scale-110 transition-transform"
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send)"
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="shrink-0 hover:scale-110 transition-transform"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              { title: "Multi-Format", desc: "Excel, PDF, CSV, Images" },
              { title: "Smart Analysis", desc: "AI-powered insights" },
              { title: "Real-time", desc: "Instant responses" },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-4 border-border bg-card hover:border-accent transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIFormulaGenerator;
