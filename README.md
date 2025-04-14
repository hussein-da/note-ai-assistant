
# Meeting Transcription App

Diese Anwendung transkribiert und analysiert Meetings mit Hilfe von KI.

## Setup für Entwickler

### 1. Repository klonen
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Supabase Projekt einrichten
1. Erstellen Sie ein neues [Supabase Projekt](https://supabase.com)
2. Gehen Sie zu den Projekteinstellungen > Functions
3. Fügen Sie den OpenAI API-Key als Secret hinzu:
   - Name: `OPENAI_API_KEY`
   - Value: Ihr OpenAI API-Key von [OpenAI API Keys](https://platform.openai.com/api-keys)

### 3. Datenbank-Migration
Führen Sie die folgenden SQL-Befehle in der Supabase SQL Editor aus:

```sql
-- Erstellen der meetings Tabelle
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    audio_path TEXT,
    transcript TEXT,
    summary TEXT,
    status TEXT DEFAULT 'processing',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users NOT NULL
);

-- Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own meetings"
ON public.meetings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meetings"
ON public.meetings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Action Items Tabelle
CREATE TABLE IF NOT EXISTS public.action_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    assignee TEXT,
    due_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view action items of their meetings"
ON public.action_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM meetings
        WHERE meetings.id = action_items.meeting_id
        AND meetings.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create action items for their meetings"
ON public.action_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM meetings
        WHERE meetings.id = action_items.meeting_id
        AND meetings.user_id = auth.uid()
    )
);
```

### 4. Anwendung starten
```bash
npm install
npm run dev
```

## Features
- Audio-Upload von Meetings
- Automatische Transkription mit OpenAI Whisper
- KI-gestützte Zusammenfassung mit GPT
- Extraktion von Action Items
- Echtzeit-Status-Updates

## Technischer Stack
- React + TypeScript
- Supabase für Backend und Authentifizierung
- OpenAI API für Transkription und Analyse
- TailwindCSS für Styling

## Fehlerbehandlung
- Wenn kein OpenAI API-Key konfiguriert ist, zeigt die Anwendung eine entsprechende Fehlermeldung
- Fehler bei der Verarbeitung werden im Meeting-Status angezeigt
- Überprüfen Sie die Edge Function Logs in Supabase für detaillierte Fehlerinformationen

