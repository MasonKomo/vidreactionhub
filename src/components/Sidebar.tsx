
import { Home, Tv, Film, Flame, Clock, ThumbsUp, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Tv, label: "TV Shows" },
  { icon: Film, label: "Movies" },
  { icon: Flame, label: "Trending" },
  { icon: Clock, label: "Watch Later" },
  { icon: ThumbsUp, label: "Liked" },
  { icon: BookMarked, label: "Saved" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r h-[calc(100vh-3.5rem)] shrink-0 hidden md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent",
                  item.active && "bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
