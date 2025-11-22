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
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border bg-card cursor-pointer group">
        <CardHeader className="space-y-3">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: tool.iconColor }}
          >
            <IconComponent className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-lg font-bold transition-colors group-hover:text-primary">
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
