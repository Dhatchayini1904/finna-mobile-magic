import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Eye } from "lucide-react";

interface Video {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  category: string;
  thumbnail: string;
}

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  return (
    <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{video.category}</Badge>
            <Badge variant="outline">{video.duration}</Badge>
          </div>
          <CardTitle className="text-xl">{video.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{video.channel}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {video.views} views
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-xl overflow-hidden mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            className="w-full h-full"
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-end">
          <Button variant="outline" size="sm" asChild>
            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open on YouTube
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
