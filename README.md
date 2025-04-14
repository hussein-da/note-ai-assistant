# Meeting Transcription App

This AI-powered application transcribes and analyzes meetings using advanced language models.

## Project Information

**Author:** Hussein Daoud  
**GitHub:** [hussein-da](https://github.com/hussein-da)

> This project is a hobby/personal project and is not intended for commercial use. However, I'm open to collaboration and discussions about scaling and deployment opportunities. Feel free to contact me through GitHub for any inquiries!

## Setup for Developers

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Set up Supabase Project
1. Create a new [Supabase Project](https://supabase.com)
2. Go to Project Settings > Functions
3. Add OpenAI API Key as a secret:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API Key from [OpenAI API Keys](https://platform.openai.com/api-keys)

### 3. Database Migration
Execute the following SQL commands in the Supabase SQL Editor:

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

### 4. Start Application
```bash
npm install
npm run dev
```

## Features
- Meeting audio upload
- Automatic transcription using OpenAI Whisper
- AI-powered summarization with GPT
- Action item extraction
- Real-time status updates

## Tech Stack
- React + TypeScript
- Supabase for backend and authentication
- OpenAI API for transcription and analysis
- TailwindCSS for styling

## Error Handling
- Application displays appropriate error message if no OpenAI API key is configured
- Processing errors are shown in meeting status
- Check Edge Function logs in Supabase for detailed error information
