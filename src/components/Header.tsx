
import { Search, Menu, Video, BellRing, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" className="shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Video className="h-5 w-5 text-youtube-red" />
          <span>ReactHub</span>
        </Link>
        
        <div className="flex-1 flex items-center justify-center max-w-2xl">
          <div className="flex w-full items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Search reactions..."
                className="w-full bg-muted pl-4 pr-10"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon">
                <BellRing className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
