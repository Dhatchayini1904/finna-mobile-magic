import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronRight, X, BookOpen, Clock, ListChecks, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Chapter {
    id: string;
    title: string;
    content: string;
}

interface FinancialBook {
    id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    chapters: Chapter[];
    coverColor: string;
}

const books: FinancialBook[] = [
    {
        id: "1",
        title: "The Intelligent Investor",
        author: "Benjamin Graham",
        category: "Value Investing",
        description: "The definitive book on value investing. Teaches the concept of 'Margin of Safety'.",
        coverColor: "bg-blue-900",
        chapters: [
            {
                id: "1-1",
                title: "Investment vs. Speculation",
                content: `
                    <h3>What is an Investment?</h3>
                    <p>Graham starts by defining an investment operation: "An investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return. Operations not meeting these requirements are speculative."</p>
                    <p>The core of this lesson is <strong>Analysis</strong>. Without looking at the underlying business and its value, you are merely betting on price movements, which is speculation.</p>
                `
            },
            {
                id: "1-2",
                title: "The Investor and Inflation",
                content: `
                    <h3>Inflation's Impact</h3>
                    <p>Inflation erodes the purchasing power of your money. Graham suggests that even conservative investors must hold some equities because stocks have historically provided a hedge against inflation that bonds cannot match.</p>
                    <p>However, he warns against buying overvalued stocks just to escape inflation. The price you pay always matters.</p>
                `
            },
            {
                id: "1-3",
                title: "Mr. Market & Market Fluctuations",
                content: `
                    <h3>The Allegory of Mr. Market</h3>
                    <p>Imagine you own a share in a business and your partner, Mr. Market, tells you every day what he thinks your share is worth. Some days he's incredibly optimistic (charging a high price), and other days he's very pessimistic (offering a low price).</p>
                    <p><strong>The Takeaway:</strong> You are free to ignore him. You should only buy from him when his price is low and sell to him when his price is high. Don't let his shifting moods dictate your financial reality.</p>
                `
            },
            {
                id: "1-4",
                title: "The Margin of Safety",
                content: `
                    <h3>The Central Concept</h3>
                    <p>Margin of Safety is the secret to successful investing. It means buying an asset at a price significantly lower than its intrinsic value.</p>
                    <p>This gap acts as a cushion. If you're wrong about the company's growth, or the market crashes, the low entry price protects you from significant losses.</p>
                `
            }
        ]
    },
    {
        id: "2",
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Financial Mindset",
        description: "What the rich teach their kids about money that the poor and middle class do not!",
        coverColor: "bg-orange-800",
        chapters: [
            {
                id: "2-1",
                title: "The Rich Don't Work for Money",
                content: `
                    <h3>Emotions and Money</h3>
                    <p>Most people work for money because of two emotions: fear and greed. Fear of being without money and greed for the things money can buy.</p>
                    <p>Rich people, instead, learn to use their emotions to think, rather than thinking with their emotions. They create systems and businesses where money works for them.</p>
                `
            },
            {
                id: "2-2",
                title: "Assets vs. Liabilities",
                content: `
                    <h3>The Golden Rule</h3>
                    <p>You must know the difference between an asset and a liability, and buy assets. Rich people acquire assets. The poor and middle class acquire liabilities that they think are assets.</p>
                    <ul>
                        <li><strong>Asset:</strong> Puts money in your pocket (Rent, Dividends, Interest).</li>
                        <li><strong>Liability:</strong> Takes money out of your pocket (Mortgage, Car loan, Credit cards).</li>
                    </ul>
                `
            },
            {
                id: "2-3",
                title: "Mind Your Own Business",
                content: `
                    <h3>The Profession vs. The Business</h3>
                    <p>Your profession is what you do to pay the bills. Your business is what you do to build your asset column. Kiyosaki urges readers to keep their day jobs but start buying real assets, not just "doodads" (consumer goods).</p>
                `
            }
        ]
    },
    {
        id: "3",
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Behavioral Finance",
        description: "Timeless lessons on wealth, greed, and happiness through the lens of psychology.",
        coverColor: "bg-zinc-800",
        chapters: [
            {
                id: "3-1",
                title: "No One's Crazy",
                content: `
                    <h3>Personal Experience Over Logic</h3>
                    <p>Your personal experiences with money make up maybe 0.00000001% of what’s happened in the world, but 80% of how you think the world works.</p>
                    <p>People from different generations and backgrounds make financial decisions that seem crazy to others but make perfect sense to them based on the world they grew up in.</p>
                `
            },
            {
                id: "3-2",
                title: "Luck & Risk",
                content: `
                    <h3>The Invisible Hands</h3>
                    <p>Luck and risk are siblings. They are both the reality that every outcome in life is guided by forces other than individual effort.</p>
                    <p>Nothing is as good or as bad as it seems. Be careful who you praise and admire, and be careful who you look down upon for their failures.</p>
                }
            `
            },
            {
                id: "3-3",
                title: "Getting Rich vs. Staying Rich",
                content: `
                    <h3>The Survival Mindset</h3>
                    <p>Getting rich requires taking risks, being optimistic, and putting yourself out there. But staying rich requires the opposite of taking risks. It requires humility, and fear that what you’ve made can be taken away from you just as fast.</p>
                `
            }
        ]
    }
];

