
import { CircleNotch, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProcessingIndicatorProps {
  title: string;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ title }) => {
  return (
    <Card className="max-w-md mx-auto my-12">
      <CardContent className="pt-6 text-center">
        <div className="flex justify-center">
          <CircleNotch className="h-10 w-10 text-meeting-primary animate-spin" />
        </div>
        <h2 className="text-xl font-semibold mt-4">{title}</h2>
        <p className="text-gray-500 mt-2">
          We're processing your meeting. This usually takes about 1-2 minutes.
        </p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-500" />
          <p className="text-sm text-gray-600">
            Your meeting will be automatically processed. You can check back later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingIndicator;
