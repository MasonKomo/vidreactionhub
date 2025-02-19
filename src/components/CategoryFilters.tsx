
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "TV Shows",
  "Movies",
  "Anime",
  "Netflix",
  "HBO",
  "Disney+",
  "Prime",
  "Popular",
  "New",
];

export function CategoryFilters() {
  return (
    <div className="scrollbar-hide overflow-x-auto py-4">
      <div className="flex gap-2 px-4 min-w-max">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant="secondary"
            className={cn(
              "rounded-full px-4 py-1 text-sm font-medium transition-colors",
              index === 0 && "bg-white/10 text-white"
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
