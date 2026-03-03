import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Lightbulb, Brain, Library } from "lucide-react";
import { LearnInsights } from "@/components/learn/LearnInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { FinanceArticles, ArticleType } from "@/components/learn/FinanceArticles";
import { YouTubeVideos } from "@/components/learn/YouTubeVideos";
import { QuizSection } from "@/components/learn/QuizSection";
import { BooksSection } from "@/components/learn/BooksSection";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = ["All", "Investing", "Budgeting", "Tax", "Savings", "Stocks"];

const learnQuickPrompts = [
  "What is SIP?",
  "Explain compound interest",
  "Tax saving options",
  "How to start investing?",
];

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  category: string;
  thumbnail: string;
}

export default function Learn() {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const handleSelectArticle = (article: ArticleType | null) => {
    setSelectedArticle(article);
    setSelectedVideo(null);
  };

  const handleSelectVideo = (video: VideoItem | null) => {
    setSelectedVideo(video);
    setSelectedArticle(null);
  };

  return (
    <div className="space-y-10 pb-10 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tighter text-foreground flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            {language === 'ta' ? 'கற்றுக்கொள்ளுங்கள்' : 'Financial Academy'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium italic">
            {language === 'ta'
              ? 'சிறந்த முடிவுகள் எடுக்க நிதி கல்வி'
              : 'Structured pathways to achieve absolute financial mastery.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Modules Loaded</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ta' ? 'கட்டுரைகள், வீடியோக்கள் தேடு...' : 'Search academy topics...'}
            className="pl-9 bg-card/50 border-border/50 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={cat === "All" ? "default" : "secondary"}
              className="px-4 py-1.5 rounded-xl cursor-pointer hover:bg-primary/20 transition-all font-bold text-[10px] uppercase tracking-wider"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="articles" className="space-y-8">
            <TabsList className="bg-secondary/30 p-1.5 rounded-2xl border border-border/50 h-auto flex-wrap sm:flex-nowrap gap-1">
              <TabsTrigger value="articles" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest leading-none" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <BookOpen className="h-4 w-4" />
                {language === 'ta' ? 'கட்டுரைகள்' : 'Articles'}
              </TabsTrigger>
              <TabsTrigger value="books" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest leading-none" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <Library className="h-4 w-4" />
                {language === 'ta' ? 'புத்தகங்கள்' : 'Books'}
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest leading-none" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <Video className="h-4 w-4" />
                {language === 'ta' ? 'வீடியோக்கள்' : 'Videos'}
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest leading-none" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <Brain className="h-4 w-4" />
                {language === 'ta' ? 'வினாடி வினா' : 'Quizzes'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
              <FinanceArticles
                onSelectArticle={handleSelectArticle}
                selectedArticle={selectedArticle}
              />
            </TabsContent>

            <TabsContent value="books" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <BooksSection />
            </TabsContent>

            <TabsContent value="videos" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <YouTubeVideos
                onSelectVideo={handleSelectVideo}
                selectedVideo={selectedVideo}
              />
            </TabsContent>

            <TabsContent value="quizzes" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <QuizSection />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <div className="p-1 px-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-between">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Recommended AI Path</span>
            <Lightbulb className="h-4 w-4 text-orange-600" />
          </div>
          <div className="h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
            <AIChatWidget
              context="learn"
              title={language === 'ta' ? 'நிதி ஆசிரியர் AI' : 'Financial Tutor AI'}
              placeholder={language === 'ta' ? 'நிதி கேள்வி கேளுங்கள்...' : 'Ask any finance question...'}
              quickPrompts={learnQuickPrompts}
            />
          </div>
          <LearnInsights />
        </div>
      </div>
    </div>
  );
}
