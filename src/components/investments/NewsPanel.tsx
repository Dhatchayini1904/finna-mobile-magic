import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, RefreshCw, TrendingUp, TrendingDown, Minus, Clock, BookOpen, ChevronRight, Loader2, ExternalLink } from "lucide-react";
import { useNews, NewsArticle } from "@/hooks/useNews";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const sentimentConfig = {
  positive: { icon: TrendingUp, color: "text-green-600 bg-green-500/10 border-green-500/20" },
  negative: { icon: TrendingDown, color: "text-red-600 bg-red-500/10 border-red-500/20" },
  neutral: { icon: Minus, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
};

export function NewsPanel() {
  const { news, loading, refetch, fetchArticleContent } = useNews();
  const { t } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [readingContent, setReadingContent] = useState<string | null>(null);
  const [isReadingLoading, setIsReadingLoading] = useState(false);

  const handleReadArticle = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setReadingContent(null);
    setIsReadingLoading(true);
    const content = await fetchArticleContent(article.url);
    setReadingContent(content);
    setIsReadingLoading(false);
  };


  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t('marketNews')}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('syncFeeds')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p>{t('thinking')}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {news.map((article) => (
                <div
                  key={article.id}
                  className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-background/50 border border-border/40 hover:border-primary/30 transition-all hover:shadow-md cursor-pointer"
                  onClick={() => handleReadArticle(article)}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 border-transparent">
                          {article.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`gap-1 ${sentimentConfig[article.sentiment || 'neutral'].color}`}
                        >
                          {article.sentiment === 'positive' && <TrendingUp className="h-3 w-3" />}
                          {article.sentiment === 'negative' && <TrendingDown className="h-3 w-3" />}
                          {article.sentiment || 'neutral'}
                        </Badge>
                        {article.aiAnalysis && (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 font-black text-[10px] uppercase tracking-tighter shadow-sm animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            AI Perspective
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {format(parseISO(article.publishedAt), "MMM dd • hh:mm aa")}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-base group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    {article.aiAnalysis && (
                      <div className="mt-4 p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 space-y-3 group-hover:bg-amber-500/[0.05] transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1 px-2 rounded-lg bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest leading-none">AI Intelligence</div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Market Impact</p>
                            <p className="text-sm font-semibold text-secondary-foreground leading-tight">{article.aiAnalysis.marketImpact}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Key Takeaway</p>
                            <p className="text-sm font-semibold text-secondary-foreground leading-tight">{article.aiAnalysis.keyTakeaway}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-amber-500/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Analysis Summary</p>
                          <p className="text-sm text-muted-foreground font-medium italic italic">"{article.aiAnalysis.summary}"</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Newspaper className="h-3 w-3" /> {article.source}
                      </span>
                      <div className="flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('readArticle')} <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {news.length === 0 && !loading && (
            <div className="text-center py-12 bg-secondary/20 rounded-xl">
              <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No financial news available at the moment.</p>
              <Button variant="link" onClick={() => refetch()} className="mt-2">Try refreshing</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* In-App Reader Sheet */}
      <Sheet open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <SheetContent side="right" className="sm:max-w-xl w-full p-0">
          <ScrollArea className="h-full">
            <div className="p-6 md:p-8 space-y-6">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-transparent">
                    {selectedArticle?.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedArticle && format(parseISO(selectedArticle.publishedAt), "MMM dd, yyyy • hh:mm aa")}
                  </span>
                </div>
                <SheetTitle className="text-2xl md:text-3xl font-bold font-display leading-tight">
                  {selectedArticle?.title}
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground flex items-center gap-1">
                  Source: <span className="font-semibold text-foreground underline decoration-primary/30 underline-offset-4">{selectedArticle?.source}</span>
                </SheetDescription>
              </SheetHeader>

              <div className="h-px bg-border/60" />

              <div className="prose prose-sm dark:prose-invert max-w-none">
                {isReadingLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="animate-pulse">Fetching full report...</p>
                  </div>
                ) : readingContent ? (
                  <div
                    className="space-y-4 text-secondary-foreground leading-relaxed text-base"
                    dangerouslySetInnerHTML={{ __html: readingContent }}
                  />
                ) : (
                  <div className="space-y-4 h-[60vh] flex flex-col">
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50">
                      <div>
                        <p className="text-sm font-bold text-foreground">Reading via In-App Viewer</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Full scraping unavailable for this source</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold uppercase gap-2" onClick={() => window.open(selectedArticle?.url, '_blank')}>
                        <ExternalLink className="h-3 w-3" /> External Link
                      </Button>
                    </div>
                    <div className="flex-1 bg-white rounded-xl overflow-hidden border border-border/40 shadow-inner">
                      <iframe
                        src={selectedArticle?.url}
                        className="w-full h-full"
                        title="News Article"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
