import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type Show = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  platform: string;
};

type Season = {
  id: string;
  title: string;
  season_number: number;
};

type Episode = {
  id: string;
  title: string;
  episode_number: number;
  video: {
    id: string;
    thumbnail_url: string;
    views_count: number;
    created_at: string;
  } | null;
};

type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

async function fetchShow(id: string): Promise<Show> {
  const { data, error } = await supabase
    .from('shows')
    .select('id, title, description, thumbnail_url, platform')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

async function fetchSeasons(showId: string): Promise<Season[]> {
  const { data, error } = await supabase
    .from('seasons')
    .select('id, title, season_number')
    .eq('show_id', showId)
    .order('season_number');

  if (error) throw error;
  return data || [];
}

async function fetchEpisodes(seasonId: string): Promise<Episode[]> {
  const { data, error } = await supabase
    .from('episodes')
    .select(`
      id,
      title,
      episode_number,
      video:videos(
        id,
        thumbnail_url,
        views_count,
        created_at
      )
    `)
    .eq('season_id', seasonId)
    .order('episode_number');

  if (error) throw error;
  return data || [];
}

async function fetchShowVideos(showId: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, thumbnail_url, views_count, created_at')
    .eq('show_id', showId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function ShowHeader({ show }: { show: Show }) {
  return (
    <div className="relative h-[300px] mb-8">
      {show.thumbnail_url && (
        <>
          <div className="absolute inset-0">
            <img
              src={show.thumbnail_url}
              alt={show.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
          </div>
        </>
      )}
      <div className="absolute bottom-0 left-0 p-8">
        <h1 className="text-4xl font-bold mb-2">{show.title}</h1>
        {show.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">{show.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">Watch on {show.platform}</p>
      </div>
    </div>
  );
}

export default function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedSeason, setSelectedSeason] = React.useState<string>();
  
  const { data: show, isLoading: showLoading } = useQuery<Show>({
    queryKey: ['show', id],
    queryFn: () => fetchShow(id!),
    enabled: !!id,
  });

  const { data: seasons } = useQuery<Season[]>({
    queryKey: ['seasons', id],
    queryFn: () => fetchSeasons(id!),
    enabled: !!id,
  });

  const { data: episodes } = useQuery<Episode[]>({
    queryKey: ['episodes', selectedSeason],
    queryFn: () => fetchEpisodes(selectedSeason!),
    enabled: !!selectedSeason,
  });

  const { data: videos } = useQuery<Video[]>({
    queryKey: ['showVideos', id],
    queryFn: () => fetchShowVideos(id!),
    enabled: !!id,
  });

  React.useEffect(() => {
    if (seasons?.length && !selectedSeason) {
      setSelectedSeason(seasons[0].id);
    }
  }, [seasons, selectedSeason]);

  if (showLoading || !show) {
    return (
      <div className="animate-pulse">
        <div className="h-[300px] bg-muted" />
      </div>
    );
  }

  return (
    <div>
      <ShowHeader show={show} />
      
      <div className="p-8 space-y-8">
        {seasons?.length ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">Episodes</h2>
              <Select
                value={selectedSeason}
                onValueChange={setSelectedSeason}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      Season {season.season_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {episodes?.map((episode) => (
                <Card 
                  key={episode.id}
                  className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  {episode.video ? (
                    <>
                      <div className="aspect-video bg-muted">
                        <img
                          src={episode.video.thumbnail_url}
                          alt={episode.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium line-clamp-2">
                          {episode.episode_number}. {episode.title}
                        </h3>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>
                            {formatViewCount(episode.video.views_count)} views • {
                              format(new Date(episode.video.created_at), 'MMM d, yyyy')
                            }
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <h3 className="font-medium">
                        {episode.episode_number}. {episode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">No video available</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        {videos?.length ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">All Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <Card 
                  key={video.id}
                  className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="aspect-video bg-muted">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2">{video.title}</h3>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        {formatViewCount(video.views_count)} views • {
                          format(new Date(video.created_at), 'MMM d, yyyy')
                        }
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
