
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Process meeting function started");
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { meetingId, audioUrl } = body;

    if (!meetingId || !audioUrl) {
      console.error("Missing required parameters:", { meetingId, audioUrl });
      throw new Error('Meeting ID and audio URL are required')
    }

    console.log(`Processing meeting: ${meetingId} with audio: ${audioUrl}`);

    // Check if OpenAI API key is configured
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      // Update meeting status to failed if no API key is available
      console.error("OpenAI API key not configured");
      await updateMeetingStatus(meetingId, 'failed', 'OpenAI API key not configured')
      throw new Error('OpenAI API key not configured')
    }

    // 1. Download audio file from Supabase Storage
    console.log("Downloading audio file");
    const response = await fetch(audioUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to download audio file: ${response.status} ${errorText}`);
      await updateMeetingStatus(meetingId, 'failed', `Failed to download audio file: ${response.status}`);
      throw new Error('Failed to download audio file')
    }
    const audioBlob = await response.blob();
    console.log(`Audio file downloaded: ${audioBlob.size} bytes`);

    // 2. Transcribe audio with Whisper
    console.log("Transcribing audio with Whisper API");
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.mp3')
    formData.append('model', 'whisper-1')

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: formData,
    })

    if (!whisperResponse.ok) {
      const error = await whisperResponse.text()
      console.error(`Whisper API error: ${error}`);
      await updateMeetingStatus(meetingId, 'failed', `Transcription failed: ${error}`)
      throw new Error(`Whisper API error: ${error}`)
    }

    const whisperData = await whisperResponse.json();
    const transcript = whisperData.text;
    console.log("Transcription successful, length:", transcript.length);

    // 3. Generate summary with GPT
    console.log("Generating summary with GPT");
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that summarizes meetings. Create a clear, structured summary of the key points. Always provide the summary in English, regardless of the input language.'
          },
          {
            role: 'user',
            content: transcript
          }
        ],
      }),
    })

    if (!summaryResponse.ok) {
      const error = await summaryResponse.text()
      console.error(`GPT API error: ${error}`);
      await updateMeetingStatus(meetingId, 'failed', `Summarization failed: ${error}`)
      throw new Error(`GPT API error: ${error}`)
    }

    const { choices } = await summaryResponse.json()
    const summary = choices[0].message.content
    console.log("Summary generated successfully, length:", summary.length);

    // 4. Update meeting in database
    console.log("Updating meeting status to completed");
    await updateMeetingStatus(meetingId, 'completed', null, transcript, summary)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing meeting:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Helper function to update meeting status
async function updateMeetingStatus(
  meetingId: string, 
  status: 'completed' | 'failed', 
  error?: string | null,
  transcript?: string,
  summary?: string
) {
  console.log(`Updating meeting ${meetingId} status to ${status}`);
  
  const updateData: any = {
    status,
    ...(error && { error_message: error }),
    ...(transcript && { transcript }),
    ...(summary && { summary }),
  }

  try {
    const response = await fetch(
      `https://afthfaddlxvqdvrhnaiu.supabase.co/rest/v1/meetings?id=eq.${meetingId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(updateData),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update meeting status: ${response.status} ${errorText}`);
    } else {
      console.log(`Meeting ${meetingId} status updated successfully`);
    }
  } catch (updateError) {
    console.error(`Error updating meeting status:`, updateError);
  }
}
