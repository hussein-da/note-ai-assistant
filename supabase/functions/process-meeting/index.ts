
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

    // 1. Audio-Datei von Supabase Storage herunterladen
    const response = await fetch(audioUrl)
    const audioBlob = await response.blob()

    // 2. Audio mit Whisper transkribieren
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.mp3')
    formData.append('model', 'whisper-1')

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    if (!whisperResponse.ok) {
      throw new Error(`Whisper API error: ${await whisperResponse.text()}`)
    }

    const { text: transcript } = await whisperResponse.json()

    // 3. GPT für die Zusammenfassung verwenden
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein Assistent, der Meetings zusammenfasst. Erstelle eine kurze, prägnante Zusammenfassung der wichtigsten Punkte.'
          },
          {
            role: 'user',
            content: transcript
          }
        ],
      }),
    })

    if (!summaryResponse.ok) {
      throw new Error(`GPT API error: ${await summaryResponse.text()}`)
    }

    const { choices } = await summaryResponse.json()
    const summary = choices[0].message.content

    // 4. Meeting in der Datenbank aktualisieren
    const { error: updateError } = await fetch(
      `https://afthfaddlxvqdvrhnaiu.supabase.co/rest/v1/meetings?id=eq.${meetingId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: 'completed',
          transcript,
          summary,
        }),
      }
    )

    if (updateError) {
      throw updateError
    }

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
