import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Tool } from "@/data/tools";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = tool.icon as LucideIcon;
  
  return (
    <Link to={tool.path}>
      <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-border/50 bg-card cursor-pointer group rounded-3xl overflow-hidden backdrop-blur-sm hover:border-primary/30">
        <CardHeader className="space-y-4 p-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{ backgroundColor: tool.iconColor }}
          >
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold transition-colors group-hover:text-primary">
            {tool.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            {tool.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
