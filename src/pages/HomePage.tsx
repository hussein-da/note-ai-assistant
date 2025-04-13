
import Hero from "@/components/Hero";
import { Clock, CheckCircle, CloudLightning } from "lucide-react";

const HomePage = () => {
  return (
    <main className="flex-1">
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">How MeetingBuddy Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Transform your meeting recordings into actionable insights in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 meeting-card">
              <div className="bg-meeting-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <CloudLightning className="h-7 w-7 text-meeting-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Recording</h3>
              <p className="text-gray-600">
                Simply upload your meeting audio file. We support most common formats like MP3, WAV, and M4A.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 meeting-card">
              <div className="bg-meeting-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-7 w-7 text-meeting-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-gray-600">
                Our AI transcribes the audio and analyzes the content to identify key points and action items.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 meeting-card">
              <div className="bg-meeting-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-7 w-7 text-meeting-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Results</h3>
              <p className="text-gray-600">
                Review your meeting transcript, summary, and action items. Export or share with your team.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">Why Use MeetingBuddy?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Save time and never miss important details from your meetings again.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="bg-meeting-primary/10 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-meeting-primary font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-gray-600">
                  No more manual note-taking or spending hours reviewing recordings. Get comprehensive meeting summaries in minutes.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-meeting-primary/10 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-meeting-primary font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Capture Every Detail</h3>
                <p className="text-gray-600">
                  Ensure no important information or action items are missed with accurate transcription and AI analysis.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-meeting-primary/10 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-meeting-primary font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Focus on Participation</h3>
                <p className="text-gray-600">
                  Be fully present in your meetings without worrying about taking notes. MeetingBuddy has you covered.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-meeting-primary/10 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-meeting-primary font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track Action Items</h3>
                <p className="text-gray-600">
                  Automatically extract and organize action items with assigned owners and due dates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
