import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Curated finance YouTube videos (real video IDs)
const youtubeVideos = [
  {
    id: "p7HKvqRI_Bo",
    title: "Stock Market for Beginners - Complete Guide",
    channel: "Ankur Warikoo",
    duration: "28:45",
    views: "2.1M",
    category: "Stocks",
    thumbnail: "https://img.youtube.com/vi/p7HKvqRI_Bo/mqdefault.jpg",
  },
  {
    id: "Xn7KWR9EOGQ",
    title: "Mutual Funds Explained - SIP vs Lump Sum",
    channel: "CA Rachana Ranade",
    duration: "18:32",
    views: "1.8M",
    category: "Mutual Funds",
    thumbnail: "https://img.youtube.com/vi/Xn7KWR9EOGQ/mqdefault.jpg",
  },
  {
    id: "PHe0bXAIuk0",
    title: "How to Save & Invest Your Money - The Complete Guide",
    channel: "Ali Abdaal",
    duration: "22:14",
    views: "3.5M",
    category: "Investing",
    thumbnail: "https://img.youtube.com/vi/PHe0bXAIuk0/mqdefault.jpg",
  },
  {
    id: "N8-a1pKEoOo",
    title: "How to Budget - Every Dollar Method",
    channel: "Graham Stephan",
    duration: "15:20",
    views: "1.2M",
    category: "Budgeting",
    thumbnail: "https://img.youtube.com/vi/N8-a1pKEoOo/mqdefault.jpg",
  },
  {
    id: "gOLfYYcyJNE",
    title: "Understanding Compound Interest",
    channel: "The Plain Bagel",
    duration: "12:45",
    views: "890K",
    category: "Basics",
    thumbnail: "https://img.youtube.com/vi/gOLfYYcyJNE/mqdefault.jpg",
  },
  {
    id: "WEDIj9JBTC8",
    title: "Tax Saving Tips for Salaried Employees",
    channel: "Labour Law Advisor",
    duration: "24:30",
    views: "1.5M",
    category: "Tax",
    thumbnail: "https://img.youtube.com/vi/WEDIj9JBTC8/mqdefault.jpg",
  },
];

interface YouTubeVideosProps {
  onSelectVideo?: (video: typeof youtubeVideos[0]) => void;
  selectedVideo?: typeof youtubeVideos[0] | null;
}

export function YouTubeVideos({ onSelectVideo, selectedVideo }: YouTubeVideosProps) {
  // If a video is selected, show the embedded player
  if (selectedVideo) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => onSelectVideo?.(null as any)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to videos
        </Button>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1`}
                className="w-full h-full"
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{selectedVideo.category}</Badge>
                <Badge variant="outline">{selectedVideo.duration}</Badge>
              </div>
              <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedVideo.channel}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {selectedVideo.views} views
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://www.youtube.com/watch?v=${selectedVideo.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open on YouTube
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Curated Finance Videos</h3>
        <a
          href="https://www.youtube.com/results?search_query=personal+finance+india"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Browse more <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {youtubeVideos.map((video) => (
          <Card
            key={video.id}
            className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
            onClick={() => onSelectVideo?.(video)}
          >
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary-foreground ml-1" />
                </div>
              </div>
              <Badge className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs">
                {video.duration}
              </Badge>
            </div>
            <CardContent className="p-4 space-y-2">
              <Badge variant="secondary" className="text-xs">{video.category}</Badge>
              <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{video.channel}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {video.views}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
