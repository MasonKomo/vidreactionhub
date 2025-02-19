
import { Card } from "@/components/ui/card";

const videos = [
  {
    id: 1,
    title: "Breaking Bad S05E14 'Ozymandias' Reaction",
    thumbnail: "https://i.ytimg.com/vi/placeholder/maxresdefault.jpg",
    channel: "ReactMaster",
    views: "1.2M",
    timestamp: "2 weeks ago",
  },
  {
    id: 2,
    title: "Game of Thrones Finale - First Time Watch!",
    thumbnail: "https://i.ytimg.com/vi/placeholder2/maxresdefault.jpg",
    channel: "SeriesReactions",
    views: "890K",
    timestamp: "3 days ago",
  },
  // More video entries would go here
];

export function VideoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden bg-card hover:bg-accent/50 transition-colors cursor-pointer">
          <div className="aspect-video bg-muted" />
          <div className="p-4">
            <h3 className="font-medium line-clamp-2">{video.title}</h3>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{video.channel}</p>
              <p>
                {video.views} views • {video.timestamp}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
