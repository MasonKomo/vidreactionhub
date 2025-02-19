
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "@/components/show/VideoCard";

type Episode = {
  id: string;
  title: string;
  episode_number: number;
  season: {
    show: {
      id: string;
      title: string;
    };
  };
};

type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

async function fetchEpisode(id: string): Promise<Episode> {
  const { data, error } = await supabase
    .from('episodes')
    .select(`
      id,
      title,
      episode_number,
      season:seasons (
        show:shows (
          id,
          title
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

async function fetchEpisodeVideos(episodeId: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, thumbnail_url, views_count, created_at')
    .eq('episode_id', episodeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export default function EpisodeDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: episode, isLoading: episodeLoading } = useQuery({
    queryKey: ['episode', id],
    queryFn: () => fetchEpisode(id!),
    enabled: !!id,
  });

  const { data: videos } = useQuery({
    queryKey: ['episodeVideos', id],
    queryFn: () => fetchEpisodeVideos(id!),
    enabled: !!id,
  });

  if (episodeLoading || !episode) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-muted mb-8" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <Link to={`/show/${episode.season.show.id}`}>
            <ChevronLeft className="h-4 w-4" />
            Back to {episode.season.show.title}
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">
          Episode {episode.episode_number}: {episode.title}
        </h1>
      </div>

      {videos?.length ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No videos available for this episode.</p>
      )}
    </div>
  );
}
