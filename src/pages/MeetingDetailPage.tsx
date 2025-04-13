
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMeetingById } from "@/services/meetingService";
import { Meeting, ActionItem } from "@/types/meeting";
import { Calendar, Clock, Download, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActionItemsList from "@/components/ActionItemsList";
import MeetingDetailSkeleton from "@/components/MeetingDetailSkeleton";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import { Link } from "react-router-dom";

const MeetingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      if (!id) return;
      
      try {
        const data = await getMeetingById(id);
        if (data) {
          setMeeting(data);
          
          // If the meeting is still processing, poll for updates
          if (data.status === 'processing') {
            if (!pollingInterval) {
              const interval = window.setInterval(async () => {
                const updatedData = await getMeetingById(id);
                if (updatedData) {
                  setMeeting(updatedData);
                  
                  // If processing is complete, stop polling
                  if (updatedData.status !== 'processing') {
                    if (pollingInterval) {
                      clearInterval(pollingInterval);
                      setPollingInterval(null);
                    }
                  }
                }
              }, 5000); // Poll every 5 seconds
              
              setPollingInterval(interval);
            }
          } else if (pollingInterval) {
            // If not processing but polling is active, stop it
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        }
      } catch (error) {
        console.error("Error fetching meeting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [id, pollingInterval]);

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle action item updates
  const handleActionItemUpdate = (updatedItem: ActionItem) => {
    if (!meeting || !meeting.actionItems) return;
    
    const updatedActionItems = meeting.actionItems.map((item) => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    setMeeting({
      ...meeting,
      actionItems: updatedActionItems
    });
  };

  if (loading) {
    return (
      <main className="flex-1 container max-w-7xl mx-auto py-10 px-4">
        <MeetingDetailSkeleton />
      </main>
    );
  }

  if (!meeting) {
    return (
      <main className="flex-1 container max-w-7xl mx-auto py-10 px-4">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Meeting Not Found</h2>
          <p className="text-gray-600 mb-6">The meeting you're looking for doesn't exist or has been removed.</p>
          <Button asChild variant="outline">
            <Link to="/history">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Meeting History
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  if (meeting.status === 'processing') {
    return (
      <main className="flex-1 container max-w-7xl mx-auto py-10 px-4">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Meeting History
          </Link>
        </Button>
        <ProcessingIndicator title={meeting.title} />
      </main>
    );
  }

  return (
    <main className="flex-1 container max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/history">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <Badge className="bg-green-500">Completed</Badge>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">{meeting.title}</h1>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(meeting.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{meeting.duration}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Button variant="outline" disabled>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
          <TabsTrigger value="action-items">Action Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Meeting Summary</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {meeting.summary || "No summary available for this meeting."}
            </p>
          </div>
          
          {meeting.actionItems && meeting.actionItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <ActionItemsList 
                actionItems={meeting.actionItems} 
                meetingId={meeting.id}
                onActionItemUpdate={handleActionItemUpdate}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="transcript">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Full Transcript</h2>
              <div className="flex items-center text-gray-500 text-sm">
                <FileText className="h-4 w-4 mr-1" />
                <span>Full text record of the meeting</span>
              </div>
            </div>
            <div className="prose max-w-none">
              {meeting.transcript ? (
                <pre className="text-gray-700 whitespace-pre-wrap font-sans text-base">
                  {meeting.transcript}
                </pre>
              ) : (
                <p className="text-gray-500">No transcript available for this meeting.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="action-items">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            {meeting.actionItems && meeting.actionItems.length > 0 ? (
              <ActionItemsList 
                actionItems={meeting.actionItems} 
                meetingId={meeting.id}
                onActionItemUpdate={handleActionItemUpdate}
              />
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No Action Items Found</h3>
                <p className="text-gray-500">
                  No action items were detected in this meeting. Action items are typically tasks or
                  assignments mentioned during the meeting.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default MeetingDetailPage;
