
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t py-8 mt-auto">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-gray-700">MeetingBuddy</p>
            <p className="text-sm text-gray-500">Your AI meeting assistant</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-meeting-primary">
              Home
            </Link>
            <Link to="/history" className="text-sm text-gray-600 hover:text-meeting-primary">
              Meeting History
            </Link>
            <Link to="/upload" className="text-sm text-gray-600 hover:text-meeting-primary">
              Upload Meeting
            </Link>
            <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-meeting-primary">
              Terms of Service
            </Link>
            <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-meeting-primary">
              Privacy Policy
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} MeetingBuddy
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Created by Hussein Daoud</span>
              <a 
                href="https://github.com/hussein-da" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-600 hover:text-meeting-primary"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              This is a personal project. For collaboration inquiries, please reach out via GitHub.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
