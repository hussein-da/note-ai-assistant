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
    const { meetingId, audioUrl } = await req.json()

    if (!meetingId || !audioUrl) {
      throw new Error('Meeting ID and audio URL are required')
    }

    // Check if OpenAI API key is configured
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      // Update meeting status to failed if no API key is available
      await updateMeetingStatus(meetingId, 'failed', 'OpenAI API key not configured')
      throw new Error('OpenAI API key not configured')
    }

    // 1. Download audio file from Supabase Storage
    const response = await fetch(audioUrl)
    if (!response.ok) {
      throw new Error('Failed to download audio file')
    }
    const audioBlob = await response.blob()

    // 2. Transcribe audio with Whisper
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
      await updateMeetingStatus(meetingId, 'failed', `Transcription failed: ${error}`)
      throw new Error(`Whisper API error: ${error}`)
    }

    const { text: transcript } = await whisperResponse.json()

    // 3. Generate summary with GPT
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
      await updateMeetingStatus(meetingId, 'failed', `Summarization failed: ${error}`)
      throw new Error(`GPT API error: ${error}`)
    }

    const { choices } = await summaryResponse.json()
    const summary = choices[0].message.content

    // 4. Update meeting in database
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
  const updateData: any = {
    status,
    ...(error && { error_message: error }),
    ...(transcript && { transcript }),
    ...(summary && { summary }),
  }

  await fetch(
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
  )
}
