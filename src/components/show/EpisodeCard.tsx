
import React from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { formatViewCount } from "@/lib/format";

type EpisodeVideo = {
  id: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

type EpisodeCardProps = {
  title: string;
  episodeNumber: number;
  video: EpisodeVideo | null;
};

export function EpisodeCard({ title, episodeNumber, video }: EpisodeCardProps) {
  return (
    <Card className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer">
      {video ? (
        <>
          <div className="aspect-video bg-muted">
            <img
              src={video.thumbnail_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium line-clamp-2">
              {episodeNumber}. {title}
            </h3>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                {formatViewCount(video.views_count)} views • {
                  format(new Date(video.created_at), 'MMM d, yyyy')
                }
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4">
          <h3 className="font-medium">
            {episodeNumber}. {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">No video available</p>
        </div>
      )}
    </Card>
  );
}
