import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ChevronRight } from "lucide-react";

interface ArticleCardProps {
  title: string;
  description: string;
  category: string;
  readTime: string;
  image?: string;
  isNew?: boolean;
}

export function ArticleCard({ title, description, category, readTime, isNew }: ArticleCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{category}</Badge>
              {isNew && <Badge className="bg-primary/20 text-primary text-xs">New</Badge>}
            </div>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Article
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
