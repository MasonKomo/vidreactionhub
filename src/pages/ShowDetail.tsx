
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ShowHeader } from "@/components/show/ShowHeader";
import { EpisodeCard } from "@/components/show/EpisodeCard";
import { VideoCard } from "@/components/show/VideoCard";

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
  type RawEpisode = {
    id: string;
    title: string;
    episode_number: number;
    video: [{
      id: string;
      thumbnail_url: string;
      views_count: number;
      created_at: string;
    }] | [];
  };

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

  // Transform the data to match our Episode type
  return (data as RawEpisode[]).map(episode => ({
    ...episode,
    video: episode.video.length > 0 ? episode.video[0] : null
  }));
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
      <ShowHeader {...show} />
      
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
                <EpisodeCard
                  key={episode.id}
                  id={episode.id}
                  title={episode.title}
                  episodeNumber={episode.episode_number}
                  video={episode.video}
                />
              ))}
            </div>
          </div>
        ) : null}

        {videos?.length ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">All Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
