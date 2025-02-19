
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { VideoCard } from "./show/VideoCard";

type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  views_count: number;
  created_at: string;
};

type Show = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  platform: string;
};

async function fetchTopShows() {
  const { data, error } = await supabase
    .from('shows')
    .select('id, title, thumbnail_url, platform')
    .eq('top_show', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching top shows:', error);
    throw error;
  }
  return data;
}

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

  if (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
  
  return data || [];
}

function TopShowsSection() {
  const navigate = useNavigate();
  const { data: shows, isLoading, error } = useQuery({
    queryKey: ['topShows'],
    queryFn: fetchTopShows,
  });

  if (isLoading) {
    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex-shrink-0 w-[300px] overflow-hidden bg-card">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error in TopShowsSection:', error);
    return null;
  }

  if (!shows?.length) return null;

  return (
    <div className="overflow-x-auto pb-4">
      <h2 className="text-xl font-semibold mb-4 px-4">Top Shows</h2>
      <div className="flex gap-4 px-4">
        {shows.map((show) => (
          <Card 
            key={show.id} 
            className="flex-shrink-0 w-[300px] overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/show/${show.id}`)}
          >
            <div className="aspect-video bg-muted">
              {show.thumbnail_url && (
                <img
                  src={show.thumbnail_url}
                  alt={show.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium line-clamp-2">{show.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{show.platform}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function VideoGrid() {
  const { toast } = useToast();
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching videos:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load videos. Please try again later.",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <TopShowsSection />
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <TopShowsSection />
        <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
          Error loading videos. Please try again later.
        </div>
      </div>
    );
  }

  if (!videos?.length) {
    return (
      <div className="space-y-8">
        <TopShowsSection />
        <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
          No videos found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TopShowsSection />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            thumbnail_url={video.thumbnail_url}
            views_count={video.views_count}
            created_at={video.created_at}
          />
        ))}
      </div>
    </div>
  );
}
