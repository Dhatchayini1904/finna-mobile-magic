import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Clock, BookOpen } from "lucide-react";

interface Article {
  title: string;
  description: string;
  category: string;
  readTime: string;
  source: string;
  url: string;
  isNew?: boolean;
}

interface ArticleViewerProps {
  article: Article;
  onClose: () => void;
}

export function ArticleViewer({ article, onClose }: ArticleViewerProps) {
  return (
    <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{article.category}</Badge>
            {article.isNew && <Badge className="bg-primary/20 text-primary">New</Badge>}
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {article.readTime}
            </Badge>
          </div>
          <CardTitle className="text-xl">{article.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{article.description}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
          <iframe
            src={article.url}
            className="w-full h-full rounded-xl"
            title={article.title}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Source: {article.source}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
