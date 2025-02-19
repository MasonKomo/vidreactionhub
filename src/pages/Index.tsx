
import { CategoryFilters } from "@/components/CategoryFilters";
import { VideoGrid } from "@/components/VideoGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <CategoryFilters />
        <VideoGrid />
      </main>
    </div>
  );
};

export default Index;
