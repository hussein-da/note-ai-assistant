
import { Link } from "react-router-dom";
import { MicIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b py-3 px-4 bg-white sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-meeting-primary rounded-full p-2">
            <MicIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">MeetingBuddy</h1>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="font-medium text-gray-600 hover:text-meeting-primary transition-colors">
            Home
          </Link>
          <Link to="/history" className="font-medium text-gray-600 hover:text-meeting-primary transition-colors">
            Meeting History
          </Link>
          <Button asChild variant="default" className="bg-meeting-primary hover:bg-meeting-secondary">
            <Link to="/upload">Upload Meeting</Link>
          </Button>
        </nav>
        <Button asChild variant="default" className="md:hidden bg-meeting-primary hover:bg-meeting-secondary">
          <Link to="/upload">Upload</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
