import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

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
  try {
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
  } catch (error) {
    console.error('Error in fetchTopShows:', error);
    throw error;
  }
}

async function fetchVideos() {
  try {
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
    console.log('Fetched videos:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    throw error;
  }
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
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
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });

  if (error) {
    console.error('Error in VideoGrid:', error);
  }

  return (
    <div className="space-y-8">
      <TopShowsSection />
      
      {isLoading ? (
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
      ) : error ? (
        <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
          Error loading videos. Please try again later. {error.message}
        </div>
      ) : !videos?.length ? (
        <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
          No videos found.
        </div>
      ) : (
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
      )}
    </div>
  );
}
