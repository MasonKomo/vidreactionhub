
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { VideoGrid } from "@/components/VideoGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <CategoryFilters />
          <VideoGrid />
        </main>
      </div>
    </div>
  );
};

export default Index;
