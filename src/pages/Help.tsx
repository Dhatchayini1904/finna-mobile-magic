import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    HelpCircle,
    Search,
    Book,
    MessageCircle,
    Shield,
    Zap,
    ChevronRight,
    Mail,
    Globe,
    LifeBuoy,
    FileText,
    Play
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "How do I secure my financial data?",
        answer: "Finna Magic uses industry-standard encryption and Supabase's secure authentication. We never store your bank login details directly; we use secure API integrations to provide insights."
    },
    {
        question: "Can I use the app in multiple languages?",
        answer: "Yes! You can switch between Tamil and English instantly from the Dashboard or settings menu using our 'Language Toggle'."
    },
    {
        question: "How does the AI Stock Advisor work?",
        answer: "Our Market Agent analyzes real-time technical indicators, news sentiment, and volume spikes to give you a 'Confidence Score' for various stocks. It's meant for guidance, not direct financial advice."
    },
    {
        question: "What is the 'Margin of Safety' in the Learn section?",
        answer: "As taught in our 'The Intelligent Investor' book summary, Margin of Safety is buying assets significantly below their intrinsic value to protect yourself against market volatility."
    }
];

const categories = [
    { title: "Getting Started", icon: Zap, color: "text-amber-500 bg-amber-500/10" },
    { title: "Investment Tools", icon: Shield, color: "text-blue-500 bg-blue-500/10" },
    { title: "AI Features", icon: LifeBuoy, color: "text-purple-500 bg-purple-500/10" },
    { title: "Account & Billing", icon: FileText, color: "text-emerald-500 bg-emerald-500/10" }
];

export default function Help() {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-10 pb-20 animate-fade-up">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 text-center shadow-2xl">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80 py-1.5 px-4 rounded-full font-black uppercase text-[10px] tracking-widest">
                        Support Center
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter">
                        {language === 'ta' ? 'உங்களுக்கு எப்படி உதவலாம்?' : 'How can we help you today?'}
                    </h1>
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search help articles, guides, or features..."
                            className="pl-12 h-14 bg-white/10 border-white/10 text-white placeholder:text-slate-400 rounded-2xl backdrop-blur-md focus:ring-primary/50"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Categories */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat) => (
                    <Card key={cat.title} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className={`w-12 h-12 ${cat.color} rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <cat.icon className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-sm">{cat.title}</h4>
                            <Button variant="link" className="text-xs font-black uppercase tracking-wider h-auto p-0">
                                Explore <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-black font-display tracking-tight">Frequently Asked Questions</h3>
                    </div>

                    <Card className="bg-card/50 border-border/50 overflow-hidden rounded-2xl">
                        <CardContent className="p-2">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="border-b-0 px-4">
                                        <AccordionTrigger className="text-sm font-bold hover:no-underline hover:text-primary py-4">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-2">
                            <h4 className="text-xl font-black">Still have doubts?</h4>
                            <p className="text-sm text-muted-foreground font-medium">Join our global community of fin-tech enthusiasts and get real-time support from the community.</p>
                        </div>
                        <Button className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                            Join Community
                        </Button>
                    </div>
                </div>

                {/* Sidebar Support */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-black font-display tracking-tight">Contact Support</h3>
                    </div>

                    <Card className="bg-slate-900 border-white/10 text-white overflow-hidden rounded-2xl relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MessageCircle className="h-20 w-20" />
                        </div>
                        <CardContent className="p-6 space-y-6 relative z-10">
                            <div className="space-y-1">
                                <h4 className="font-bold">Live AI Support</h4>
                                <p className="text-xs text-slate-400 italic">24/7 assistance for all your queries</p>
                            </div>
                            <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-black uppercase tracking-widest text-[10px]">
                                Start Chatting
                            </Button>

                            <div className="h-px bg-white/10" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span className="text-slate-300 font-medium">support@finnamagic.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm overflow-hidden">
                                    <Globe className="h-4 w-4 text-primary" />
                                    <span className="text-slate-300 font-medium truncate">help.finnamagic.com/docs</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/50 rounded-2xl overflow-hidden group cursor-pointer">
                        <div className="relative h-40 bg-slate-800 flex items-center justify-center">
                            <Play className="h-10 w-10 text-white fill-white group-hover:scale-125 transition-transform" />
                        </div>
                        <CardContent className="p-4">
                            <h4 className="font-bold text-sm leading-tight">Video Tutorial: Master the AI Market Agent</h4>
                            <p className="text-[10px] text-muted-foreground mt-1">4 mins • Finna Academy</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
