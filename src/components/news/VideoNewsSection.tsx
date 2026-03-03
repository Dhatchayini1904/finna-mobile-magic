import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Youtube, Clock, X, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const videoNews = [
    {
        title: "Market Morning: Nifty & Bank Nifty Global Updates",
        source: "CNBC-TV18",
        youtubeId: "HIFFpsKEMCE",
        url: "https://www.youtube-nocookie.com/embed/HIFFpsKEMCE?autoplay=1&mute=1&rel=0",
        duration: "LIVE",
        category: "Markets",
    },
    {
        title: "Closing Bell: Stock Market Daily Analysis",
        source: "NDTV Profit",
        youtubeId: "EN-N1xhtBqU",
        url: "https://www.youtube-nocookie.com/embed/EN-N1xhtBqU?autoplay=1&mute=1&rel=0",
        duration: "LIVE",
        category: "Economy",
    },
    {
        title: "Investment Strategy: Best Mutual Funds 2024",
        source: "ET Now",
        youtubeId: "rO5q4KUSZP0",
        url: "https://www.youtube-nocookie.com/embed/rO5q4KUSZP0?autoplay=1&mute=1&rel=0",
        duration: "LIVE",
        category: "Investing",
    },
    {
        title: "Live: India Market Watch & Global Trends",
        source: "Moneycontrol",
        youtubeId: "Arc_xJNZAQU",
        url: "https://www.youtube-nocookie.com/embed/Arc_xJNZAQU?autoplay=1&mute=1&rel=0",
        duration: "LIVE",
        category: "Policy",
    }
];

export function VideoNewsSection() {
    const [selectedVideo, setSelectedVideo] = useState<typeof videoNews[0] | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-red-500/10 shadow-inner">
                        <Youtube className="h-5 w-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-black font-display tracking-tight text-foreground">
                        Market Highlights & Video Analysis
                    </h2>
                </div>
                <Badge variant="outline" className="animate-pulse bg-red-500/5 text-red-600 border-red-500/20 font-black text-[10px] uppercase tracking-widest">
                    Live Now
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoNews.map((video) => (
                    <Card key={video.title} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-md hover:border-red-500/30 transition-all duration-300">
                        <div className="relative aspect-video overflow-hidden">
                            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                />
                                <Youtube className="absolute m-auto h-12 w-12 text-white/20 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all duration-300" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">{video.category}</p>
                                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">{video.title}</h3>
                                </div>
                                <div className="bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {video.duration}
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 scale-110">
                                    <Play className="h-6 w-6 fill-current" />
                                </div>
                            </div>

                            <a
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 cursor-pointer z-10"
                            />
                        </div>
                        <CardContent className="p-4 flex items-center justify-between border-t border-border/30">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                <p className="text-xs font-bold text-muted-foreground uppercase">{video.source}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-[10px] font-black uppercase hover:text-red-600"
                                asChild
                            >
                                <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                                    Watch on YouTube <Youtube className="ml-1.5 h-3 w-3" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
                <DialogContent className="sm:max-w-4xl p-0 bg-black border-none overflow-hidden max-h-[90vh]">
                    <DialogHeader className="p-4 bg-zinc-900 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white fill-current" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-white line-clamp-1">{selectedVideo?.title}</DialogTitle>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{selectedVideo?.source}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10" onClick={() => setSelectedVideo(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </DialogHeader>
                    <div className="aspect-video w-full bg-black">
                        {selectedVideo && (
                            <iframe
                                src={selectedVideo.url}
                                className="w-full h-full"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
