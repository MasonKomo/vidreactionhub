
import { CategoryFilters } from "@/components/CategoryFilters";
import { VideoGrid } from "@/components/VideoGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CategoryFilters />
      <VideoGrid />
    </div>
  );
};

export default Index;
