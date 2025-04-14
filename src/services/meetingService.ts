import { Meeting, ActionItem, MeetingFormData } from '@/types/meeting';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Hilfsfunktion, um aus Supabase-Daten Meeting-Objekte zu erstellen
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

// Hilfsfunktion für Verzögerung (nur für Simulationszwecke)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Alle Meetings abrufen
export const getMeetings = async (): Promise<Meeting[]> => {
  try {
    // Aktuellen Benutzer abrufen
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.error('Kein Benutzer angemeldet');
      return [];
    }

    const { data: meetingsData, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('date', { ascending: false });

    if (meetingsError) throw meetingsError;

    const meetings = meetingsData.map(mapDbMeetingToMeeting);

    // Action Items für jedes Meeting abrufen
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
    console.error('Fehler beim Abrufen der Meetings:', error);
    return [];
  }
};

// Ein einzelnes Meeting anhand der ID abrufen
export const getMeetingById = async (id: string): Promise<Meeting | undefined> => {
  try {
    const { data: meetingData, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (meetingError) throw meetingError;

    const meeting = mapDbMeetingToMeeting(meetingData);

    // Action Items für das Meeting abrufen
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
    console.error('Fehler beim Abrufen des Meetings:', error);
    return undefined;
  }
};

// Ein neues Meeting erstellen
export const createMeeting = async (meetingData: MeetingFormData): Promise<Meeting> => {
  try {
    // Aktuellen Benutzer abrufen
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('Kein Benutzer angemeldet');
    }

    // Audio-Datei in den Storage hochladen
    const audioFile = meetingData.file;
    if (!audioFile) {
      throw new Error('Keine Audio-Datei ausgewählt');
    }

    const fileName = `${userData.user.id}/${Date.now()}-${audioFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meetings')
      .upload(fileName, audioFile);

    if (uploadError) throw uploadError;

    // Audio-URL generieren
    const { data: { publicUrl: audioUrl } } = supabase.storage
      .from('meetings')
      .getPublicUrl(fileName);

    // Erstelle ein neues Meeting in der Datenbank
    const { data: newMeeting, error } = await supabase
      .from('meetings')
      .insert({
        title: meetingData.title,
        status: 'processing',
        user_id: userData.user.id,
        audio_path: audioUrl,
      })
      .select()
      .single();

    if (error) throw error;

    const meeting = mapDbMeetingToMeeting(newMeeting);

    // Starte die Verarbeitung mit der Edge-Funktion
    fetch('/api/process-meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        meetingId: meeting.id,
        audioUrl: meeting.audioUrl,
      }),
    }).catch(console.error); // Wir fangen Fehler hier ab, da dies asynchron läuft

    return meeting;
  } catch (error) {
    console.error('Fehler beim Erstellen des Meetings:', error);
    throw error;
  }
};

// Status eines Action Items aktualisieren
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
    console.error('Fehler beim Aktualisieren des Action Items:', error);
    return undefined;
  }
};
