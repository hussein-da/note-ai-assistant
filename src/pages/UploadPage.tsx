
import UploadForm from "@/components/UploadForm";

const UploadPage = () => {
  return (
    <main className="flex-1 container max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Upload Meeting Recording</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Upload your meeting recording and our AI will transcribe it, create a summary, and extract action items.
        </p>
      </div>
      
      <UploadForm />
      
      <div className="mt-16 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Tips for Better Results</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-meeting-primary font-bold">•</span>
            <span>Use a clear recording with minimal background noise for best transcription quality.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-meeting-primary font-bold">•</span>
            <span>For action items to be extracted correctly, try to clearly state assigned tasks during the meeting.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-meeting-primary font-bold">•</span>
            <span>Mention names when assigning tasks, along with deadlines if applicable.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-meeting-primary font-bold">•</span>
            <span>For longer meetings (over 1 hour), processing may take slightly longer.</span>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default UploadPage;
