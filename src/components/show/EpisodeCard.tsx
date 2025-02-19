
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

type EpisodeCardProps = {
  id: string;
  title: string;
  episodeNumber: number;
  reactionCount: number;
};

export function EpisodeCard({ id, title, episodeNumber, reactionCount }: EpisodeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/episode/${id}`);
  };

  return (
    <Card 
      className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer p-4"
      onClick={handleClick}
    >
      <h3 className="font-medium">
        {episodeNumber}. {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        {reactionCount} {reactionCount === 1 ? 'reaction' : 'reactions'}
      </p>
    </Card>
  );
}
