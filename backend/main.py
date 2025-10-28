from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import openai
from openai import OpenAI
import os
from dotenv import load_dotenv
import tempfile
from pathlib import Path
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="AI Audio Chatbot API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Supported audio formats
SUPPORTED_FORMATS = {
    "audio/webm", "audio/mp4", "audio/mpeg", "audio/mpga", 
    "audio/m4a", "audio/wav", "audio/mp3"
}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Audio Chatbot API",
        "version": "1.0.0",
        "endpoints": {
            "/transcribe": "POST - Transcribe audio to text",
            "/chat": "POST - Get AI response from transcribed text",
            "/process-audio": "POST - Complete pipeline: transcribe + chat response"
        }
    }


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file to text using OpenAI gpt-4o-mini-transcribe API
    """
    try:
        # Validate file type
        if file.content_type not in SUPPORTED_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported audio format. Supported formats: {', '.join(SUPPORTED_FORMATS)}"
            )
        
        # Read the uploaded file
        audio_data = await file.read()
        
        if len(audio_data) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")
        
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as temp_audio:
            temp_audio.write(audio_data)
            temp_audio_path = temp_audio.name
        
        try:
            # Transcribe using OpenAI gpt-4o-mini-transcribe
            with open(temp_audio_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="gpt-4o-transcribe",
                    file=audio_file,
                    response_format="json",
                    prompt="Transcribe the audio to text in Telugu."
                )
            
            logger.info(f"Transcription successful: {transcript.text[:50]}...")
            
            return {
                "success": True,
                "transcription": transcript.text,
                "language": transcript.language if hasattr(transcript, 'language') else None,
                "duration": transcript.duration if hasattr(transcript, 'duration') else None
            }
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_audio_path):
                os.unlink(temp_audio_path)
    
    except openai.APIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")


@app.post("/chat")
async def chat_with_ai(data: dict):
    """
    Get AI response for the given text using OpenAI GPT
    """
    try:
        user_message = data.get("message", "").strip()
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Get conversation history if provided
        conversation_history = data.get("history", [])
        
        # Build messages for the chat
        messages = [
            {"role": "system", "content":"""

You are "Acharya," a precise, professional, and respectful virtual Telugu language expert.

Primary Function:
Receive text in the Telugu script and return a polished, correct version. Your refinement must fix all errors (grammar, spelling, awkward sentence structure, vocabulary) and improve clarity, while strictly preserving the original meaning and tone.

Core Rules:
1.  Output: Your response MUST be *only* the final, corrected text in the Telugu script.
2.  Meaning Preservation: You must *never* alter the user's original intent.
3.  No Explanations: Do not explain the corrections unless the user explicitly asks.
4.  Input Handling: If the input is *not* in the Telugu script (e.g., English, Hindi or any other language), respond *only* with this exact message:
     "క్షమించండి, నేను కేవలం తెలుగు లిపిలో రాసిన వాక్యాలను మాత్రమే సరిదిద్దగలను. దయచేసి మీ అభ్యర్థనను తెలుగులో అందించండి."
""" } ]
        
        
        # Add conversation history
        messages.extend(conversation_history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Get response from OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        ai_response = response.choices[0].message.content
        
        # Extract token usage information
        token_usage = {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens,
            "total_tokens": response.usage.total_tokens
        }
        
        logger.info(f"Chat response generated for message: {user_message[:50]}... | Tokens: {token_usage['total_tokens']}")
        
        return {
            "success": True,
            "response": ai_response,
            "user_message": user_message,
            "token_usage": token_usage
        }
    
    except openai.APIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@app.post("/process-audio")
async def process_audio_complete(file: UploadFile = File(...)):
    """
    Complete pipeline: Transcribe audio and get AI response
    """
    try:
        # Step 1: Transcribe audio
        transcription_result = await transcribe_audio(file)
        
        if not transcription_result["success"]:
            return transcription_result
        
        transcribed_text = transcription_result["transcription"]
        
        # Step 2: Get AI response
        chat_result = await chat_with_ai({"message": transcribed_text})
        
        return {
            "success": True,
            "transcription": transcribed_text,
            "language": transcription_result.get("language"),
            "duration": transcription_result.get("duration"),
            "ai_response": chat_result["response"],
            "token_usage": chat_result.get("token_usage")
        }
    
    except Exception as e:
        logger.error(f"Process audio error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    api_key_set = bool(os.getenv("OPENAI_API_KEY"))
    return {
        "status": "healthy",
        "openai_api_key_configured": api_key_set
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
