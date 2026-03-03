import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldX, Info, AlertTriangle, CheckCircle2, History } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useFraudAnalysis, FlaggedTransaction } from "@/hooks/useFraudAnalysis";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

export function FraudAnalysisView() {
    const { transactions, loading } = useTransactions();
    const { flaggedTransactions } = useFraudAnalysis(transactions);
    const { language } = useLanguage();

    const getRiskIcon = (score: string) => {
        switch (score) {
            case 'critical': return <ShieldX className="h-5 w-5 text-red-500" />;
            case 'warning': return <ShieldAlert className="h-5 w-5 text-amber-500" />;
            default: return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
        }
    };

    const getRiskBadge = (score: string) => {
        switch (score) {
            case 'critical': return (
                <Badge variant="destructive" className="uppercase text-[10px] font-black tracking-widest px-2">
                    Critical Risk
                </Badge>
            );
            case 'warning': return (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 uppercase text-[10px] font-black tracking-widest px-2">
                    Warning
                </Badge>
            );
            default: return (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[10px] font-black tracking-widest px-2">
                    Secure
                </Badge>
            );
        }
    };

    if (loading) return <div>Analyzing security layers...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck className="h-20 w-20" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Security Score</CardTitle>
                        <div className="text-3xl font-black">{flaggedTransactions.length === 0 ? '98' : '82'}/100</div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500 font-medium">Based on recent transaction behavior and merchant patterns.</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Flagged Items</CardTitle>
                        <div className="text-3xl font-black text-red-500">{flaggedTransactions.length}</div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground font-medium">Potential anomalies detected in the last 30 days.</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Monitoring Status</CardTitle>
                        <div className="text-3xl font-black text-emerald-500 flex items-center gap-2">
                            <CheckCircle2 className="h-8 w-8" />
                            Active
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground font-medium">AI velocity and pattern scanners are running in real-time.</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 bg-card/30">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-6">
                    <div>
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            Suspected Anomalies
                        </CardTitle>
                        <CardDescription className="text-xs font-medium uppercase tracking-widest mt-1">
                            AI-driven pattern analysis results
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="rounded-lg px-3 py-1 bg-secondary/30">
                        {new Date().toLocaleDateString()}
                    </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                    {flaggedTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <ShieldCheck className="h-8 w-8 text-emerald-500" />
                            </div>
                            <div>
                                <h4 className="font-bold">System Secure</h4>
                                <p className="text-sm text-muted-foreground">No suspicious activity found in your recent transactions.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {flaggedTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/20 border border-border/40 hover:bg-secondary/30 transition-all group"
                                >
                                    <div className="p-3 rounded-xl bg-background shadow-sm">
                                        {getRiskIcon(transaction.riskScore)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold flex items-center gap-2">
                                                {transaction.description}
                                                {getRiskBadge(transaction.riskScore)}
                                            </h4>
                                            <span className="font-black text-red-500">
                                                ₹{transaction.amount.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {language === 'ta' ? transaction.reason_ta : transaction.reason}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <span className="flex items-center gap-1">
                                                <History className="h-3 w-3" />
                                                {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                            </span>
                                            <span>•</span>
                                            <span>{transaction.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="p-6 rounded-[2.5rem] bg-indigo-950 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <Badge className="bg-primary/20 border-primary/30 text-primary font-black uppercase text-[10px] tracking-widest px-3">Enhanced AI Security</Badge>
                        <h4 className="text-2xl font-black tracking-tight leading-none">Smart Merchant Verification</h4>
                        <p className="text-sm text-indigo-200/60 font-medium max-w-lg">
                            Our AI model cross-references your monthly spending velocity with localized merchant reliability scores to prevent unauthorized digital sweeps.
                        </p>
                    </div>
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-950 bg-indigo-900 flex items-center justify-center overflow-hidden">
                                <div className="w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-indigo-950 bg-primary flex items-center justify-center text-[10px] font-black">
                            +12
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
