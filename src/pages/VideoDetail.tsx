
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "@/components/show/VideoCard";
import { format } from "date-fns";
import { formatViewCount } from "@/lib/format";

type VideoDetails = {
  id: string;
  title: string;
  description: string | null;
  youtube_video_id: string;
  views_count: number;
  created_at: string;
  show: {
    id: string;
    title: string;
  } | null;
  episode: {
    id: string;
    title: string;
    episode_number: number;
    season: {
      season_number: number;
      show: {
        id: string;
        title: string;
      };
    };
  } | null;
};

type RelatedVideo = {
  id: string;
  title: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

async function fetchVideoDetails(id: string) {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      title,
      description,
      youtube_video_id,
      views_count,
      created_at,
      show:shows (
        id,
        title
      ),
      episode:episodes (
        id,
        title,
        episode_number,
        season:seasons (
          season_number,
          show:shows (
            id,
            title
          )
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

async function fetchRelatedVideos(videoId: string, episodeId?: string, showId?: string) {
  let query = supabase
    .from('videos')
    .select('id, title, thumbnail_url, views_count, created_at')
    .neq('id', videoId)
    .order('views_count', { ascending: false })
    .limit(8);

  if (episodeId) {
    query = query.eq('episode_id', episodeId);
  } else if (showId) {
    query = query.eq('show_id', showId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: () => fetchVideoDetails(id!),
    enabled: !!id,
  });

  const { data: relatedVideos } = useQuery({
    queryKey: ['relatedVideos', id, video?.episode?.id, video?.show?.id],
    queryFn: () => fetchRelatedVideos(id!, video?.episode?.id, video?.show?.id),
    enabled: !!id && (!!video?.episode?.id || !!video?.show?.id),
  });

  if (videoLoading || !video) {
    return (
      <div className="animate-pulse p-8">
        <div className="h-[480px] bg-muted rounded-lg mb-8" />
        <div className="h-8 bg-muted rounded w-1/2 mb-4" />
        <div className="h-4 bg-muted rounded w-1/4" />
      </div>
    );
  }

  const showTitle = video.episode?.season.show.title || video.show?.title;
  const backLink = video.episode 
    ? `/episode/${video.episode.id}`
    : video.show
    ? `/show/${video.show.id}`
    : '/';

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <Link to={backLink}>
            <ChevronLeft className="h-4 w-4" />
            Back to {showTitle}
          </Link>
        </Button>
      </div>

      <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtube_video_id}?rel=0&modestbranding=1`}
          title={video.title}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{video.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{formatViewCount(video.views_count)} views</span>
          <span className="mx-2">•</span>
          <span>{format(new Date(video.created_at), 'MMM d, yyyy')}</span>
          <span className="mx-2">•</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm h-auto p-0"
            asChild
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              Watch on YouTube
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        {video.description && (
          <p className="text-muted-foreground whitespace-pre-wrap">{video.description}</p>
        )}
      </div>

      {video.episode && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Episode Information</h2>
          <p>
            Season {video.episode.season.season_number}, Episode {video.episode.episode_number}: {video.episode.title}
          </p>
        </div>
      )}

      {relatedVideos?.length ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">More Reactions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {relatedVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
