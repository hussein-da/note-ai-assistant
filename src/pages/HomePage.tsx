
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Mic, History, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This will be replaced with actual Supabase auth check once integrated
    const checkAuth = () => {
      setIsAuthenticated(false);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-meeting-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="flex-1">
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <Hero />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="mb-3 bg-meeting-primary/10 w-12 h-12 flex items-center justify-center rounded-full">
              <Mic className="text-meeting-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Meetings</h3>
            <p className="text-gray-600 mb-4">
              Upload your meeting recordings and our AI will process them automatically.
            </p>
            <Button 
              onClick={() => navigate("/upload")}
              variant="outline" 
              className="mt-auto"
            >
              Upload Now
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="mb-3 bg-meeting-primary/10 w-12 h-12 flex items-center justify-center rounded-full">
              <History className="text-meeting-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Meeting History</h3>
            <p className="text-gray-600 mb-4">
              View all your past meetings, summaries, and action items in one place.
            </p>
            <Button 
              onClick={() => navigate("/history")}
              variant="outline" 
              className="mt-auto"
            >
              View History
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-meeting-primary to-meeting-secondary p-6 rounded-lg shadow text-white">
            <h3 className="text-xl font-semibold mb-3">Get Started Today</h3>
            <p className="mb-6 opacity-90">
              Start saving time on your meeting notes and never miss an action item again.
            </p>
            <Button 
              onClick={handleGetStarted}
              variant="default" 
              className="bg-white text-meeting-primary hover:bg-gray-100 w-full"
            >
              {isAuthenticated ? "Upload a Meeting" : "Create an Account"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-meeting-primary/10 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4">
                <span className="text-meeting-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload</h3>
              <p className="text-gray-600">
                Upload your meeting recording in popular audio formats.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-meeting-primary/10 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4">
                <span className="text-meeting-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">Process</h3>
              <p className="text-gray-600">
                Our AI transcribes and analyzes your meeting content.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-meeting-primary/10 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4">
                <span className="text-meeting-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Review</h3>
              <p className="text-gray-600">
                Get a transcript, summary, and action items from your meeting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
