import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Lightbulb, Brain } from "lucide-react";
import { LearnInsights } from "@/components/learn/LearnInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { FinanceArticles, ArticleType } from "@/components/learn/FinanceArticles";
import { YouTubeVideos } from "@/components/learn/YouTubeVideos";
import { QuizSection } from "@/components/learn/QuizSection";
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
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold font-display">
          {language === 'ta' ? 'கற்றுக்கொள்ளுங்கள்' : 'Learn'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ta' 
            ? 'சிறந்த முடிவுகள் எடுக்க நிதி கல்வி' 
            : 'Financial education to help you make smarter decisions'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'ta' ? 'கட்டுரைகள், வீடியோக்கள் தேடு...' : 'Search articles, videos, topics...'} 
            className="pl-9" 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Badge 
              key={cat} 
              variant={cat === "All" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/20"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="articles" className="space-y-4">
            <TabsList>
              <TabsTrigger value="articles" className="gap-2" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <BookOpen className="h-4 w-4" />
                {language === 'ta' ? 'கட்டுரைகள்' : 'Articles'}
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <Video className="h-4 w-4" />
                {language === 'ta' ? 'வீடியோக்கள்' : 'Videos'}
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="gap-2" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <Brain className="h-4 w-4" />
                {language === 'ta' ? 'வினாடி வினா' : 'Quizzes'}
              </TabsTrigger>
              <TabsTrigger value="tips" className="gap-2" onClick={() => { setSelectedArticle(null); setSelectedVideo(null); }}>
                <Lightbulb className="h-4 w-4" />
                {language === 'ta' ? 'குறிப்புகள்' : 'Quick Tips'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              <FinanceArticles 
                onSelectArticle={handleSelectArticle}
                selectedArticle={selectedArticle}
              />
            </TabsContent>

            <TabsContent value="videos">
              <YouTubeVideos 
                onSelectVideo={handleSelectVideo}
                selectedVideo={selectedVideo}
              />
            </TabsContent>

            <TabsContent value="quizzes">
              <QuizSection />
            </TabsContent>

            <TabsContent value="tips">
              <LearnInsights />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <LearnInsights />
          <div className="h-[400px]">
            <AIChatWidget
              context="learn"
              title={language === 'ta' ? 'நிதி ஆசிரியர் AI' : 'Financial Tutor AI'}
              placeholder={language === 'ta' ? 'நிதி கேள்வி கேளுங்கள்...' : 'Ask any finance question...'}
              quickPrompts={learnQuickPrompts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
