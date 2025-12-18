import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, ExternalLink, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNews, NewsArticle } from "@/hooks/useNews";
import { formatDistanceToNow } from "date-fns";

const sentimentConfig = {
  positive: { icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/20" },
  negative: { icon: TrendingDown, color: "text-red-400 bg-red-400/20" },
  neutral: { icon: Minus, color: "text-muted-foreground bg-muted" },
};

export function NewsPanel() {
  const { news, loading, refetch } = useNews();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Market News
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.slice(0, 5).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
        
        {news.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-4">
            No news available at the moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  const sentiment = article.sentiment || 'neutral';
  const SentimentIcon = sentimentConfig[sentiment].icon;

  return (
    <div className="group p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex gap-3">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <Badge 
              variant="outline" 
              className={`flex-shrink-0 ${sentimentConfig[sentiment].color}`}
            >
              <SentimentIcon className="h-3 w-3" />
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {article.summary}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{article.source}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
            </div>
            {article.url && article.url !== '#' && (
              <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
