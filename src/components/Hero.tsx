
import { ArrowRight, CheckCircle, Mic, FileText, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">AI-Powered</span> Meeting Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              MeetingBuddy automatically transcribes your meetings, generates summaries, and extracts action items so you never miss important details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-meeting-primary hover:bg-meeting-secondary">
                <Link to="/upload">Upload a Meeting <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/history">View Meeting History</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-meeting-primary" />
                <span className="text-gray-700">Automatic Transcription</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-meeting-primary" />
                <span className="text-gray-700">Smart Summaries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-meeting-primary" />
                <span className="text-gray-700">Action Item Extraction</span>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 max-w-md lg:max-w-none">
            <div className="col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100 meeting-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-meeting-primary/10 p-2 rounded-full">
                  <Mic className="h-6 w-6 text-meeting-primary" />
                </div>
                <h3 className="font-semibold">Upload Recording</h3>
              </div>
              <p className="text-gray-600 text-sm">Upload your meeting recordings and let our AI do the work.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 meeting-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-meeting-secondary/10 p-2 rounded-full">
                  <FileText className="h-6 w-6 text-meeting-secondary" />
                </div>
                <h3 className="font-semibold">Get Transcript</h3>
              </div>
              <p className="text-gray-600 text-sm">Receive accurate transcripts in minutes.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 meeting-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-meeting-accent/10 p-2 rounded-full">
                  <ListChecks className="h-6 w-6 text-meeting-accent" />
                </div>
                <h3 className="font-semibold">Extract Tasks</h3>
              </div>
              <p className="text-gray-600 text-sm">Never miss an action item again.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
