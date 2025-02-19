
import React from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { formatViewCount } from "@/lib/format";
import { useNavigate } from "react-router-dom";

type VideoCardProps = {
  id: string;
  title: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

export function VideoCard({ id, title, thumbnail_url, views_count, created_at }: VideoCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/video/${id}`)}
    >
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