export function BooksSection() {
    const [selectedBook, setSelectedBook] = useState<FinancialBook | null>(null);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [readProgress, setReadProgress] = useState<Record<string, number>>({});

    useEffect(() => {
        const savedProgress = localStorage.getItem('books_progress');
        if (savedProgress) {
            setReadProgress(JSON.parse(savedProgress));
        }
    }, []);

    const handleBookClick = (book: FinancialBook) => {
        setSelectedBook(book);
        setCurrentChapterIndex(0);
    };

    const nextChapter = () => {
        if (selectedBook && currentChapterIndex < selectedBook.chapters.length - 1) {
            setCurrentChapterIndex(prev => prev + 1);
        } else {
            handleMarkAsRead();
        }
    };

    const prevChapter = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
        }
    };

    const handleMarkAsRead = () => {
        if (!selectedBook) return;

        const newProgress = { ...readProgress, [selectedBook.id]: 100 };
        setReadProgress(newProgress);
        localStorage.setItem('books_progress', JSON.stringify(newProgress));
        toast.success(`Completed ${selectedBook.title}!`);
        setSelectedBook(null);
    };

    const calculateOverallProgress = (book: FinancialBook) => {
        return readProgress[book.id] || 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Interactive Financial Library
                </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {books.map((book) => (
                    <Card
                        key={book.id}
                        className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-md hover:border-primary/30 transition-all cursor-pointer relative"
                        onClick={() => handleBookClick(book)}
                    >
                        <div className="flex h-full">
                            <div className={`${book.coverColor} w-24 flex-shrink-0 flex items-center justify-center p-4 relative`}>
                                <Book className="h-10 w-10 text-white/40 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                            </div>
                            <CardContent className="p-4 flex flex-col justify-between flex-1">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{book.category}</Badge>
                                        {readProgress[book.id] === 100 && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                    </div>
                                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">{book.title}</h4>
                                    <p className="text-[10px] text-muted-foreground font-medium">{book.author}</p>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                                        <span>Progress</span>
                                        <span>{calculateOverallProgress(book)}%</span>
                                    </div>
                                    <Progress value={calculateOverallProgress(book)} className="h-1" />
                                </div>

                                <div className="mt-3 flex items-center justify-end">
                                    <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Start Reading <ChevronRight className="h-3 w-3" />
                                    </span>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>

            <Sheet open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
                <SheetContent side="right" className="sm:max-w-2xl w-full p-0 flex flex-col bg-background border-l border-border/50 shadow-2xl">
                    {selectedBook && (
                        <>
                            <div className="p-6 border-b border-border/50 bg-card flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-card/80">
                                <div className="flex items-center gap-4">
                                    <div className={`${selectedBook.coverColor} w-10 h-14 rounded shadow-lg flex items-center justify-center`}>
                                        <Book className="h-5 w-5 text-white/50" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase text-primary border-primary/20">
                                                Chapter {currentChapterIndex + 1} of {selectedBook.chapters.length}
                                            </Badge>
                                        </div>
                                        <SheetTitle className="text-lg font-black line-clamp-1 mt-1">{selectedBook.title}</SheetTitle>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedBook(null)} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="px-6 py-2 bg-secondary/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
                                {selectedBook.chapters.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentChapterIndex(idx)}
                                        className={`flex-shrink-0 h-1.5 w-12 rounded-full transition-all ${idx === currentChapterIndex ? 'bg-primary scale-110' : 'bg-muted-foreground/20'}`}
                                    />
                                ))}
                            </div>

                            <ScrollArea className="flex-1 p-6 md:p-10">
                                <div className="max-w-prose mx-auto">
                                    <h2 className="text-3xl font-black font-display mb-8 tracking-tighter text-foreground leading-none">
                                        {selectedBook.chapters[currentChapterIndex].title}
                                    </h2>
                                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none 
                                        prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight 
                                        prose-p:text-secondary-foreground prose-p:leading-relaxed prose-p:text-lg
                                        prose-strong:text-primary prose-strong:font-black">
                                        <div dangerouslySetInnerHTML={{ __html: selectedBook.chapters[currentChapterIndex].content }} />
                                    </div>

                                    <div className="mt-16 pt-8 border-t border-border/50 flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            disabled={currentChapterIndex === 0}
                                            onClick={prevChapter}
                                            className="gap-2 font-bold uppercase text-xs"
                                        >
                                            <ArrowLeft className="h-4 w-4" /> Previous
                                        </Button>

                                        <Button
                                            onClick={nextChapter}
                                            className="gap-2 font-black uppercase text-xs px-6 shadow-lg shadow-primary/20"
                                        >
                                            {currentChapterIndex === selectedBook.chapters.length - 1 ? 'Finish & Mark Read' : 'Next Chapter'}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
