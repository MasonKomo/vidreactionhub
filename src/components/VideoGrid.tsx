
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

async function fetchVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      title,
      thumbnail_url,
      views_count,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function VideoGrid() {
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-card">
            <div className="aspect-video bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
        Error loading videos. Please try again later.
      </div>
    );
  }

  if (!videos?.length) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
        No videos found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {videos.map((video) => (
        <Card 
          key={video.id} 
          className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="aspect-video bg-muted">
            {video.thumbnail_url && (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            )}
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
  );
}
