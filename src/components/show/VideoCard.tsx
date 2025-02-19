
import React from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { formatViewCount } from "@/lib/format";

type VideoCardProps = {
  title: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

export function VideoCard({ title, thumbnail_url, views_count, created_at }: VideoCardProps) {
  return (
    <Card className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="aspect-video bg-muted">
        <img
          src={thumbnail_url}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-2">{title}</h3>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>
            {formatViewCount(views_count)} views • {
              format(new Date(created_at), 'MMM d, yyyy')
            }
          </p>
        </div>
      </div>
    </Card>
  );
}
