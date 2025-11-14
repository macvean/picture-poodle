import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { filterType } = body;

    // Create a playful prompt based on the selected filter
    const filterContext = {
      none: 'a fun and friendly postcard',
      mustache: 'a sophisticated and humorous postcard with a mustache theme',
      neon: 'a vibrant, electric, and colorful postcard',
      pixel: 'a retro, pixelated, and nostalgic postcard',
      flare: 'a vintage, nostalgic 1990s-style postcard',
    };

    const context = filterContext[filterType as keyof typeof filterContext] || filterContext.none;

    const prompt = `Generate a short, playful, and fun postcard message (maximum 60 characters) for ${context}. 
    The message should be:
    - Warm and friendly
    - Playful and lighthearted
    - Perfect for a postcard
    - Include emojis if appropriate (but keep it under 60 characters total)
    - Be creative and unique
    
    Return ONLY the message text, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative assistant that writes fun, playful postcard messages. Keep responses under 60 characters.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 50,
      temperature: 0.9,
    });

    const generatedMessage = completion.choices[0]?.message?.content?.trim() || 'Wish you were here! 🐾';

    // Ensure the message is within 60 characters
    const finalMessage = generatedMessage.length > 60 
      ? generatedMessage.substring(0, 57) + '...' 
      : generatedMessage;

    return NextResponse.json({ message: finalMessage });
  } catch (error) {
    console.error('Error generating message:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}

