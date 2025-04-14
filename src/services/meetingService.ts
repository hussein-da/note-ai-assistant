
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
    const { data: meetingsData, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
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
    // Erstelle ein neues Meeting in der Datenbank
    const { data: newMeeting, error } = await supabase
      .from('meetings')
      .insert([{
        title: meetingData.title,
        status: 'processing',
        // Weitere Felder werden mit Standardwerten gefüllt
      }])
      .select()
      .single();

    if (error) throw error;

    const meeting: Meeting = mapDbMeetingToMeeting(newMeeting);

    // Simuliere die asynchrone Verarbeitung des Meetings
    setTimeout(async () => {
      // Nach einer Verzögerung das Meeting mit "fertiggestellten" Daten aktualisieren
      const transcript = `
      [Meeting-Transkript würde hier nach der Verarbeitung stehen]
      Teilnehmer 1: Hallo zusammen, beginnen wir mit dem Meeting.
      Teilnehmer 2: Ich habe am Projekt gearbeitet und möchte einige Updates teilen.
      Teilnehmer 1: Sehr gut, bitte teile deine Erkenntnisse.
      Teilnehmer 2: Wir haben die erste Phase abgeschlossen und gehen jetzt zur Implementierung über.
      Teilnehmer 3: Ich habe eine Frage zum Zeitplan. Sind wir noch auf Kurs für die Veröffentlichung im Juni?
      Teilnehmer 1: Ja, das sind wir. Aber wir müssen sicherstellen, dass das QA-Team vorbereitet ist.
      Teilnehmer 4: Ich werde mit dem QA-Team koordinieren, um sicherzustellen, dass sie bis zum 15. Mai bereit sind.
      Teilnehmer 1: Perfekt. Außerdem müssen wir die Dokumentation aktualisieren. Kann jemand das übernehmen?
      Teilnehmer 2: Ich kann an der Dokumentation arbeiten. Ich werde sie bis Ende nächster Woche fertig haben.
      Teilnehmer 1: Danke. Gibt es noch etwas, das wir besprechen müssen?
      Teilnehmer 3: Ich denke, wir haben alles für den Moment besprochen.
      Teilnehmer 1: Gut, dann treffen wir uns nächste Woche wieder. Vielen Dank an alle.
      `;
      
      const summary = 'Das Team hat den Projektfortschritt besprochen und bestätigt, dass sie für die Veröffentlichung im Juni auf Kurs sind. Sie haben Verantwortlichkeiten für die QA-Vorbereitung und Dokumentationsaktualisierungen zugewiesen. Die erste Phase ist abgeschlossen und die Implementierung beginnt. Das nächste Meeting ist für nächste Woche geplant.';
      
      // Update des Meeting-Status und der Daten
      const { error: updateError } = await supabase
        .from('meetings')
        .update({
          status: 'completed',
          transcript,
          summary
        })
        .eq('id', meeting.id);
      
      if (updateError) {
        console.error('Fehler beim Aktualisieren des Meetings:', updateError);
        return;
      }
      
      // Füge einige Action Items hinzu
      const actionItems = [
        {
          meeting_id: meeting.id,
          text: 'Koordination mit dem QA-Team für die Bereitschaft am 15. Mai',
          assignee: 'Teilnehmer 4',
          due_date: '2025-05-10',
          completed: false
        },
        {
          meeting_id: meeting.id,
          text: 'Aktualisierung der Projektdokumentation',
          assignee: 'Teilnehmer 2',
          due_date: '2025-04-21',
          completed: false
        }
      ];
      
      const { error: actionItemsError } = await supabase
        .from('action_items')
        .insert(actionItems);
      
      if (actionItemsError) {
        console.error('Fehler beim Hinzufügen von Action Items:', actionItemsError);
      }
    }, 10000); // Simuliere 10 Sekunden Verarbeitungszeit
    
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
