import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Ensure the image is a properly formatted data URL
    let imageUrl = image;
    if (typeof image === 'string') {
      // Check if it's already a data URL
      if (!image.startsWith('data:image')) {
        return NextResponse.json(
          { error: "Invalid image format. Expected a base64 data URL." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid image format. Expected a base64 data URL." },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini which supports vision
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please generate a concise, engaging caption for this image suitable for social media. Add relevant hashtags.",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const caption = response.choices[0]?.message?.content?.trim() || "Could not generate caption."

    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error("Error generating caption:", error);
    
    // More specific error reporting
    let errorMessage = "Failed to generate caption";
    if (error.status === 401) {
      errorMessage = "Invalid OpenAI API key. Please check your configuration.";
    } else if (error.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}
