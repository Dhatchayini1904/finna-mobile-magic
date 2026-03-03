import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ChevronRight, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "The Complete Guide to Mutual Funds in India",
    description: "Everything you need to know about investing in mutual funds, including types, SIP benefits, and how to choose the right fund.",
    category: "Investing",
    readTime: "12 min read",
    source: "Investopedia",
    url: "https://www.investopedia.com/terms/m/mutualfund.asp",
    isNew: true,
    content: `Mutual funds pool money from multiple investors to invest in stocks, bonds, or other assets. In India, popular types include:\n\n• **Equity Funds**: Invest in stocks for long-term growth\n• **Debt Funds**: Invest in bonds for stable returns\n• **Hybrid Funds**: Mix of equity and debt\n• **ELSS (Tax Saving)**: Lock-in of 3 years, tax benefits under 80C\n• **Index Funds**: Track market indices like Nifty 50\n\n**SIP (Systematic Investment Plan)**: Invest a fixed amount monthly. Benefits include rupee cost averaging and the power of compounding.\n\n**How to Choose**: Consider your risk profile, investment horizon, expense ratio, and fund manager's track record.`,
  },
  {
    title: "How to Build an Emergency Fund",
    description: "A step-by-step guide to creating a financial safety net that can cover 3-6 months of expenses.",
    category: "Savings",
    readTime: "8 min read",
    source: "NerdWallet",
    url: "https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters",
    isNew: true,
    content: `An emergency fund is your financial safety net for unexpected expenses like medical emergencies, job loss, or urgent repairs.\n\n**Step 1**: Calculate monthly expenses (rent, food, bills, EMIs)\n**Step 2**: Set a target of 3-6 months of expenses\n**Step 3**: Start small — even ₹1,000/month matters\n**Step 4**: Keep it in a high-yield savings account or liquid fund\n**Step 5**: Automate transfers on salary day\n\n**Where to Park It**:\n• High-interest savings accounts (5-7% p.a.)\n• Liquid mutual funds (6-7% p.a.)\n• Fixed deposits with premature withdrawal facility\n\n**Rule**: Don't invest your emergency fund in stocks or long-term instruments.`,
  },
  {
    title: "Understanding P/E Ratio and Stock Valuation",
    description: "Learn how to use price-to-earnings ratio to evaluate whether a stock is overvalued or undervalued.",
    category: "Stocks",
    readTime: "10 min read",
    source: "The Motley Fool",
    url: "https://www.fool.com/investing/how-to-invest/stocks/price-to-earnings-ratio/",
    content: `The Price-to-Earnings (P/E) ratio is one of the most widely used metrics to value stocks.\n\n**Formula**: P/E = Share Price ÷ Earnings Per Share (EPS)\n\n**Interpretation**:\n• **Low P/E (< 15)**: Stock may be undervalued or company faces challenges\n• **Moderate P/E (15-25)**: Generally fairly valued\n• **High P/E (> 25)**: Stock may be overvalued or market expects high growth\n\n**Types**:\n• **Trailing P/E**: Based on past 12 months earnings\n• **Forward P/E**: Based on projected future earnings\n\n**Indian Context**: Nifty 50 average P/E is around 20-22. Compare stocks within the same sector for meaningful analysis.\n\n**Caution**: P/E alone isn't sufficient. Consider PEG ratio, debt levels, and industry trends too.`,
  },
  {
    title: "Tax Saving Options Under Section 80C",
    description: "Maximize your tax savings with investments in PPF, ELSS, NPS, and other instruments under Section 80C.",
    category: "Tax",
    readTime: "15 min read",
    source: "ClearTax",
    url: "https://cleartax.in/s/80c-80-deductions",
    content: `Section 80C allows deductions up to ₹1,50,000 per year. Key instruments:\n\n**Best Options**:\n• **ELSS Mutual Funds**: 3-year lock-in, potential 12-15% returns\n• **PPF**: 15-year lock-in, 7.1% tax-free returns, EEE status\n• **NPS**: Additional ₹50,000 under 80CCD(1B)\n• **EPF**: Employee contribution qualifies\n\n**Other Options**:\n• Life insurance premiums\n• Children's tuition fees\n• Home loan principal repayment\n• 5-year fixed deposits\n• Sukanya Samriddhi Yojana\n\n**Strategy**: Start with ELSS for highest returns, then PPF for safety, and NPS for additional tax benefit.`,
  },
  {
    title: "The 50/30/20 Budgeting Rule Explained",
    description: "A simple framework for allocating your income: 50% needs, 30% wants, and 20% savings.",
    category: "Budgeting",
    readTime: "6 min read",
    source: "Forbes",
    url: "https://www.forbes.com/advisor/banking/what-is-the-50-30-20-budget-rule/",
    content: `The 50/30/20 rule is a simple budgeting framework:\n\n**50% — Needs** (Essential expenses)\n• Rent/EMI, groceries, utilities, insurance, minimum debt payments\n\n**30% — Wants** (Lifestyle expenses)\n• Dining out, entertainment, shopping, hobbies, vacations\n\n**20% — Savings & Investments**\n• Emergency fund, SIPs, PPF, stocks, retirement planning\n\n**Indian Example** (₹50,000 salary):\n• Needs: ₹25,000 (rent, groceries, bills)\n• Wants: ₹15,000 (dining, shopping, entertainment)\n• Savings: ₹10,000 (SIP, PPF, emergency fund)\n\n**Pro Tips**:\n• Track expenses for a month first\n• Automate savings on salary day\n• Adjust ratios based on your city and lifestyle`,
  },
  {
    title: "Introduction to Index Funds",
    description: "Why index funds are recommended for most investors and how they compare to actively managed funds.",
    category: "Investing",
    readTime: "9 min read",
    source: "Vanguard",
    url: "https://investor.vanguard.com/investor-resources-education/understanding-investment-types/what-is-an-index-fund",
    content: `Index funds passively track a market index like Nifty 50 or Sensex.\n\n**Advantages**:\n• **Low Cost**: Expense ratio 0.1-0.5% vs 1-2.5% for active funds\n• **Diversification**: Own all stocks in the index\n• **Consistent Returns**: Match market performance\n• **No Fund Manager Risk**: Rules-based investing\n\n**Popular Indian Index Funds**:\n• Nifty 50 Index Funds\n• Sensex Index Funds\n• Nifty Next 50\n• Nifty Midcap 150\n\n**How to Invest**: Start a SIP of ₹500+ in a Nifty 50 index fund. Over 10+ years, index funds beat 70-80% of actively managed funds.\n\n**Best For**: Beginners, long-term investors, and those who prefer passive investing.`,
  },
  {
    title: "Credit Score: What It Is and How to Improve It",
    description: "Understanding CIBIL score in India and actionable steps to improve your creditworthiness.",
    category: "Credit",
    readTime: "7 min read",
    source: "CIBIL",
    url: "https://www.cibil.com/",
    content: `Your CIBIL score (300-900) determines loan eligibility and interest rates.\n\n**Score Ranges**:\n• **750+**: Excellent — best rates, instant approvals\n• **700-749**: Good — most loans approved\n• **650-699**: Fair — higher interest rates\n• **Below 650**: Poor — difficult to get loans\n\n**How to Improve**:\n1. Pay credit card bills in full, on time\n2. Keep credit utilization below 30%\n3. Don't apply for multiple loans simultaneously\n4. Maintain a healthy mix of secured & unsecured credit\n5. Check your CIBIL report annually for errors\n\n**Common Mistakes**:\n• Paying only minimum due on credit cards\n• Closing old credit cards\n• Being a loan guarantor without understanding risks`,
  },
  {
    title: "Gold Investment Options: Physical vs Digital",
    description: "Compare physical gold, gold ETFs, sovereign gold bonds, and digital gold for your portfolio.",
    category: "Gold",
    readTime: "11 min read",
    source: "ET Money",
    url: "https://www.etmoney.com/blog/gold-investment-options-in-india/",
    content: `Gold is a traditional safe-haven investment in India. Here are your options:\n\n**Physical Gold**: Jewelry, coins, bars\n• Pros: Tangible, cultural value\n• Cons: Making charges, storage risk, impurity concerns\n\n**Gold ETFs**: Trade on stock exchange\n• Pros: Pure gold, easy to buy/sell, no storage hassle\n• Cons: Need demat account, expense ratio\n\n**Sovereign Gold Bonds (SGB)**: Government-issued\n• Pros: 2.5% annual interest + gold price appreciation, tax-free on maturity\n• Cons: 8-year lock-in (exit after 5 years)\n\n**Digital Gold**: Buy via apps\n• Pros: Start from ₹1, 24K purity\n• Cons: Not regulated, storage fees\n\n**Recommendation**: Allocate 5-10% of portfolio. SGBs are the best option for long-term investors.`,
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
  content?: string;
}

