
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Mic, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createMeeting } from "@/services/meetingService";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Meeting title must be at least 2 characters.",
  }),
  file: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const meeting = await createMeeting({
        title: data.title,
        file,
      });

      toast({
        title: "Meeting upload started",
        description: "Your meeting is being processed. This may take a few moments.",
      });

      // Navigate to the meeting details page
      navigate(`/meeting/${meeting.id}`);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your meeting.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      form.setValue("file", selectedFile);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Upload Meeting Recording</h2>
              <p className="text-gray-500">
                Upload your audio recording to transcribe and generate a summary.
              </p>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly Team Meeting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Audio File</FormLabel>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  file ? "border-meeting-primary" : "border-gray-300"
                }`}
              >
                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-meeting-primary/10 flex items-center justify-center">
                      <FileAudio className="h-8 w-8 text-meeting-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        form.setValue("file", undefined);
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-500">
                        Drag and drop your audio file here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports MP3, WAV, M4A (Max 2 hours, 200MB)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="relative"
                    >
                      <input
                        id="file-upload"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      Select File
                    </Button>
                  </div>
                )}
              </div>
            </FormItem>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isUploading || !file}
                className="w-full bg-meeting-primary hover:bg-meeting-secondary"
              >
                {isUploading ? (
                  <>
                    <span className="animate-pulse-light">Processing...</span>
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" /> Transcribe Meeting
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
