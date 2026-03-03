import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart, Zap, ShieldCheck, ArrowUpRight, Info, ExternalLink, RefreshCw, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FundOffer {
    id: string;
    fundName: string;
    category: string;
    return3Y: number;
    return5Y: number;
    nav: number;
    risk: 'Low' | 'Moderate' | 'High' | 'Very High';
    featured?: boolean;
    nfo?: boolean;
    minSip: number;
    tags: string[];
}

export function FundOffers() {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState<FundOffer[]>([]);

    useEffect(() => {
        const fetchFunds = () => {
            setLoading(true);
            // Simulating a fetch of top-performing funds and NFOs
            const fundData: FundOffer[] = [
                {
                    id: "nifty-index-1",
                    fundName: "UTI Nifty 50 Index Fund",
                    category: "Index Fund",
                    return3Y: 14.2,
                    return5Y: 15.8,
                    nav: 142.50,
                    risk: 'Moderate',
                    featured: true,
                    minSip: 500,
                    tags: ["Low Tracking Error", "Passive"]
                },
                {
                    id: "elss-tax-1",
                    fundName: "Mirae Asset Tax Saver",
                    category: "ELSS",
                    return3Y: 16.5,
                    return5Y: 18.2,
                    nav: 45.32,
                    risk: 'Very High',
                    minSip: 500,
                    tags: ["80C Tax Benefit", "3Y Lock-in"]
                },
                {
                    id: "small-cap-1",
                    fundName: "Quant Small Cap Fund",
                    category: "Small Cap",
                    return3Y: 32.4,
                    return5Y: 28.1,
                    nav: 210.15,
                    risk: 'Very High',
                    featured: true,
                    minSip: 1000,
                    tags: ["High Growth", "Alpha Focused"]
                },
                {
                    id: "nfo-new-1",
                    fundName: "ICICI Pru Innovation Fund",
                    category: "Thematic",
                    return3Y: 0,
                    return5Y: 0,
                    nav: 10.00,
                    risk: 'High',
                    nfo: true,
                    minSip: 5000,
                    tags: ["NFO", "New Economy"]
                },
                {
                    id: "liquid-safe-1",
                    fundName: "HDFC Liquid Fund",
                    category: "Debt / Liquid",
                    return3Y: 6.2,
                    return5Y: 5.8,
                    nav: 4500.12,
                    risk: 'Low',
                    minSip: 500,
                    tags: ["Instant Redemption", "Safe"]
                }
            ];
            setOffers(fundData);
            setLoading(false);
        };

        fetchFunds();
    }, []);

    const getRiskBadge = (risk: string) => {
        switch (risk) {
            case 'Low': return <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5">Low Risk</Badge>;
            case 'Moderate': return <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5">Moderate</Badge>;
            default: return <Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/5">{risk} Risk</Badge>;
        }
    };

    return (
        <Card className="bg-card/30 backdrop-blur-md border-border/50 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-6">
                <div>
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Live Fund Marketplace
                    </CardTitle>
                    <CardDescription className="text-xs font-medium uppercase tracking-widest mt-1">
                        Curated Top Picks & New Fund Offers
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="hidden sm:flex items-center gap-1 bg-primary/10 text-primary border-none">
                        <Zap className="h-3 w-3 fill-primary" />
                        AI Verified
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {offers.map((fund) => (
                        <div
                            key={fund.id}
                            className={`group relative flex flex-col p-5 rounded-3xl bg-secondary/20 border transition-all hover:scale-[1.02] hover:bg-secondary/30 ${fund.featured ? 'border-primary/40 shadow-xl shadow-primary/5' : 'border-border/40'
                                }`}
                        >
                            {fund.nfo && (
                                <Badge className="absolute -top-3 left-4 bg-orange-600 text-white font-black animate-pulse">
                                    NFO ACTIVE
                                </Badge>
                            )}
                            {fund.featured && !fund.nfo && (
                                <Badge className="absolute -top-3 left-4 bg-primary text-white font-black">
                                    TOP PICK
                                </Badge>
                            )}

                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                                            {fund.fundName}
                                        </h4>
                                        <p className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-tighter">
                                            {fund.category}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">NAV</p>
                                        <p className="font-black text-sm">₹{fund.nav.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {fund.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-background/50 border border-border/40 font-bold uppercase tracking-tighter">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/20">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">3Y Returns</p>
                                        <p className={`font-black text-lg flex items-center gap-1 ${fund.return3Y > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            {fund.return3Y > 0 ? `${fund.return3Y}%` : 'N/A'}
                                            {fund.return3Y > 0 && <ArrowUpRight className="h-3 w-3" />}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Risk Profile</p>
                                        <div className="mt-1">{getRiskBadge(fund.risk)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Min SIP: ₹{fund.minSip}</span>
                                    </div>
                                    <div className="flex items-center -space-x-1.5">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-5 h-5 rounded-full border border-background bg-secondary flex items-center justify-center">
                                                <Star className="h-2 w-2 text-amber-500 fill-amber-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-11 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all border border-primary/20"
                                    variant={fund.featured ? "default" : "secondary"}
                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(fund.fundName + ' direct growth returns')}`, '_blank')}
                                >
                                    Invest Now <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 rounded-[2.5rem] bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="p-4 rounded-3xl bg-primary/20 border border-primary/30">
                            <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-black tracking-tight">AI Portfolio Builder</h4>
                            <p className="text-sm text-slate-400 font-medium max-w-xl mt-1">
                                Our investment engine suggests allocating <span className="text-primary font-bold">40% to Index Funds</span> and <span className="text-emerald-400 font-bold">20% to ELSS</span> based on current market volatility and tax season requirements.
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-2xl h-12 px-6 border-slate-800 hover:bg-slate-900 font-black uppercase text-[10px] tracking-widest shrink-0">
                            Personalize Plan
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
