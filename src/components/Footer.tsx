
import { Link } from "react-router-dom";

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
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} MeetingBuddy
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
