import { Newspaper, Rss, Video } from "lucide-react";
import { NewsPanel } from "@/components/investments/NewsPanel";
import { VideoNewsSection } from "@/components/news/VideoNewsSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function News() {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-10 pb-10 animate-fade-up">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black font-display tracking-tighter text-foreground flex items-center gap-3">
                        <Newspaper className="h-8 w-8 text-primary" />
                        {t('marketNews')}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 font-medium italic">
                        Real-time multimedia coverage of global financial ecosystems.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Scanning News Hubs</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="feed" className="space-y-8">
                <TabsList className="bg-secondary/30 p-1.5 rounded-2xl border border-border/50 h-auto flex-wrap sm:flex-nowrap gap-1">
                    <TabsTrigger value="feed" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest">
                        <Rss className="h-4 w-4" />
                        {language === 'ta' ? 'செய்தி ஓடை' : 'News Feed'}
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest">
                        <Video className="h-4 w-4" />
                        {language === 'ta' ? 'வீடியோக்கள்' : 'Video Insights'}
                        <Badge className="ml-1 h-4 px-1 bg-red-500 text-white border-none text-[8px] animate-pulse">LIVE</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <NewsPanel />
                </TabsContent>

                <TabsContent value="videos" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <VideoNewsSection />
                </TabsContent>
            </Tabs>
        </div>
    );
}
