
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="flex-1 container max-w-7xl mx-auto py-16 px-4 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-lg">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-meeting-primary hover:bg-meeting-secondary">
        <Link to="/">Return to Home</Link>
      </Button>
    </main>
  );
};

export default NotFoundPage;