interface FinanceArticlesProps {
  onSelectArticle?: (article: ArticleType | null) => void;
  selectedArticle?: ArticleType | null;
}

export function FinanceArticles({ onSelectArticle, selectedArticle }: FinanceArticlesProps) {
  if (selectedArticle) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => onSelectArticle?.(null)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Button>
        
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge variant="secondary">{selectedArticle.category}</Badge>
              {selectedArticle.isNew && <Badge className="bg-primary/20 text-primary">New</Badge>}
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {selectedArticle.readTime}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
            <p className="text-muted-foreground mb-6">{selectedArticle.description}</p>
            
            {/* Article content rendered inline */}
            <div className="prose prose-invert max-w-none space-y-4">
              {(selectedArticle.content || selectedArticle.description).split('\n').map((paragraph, idx) => {
                if (!paragraph.trim()) return null;
                // Bold headers
                if (paragraph.startsWith('**') && paragraph.endsWith('**:')) {
                  return <h3 key={idx} className="text-lg font-semibold text-foreground mt-6 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
                }
                // Bullet points
                if (paragraph.startsWith('•')) {
                  return (
                    <div key={idx} className="flex items-start gap-2 text-muted-foreground ml-4">
                      <span className="text-primary mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: paragraph.slice(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                    </div>
                  );
                }
                // Regular paragraphs with bold support
                return (
                  <p key={idx} className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Source: {selectedArticle.source}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read original
                </a>
              </Button>
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
