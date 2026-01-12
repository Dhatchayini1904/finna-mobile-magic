import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ChevronRight, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Curated real finance articles
const articles = [
  {
    title: "The Complete Guide to Mutual Funds in India",
    description: "Everything you need to know about investing in mutual funds, including types, SIP benefits, and how to choose the right fund.",
    category: "Investing",
    readTime: "12 min read",
    source: "Investopedia",
    url: "https://www.investopedia.com/terms/m/mutualfund.asp",
    isNew: true,
  },
  {
    title: "How to Build an Emergency Fund",
    description: "A step-by-step guide to creating a financial safety net that can cover 3-6 months of expenses.",
    category: "Savings",
    readTime: "8 min read",
    source: "NerdWallet",
    url: "https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters",
    isNew: true,
  },
  {
    title: "Understanding P/E Ratio and Stock Valuation",
    description: "Learn how to use price-to-earnings ratio to evaluate whether a stock is overvalued or undervalued.",
    category: "Stocks",
    readTime: "10 min read",
    source: "The Motley Fool",
    url: "https://www.fool.com/investing/how-to-invest/stocks/price-to-earnings-ratio/",
  },
  {
    title: "Tax Saving Options Under Section 80C",
    description: "Maximize your tax savings with investments in PPF, ELSS, NPS, and other instruments under Section 80C.",
    category: "Tax",
    readTime: "15 min read",
    source: "ClearTax",
    url: "https://cleartax.in/s/80c-80-deductions",
  },
  {
    title: "The 50/30/20 Budgeting Rule Explained",
    description: "A simple framework for allocating your income: 50% needs, 30% wants, and 20% savings.",
    category: "Budgeting",
    readTime: "6 min read",
    source: "Forbes",
    url: "https://www.forbes.com/advisor/banking/what-is-the-50-30-20-budget-rule/",
  },
  {
    title: "Introduction to Index Funds",
    description: "Why index funds are recommended for most investors and how they compare to actively managed funds.",
    category: "Investing",
    readTime: "9 min read",
    source: "Vanguard",
    url: "https://investor.vanguard.com/investor-resources-education/understanding-investment-types/what-is-an-index-fund",
  },
  {
    title: "Credit Score: What It Is and How to Improve It",
    description: "Understanding CIBIL score in India and actionable steps to improve your creditworthiness.",
    category: "Credit",
    readTime: "7 min read",
    source: "CIBIL",
    url: "https://www.cibil.com/resources/documents/how-to-improve-cibil-score.pdf",
  },
  {
    title: "Gold Investment Options: Physical vs Digital",
    description: "Compare physical gold, gold ETFs, sovereign gold bonds, and digital gold for your portfolio.",
    category: "Gold",
    readTime: "11 min read",
    source: "ET Money",
    url: "https://www.etmoney.com/blog/gold-investment-options-in-india/",
  },
];

export interface ArticleType {
  title: string;
  description: string;
  category: string;
  readTime: string;
  source: string;
  url: string;
  isNew?: boolean;
}

interface FinanceArticlesProps {
  onSelectArticle?: (article: ArticleType | null) => void;
  selectedArticle?: ArticleType | null;
}

export function FinanceArticles({ onSelectArticle, selectedArticle }: FinanceArticlesProps) {
  // If an article is selected, show the embedded view
  if (selectedArticle) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => onSelectArticle?.(null as any)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Button>
        
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="secondary">{selectedArticle.category}</Badge>
                {selectedArticle.isNew && <Badge className="bg-primary/20 text-primary">New</Badge>}
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedArticle.readTime}
                </Badge>
              </div>
              <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selectedArticle.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">Source: {selectedArticle.source}</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open original
                  </a>
                </Button>
              </div>
            </div>
            <div className="h-[500px]">
              <iframe
                src={selectedArticle.url}
                className="w-full h-full"
                title={selectedArticle.title}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <Card 
          key={index}
          className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
          onClick={() => onSelectArticle?.(article)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                  {article.isNew && (
                    <Badge className="bg-primary/20 text-primary text-xs">New</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {article.source}
                  </Badge>
                </div>
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
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
      ))}
    </div>
  );
}
