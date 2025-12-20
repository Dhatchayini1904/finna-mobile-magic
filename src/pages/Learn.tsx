import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Lightbulb, Brain } from "lucide-react";
import { LearnInsights } from "@/components/learn/LearnInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { FinanceArticles } from "@/components/learn/FinanceArticles";
import { YouTubeVideos } from "@/components/learn/YouTubeVideos";
import { QuizSection } from "@/components/learn/QuizSection";

const articles = [
  {
    title: "Understanding Mutual Funds: A Beginner's Complete Guide",
    description: "Learn the basics of mutual funds, types, and how to start investing with just ₹500",
    category: "Investing",
    readTime: "8 min read",
    isNew: true,
  },
  {
    title: "How to Create Your First Budget Using the 50/30/20 Rule",
    description: "A simple framework to manage your money and start saving effectively",
    category: "Budgeting",
    readTime: "5 min read",
  },
  {
    title: "Tax Saving Strategies for Salaried Employees in India",
    description: "Maximize your take-home salary with these legal tax saving instruments",
    category: "Tax",
    readTime: "10 min read",
  },
  {
    title: "SIP vs Lump Sum: Which Investment Strategy is Better?",
    description: "Understand when to use SIP and when lump sum investing makes more sense",
    category: "Investing",
    readTime: "6 min read",
  },
  {
    title: "Building an Emergency Fund: Step-by-Step Guide",
    description: "Why you need one and how to build it without affecting your lifestyle",
    category: "Savings",
    readTime: "4 min read",
    isNew: true,
  },
];

const videos = [
  {
    title: "Stock Market Basics for Beginners",
    duration: "15:32",
    category: "Stocks",
    views: "125K",
  },
  {
    title: "How to Read Financial Statements",
    duration: "22:15",
    category: "Analysis",
    views: "89K",
  },
  {
    title: "Understanding Inflation and Your Money",
    duration: "10:45",
    category: "Economics",
    views: "67K",
  },
  {
    title: "Credit Score Explained: How to Improve Yours",
    duration: "12:20",
    category: "Credit",
    views: "156K",
  },
];

const categories = ["All", "Investing", "Budgeting", "Tax", "Savings", "Stocks"];

const learnQuickPrompts = [
  "What is SIP?",
  "Explain compound interest",
  "Tax saving options",
  "How to start investing?",
];

export default function Learn() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold font-display">Learn</h1>
        <p className="text-muted-foreground">Financial education to help you make smarter decisions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles, videos, topics..." className="pl-9" />
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
              <TabsTrigger value="articles" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="gap-2">
                <Brain className="h-4 w-4" />
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="tips" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Quick Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              <FinanceArticles />
            </TabsContent>

            <TabsContent value="videos">
              <YouTubeVideos />
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
              title="Financial Tutor AI"
              placeholder="Ask any finance question..."
              quickPrompts={learnQuickPrompts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
