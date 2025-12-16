import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

interface VideoCardProps {
  title: string;
  thumbnail?: string;
  duration: string;
  category: string;
  views: string;
}

export function VideoCard({ title, duration, category, views }: VideoCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer group">
      <div className="relative aspect-video bg-secondary flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="h-6 w-6 text-primary-foreground ml-1" />
        </div>
        <Badge className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs">
          {duration}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-2">
        <Badge variant="secondary" className="text-xs">{category}</Badge>
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{views} views</span>
        </div>
      </CardContent>
    </Card>
  );
}
