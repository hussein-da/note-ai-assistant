
import { Meeting, ActionItem, MeetingFormData } from '@/types/meeting';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Helper function to map database meeting objects to Meeting type
const mapDbMeetingToMeeting = (dbMeeting: any): Meeting => {
  return {
    id: dbMeeting.id,
    title: dbMeeting.title,
    date: dbMeeting.date,
    duration: dbMeeting.duration || '30 minutes',
    status: dbMeeting.status,
    transcript: dbMeeting.transcript,
    summary: dbMeeting.summary,
    audioUrl: dbMeeting.audio_path,
    actionItems: []
  };
};

// Helper function for delay (for simulation purposes only)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all meetings
export const getMeetings = async (): Promise<Meeting[]> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.error('No user logged in');
      return [];
    }

    const { data: meetingsData, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('date', { ascending: false });

    if (meetingsError) throw meetingsError;

    const meetings = meetingsData.map(mapDbMeetingToMeeting);

    // Fetch action items for each meeting
    for (const meeting of meetings) {
      const { data: actionItemsData, error: actionItemsError } = await supabase
        .from('action_items')
        .select('*')
        .eq('meeting_id', meeting.id);

      if (!actionItemsError && actionItemsData) {
        meeting.actionItems = actionItemsData.map(item => ({
          id: item.id,
          meetingId: item.meeting_id,
          text: item.text,
          assignee: item.assignee,
          dueDate: item.due_date,
          completed: item.completed
        }));
      }
    }

    return meetings;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return [];
  }
};

// Fetch a single meeting by ID
export const getMeetingById = async (id: string): Promise<Meeting | undefined> => {
  try {
    const { data: meetingData, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (meetingError) throw meetingError;

    const meeting = mapDbMeetingToMeeting(meetingData);

    // Fetch action items for the meeting
    const { data: actionItemsData, error: actionItemsError } = await supabase
      .from('action_items')
      .select('*')
      .eq('meeting_id', id);

    if (!actionItemsError && actionItemsData) {
      meeting.actionItems = actionItemsData.map(item => ({
        id: item.id,
        meetingId: item.meeting_id,
        text: item.text,
        assignee: item.assignee,
        dueDate: item.due_date,
        completed: item.completed
      }));
    }

    return meeting;
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return undefined;
  }
};

// Create a new meeting
export const createMeeting = async (meetingData: MeetingFormData): Promise<Meeting> => {
  try {
    console.log('Starting meeting creation process');
    
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.error('No user logged in');
      throw new Error('You must be logged in to create a meeting');
    }

    // Validate audio file
    const audioFile = meetingData.file;
    if (!audioFile) {
      console.error('No audio file selected');
      throw new Error('Please select an audio file to upload');
    }

    console.log('Uploading file:', audioFile.name, 'Size:', audioFile.size);

    // Generate a unique filename
    const fileName = `${userData.user.id}/${Date.now()}-${audioFile.name}`;
    
    // Check if storage bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const meetingsBucketExists = buckets?.some(bucket => bucket.name === 'meetings');
    
    if (!meetingsBucketExists) {
      console.log('Creating meetings bucket');
      const { error: createBucketError } = await supabase.storage.createBucket('meetings', {
        public: true
      });
      
      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        throw new Error('Failed to create storage bucket');
      }
    }

    // Upload audio file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meetings')
      .upload(fileName, audioFile);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Generate audio URL
    const { data: { publicUrl: audioUrl } } = supabase.storage
      .from('meetings')
      .getPublicUrl(fileName);

    console.log('File uploaded successfully, URL:', audioUrl);

    // Create a new meeting in the database
    const { data: newMeeting, error } = await supabase
      .from('meetings')
      .insert({
        title: meetingData.title,
        status: 'processing',
        user_id: userData.user.id,
        audio_path: audioUrl,
        date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating meeting record:', error);
      throw error;
    }

    console.log('Meeting record created:', newMeeting.id);
    const meeting = mapDbMeetingToMeeting(newMeeting);

    // Start processing with the Edge Function
    try {
      const response = await fetch('/api/process-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          meetingId: meeting.id,
          audioUrl: meeting.audioUrl,
        }),
      });
      
      if (!response.ok) {
        console.warn('Process meeting API returned non-OK response:', response.status);
        // Don't throw here - we still want to return the meeting
      }
    } catch (processingError) {
      console.error('Error calling process-meeting API:', processingError);
      // Don't throw here - we still want to return the meeting even if processing fails
    }

    return meeting;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

// Update an action item status
export const updateActionItem = async (
  meetingId: string, 
  actionItemId: string, 
  completed: boolean
): Promise<ActionItem | undefined> => {
  try {
    const { data, error } = await supabase
      .from('action_items')
      .update({ completed })
      .eq('id', actionItemId)
      .eq('meeting_id', meetingId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      meetingId: data.meeting_id,
      text: data.text,
      assignee: data.assignee,
      dueDate: data.due_date,
      completed: data.completed
    };
  } catch (error) {
    console.error('Error updating action item:', error);
    return undefined;
  }
};
