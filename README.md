# 🇮🇳 Telugu Language Enhancement AI

A specialized AI system that accepts Telugu audio input, transcribes it using OpenAI's Whisper API, and provides enhanced, grammatically correct Telugu responses in Roman script. The system acts as a Senior Telugu Language Professor dedicated to preserving and enhancing the beauty of the Telugu language.

## ✨ Features

- 🎤 **Real-time Audio Recording**: Record Telugu audio directly from your browser
- 🗣️ **Speech-to-Text**: Powered by OpenAI Whisper API for accurate Telugu transcription
- 📝 **Grammar Correction**: Automatic correction of Telugu grammatical errors
- ✨ **Text Enhancement**: Improve clarity, vocabulary, and eloquence
- 🔤 **Roman Transliteration**: Get phonetic English-alphabet output
- 🚫 **Language Restriction**: Politely declines non-Telugu input
- 💬 **Conversation History**: Track corrections and improvements
- ⚡ **Token Tracking**: Monitor API usage per message and session total
- 🎨 **Modern UI**: Beautiful gradient design with Telugu text support
- 🔒 **Secure**: Environment-based API key management

## 🏗️ Architecture

```
AI_Language_Enhancer/
├── backend/           # FastAPI server
│   ├── main.py       # API endpoints with Telugu professor system prompt
│   └── requirements.txt
├── frontend/          # React application
│   ├── src/
│   │   ├── App.jsx   # Main component with token tracking
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── .env              # Environment variables (OpenAI API key)
├── PRD.md            # Product Requirements Document
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   - The `.env` file in the root directory already contains your OpenAI API key
   - Make sure it's properly configured

5. **Run the backend server**:
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

## 📖 Usage

1. **Grant Microphone Permission**: When you first click the record button, your browser will ask for microphone access
2. **Record Telugu Audio**: Click the microphone button and speak in Telugu
3. **Stop Recording**: Click again to stop (timer shows elapsed time)
4. **Process**: Click "Process Audio" to transcribe and get enhanced Telugu response
5. **View Results**: See original transcription, enhanced Roman Telugu, and token usage
6. **Review History**: All conversations saved with timestamps and token details
7. **Learn**: Review corrections to improve your Telugu skills

### Example Workflow
- **You speak**: "నేను పుస్తకం చదువుతున్నాడు"
- **AI transcribes**: "నేను పుస్తకం చదువుతున్నాడు"
- **AI enhances**: "Nenu pustakam chadhuvutunnaanu"
- **AI explains** (optional): Grammar correction applied

## 🔌 API Endpoints

### `GET /`
Health check and API information

### `POST /transcribe`
Transcribe audio file to text
- **Input**: Audio file (webm, mp3, wav, m4a, etc.)
- **Output**: Transcribed text, language, duration

### `POST /chat`
Get AI-enhanced Telugu response for text input
- **Input**: JSON with Telugu message and optional conversation history
- **Output**: Enhanced Roman Telugu text with token usage

### `POST /process-audio`
Complete pipeline: transcribe Telugu audio + enhance text
- **Input**: Telugu audio file
- **Output**: Transcription + Enhanced Roman Telugu + Token usage

### `GET /health`
Check API health and configuration status

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **OpenAI API**: Whisper-1 for Telugu speech-to-text, GPT-4o-mini for language enhancement
- **Uvicorn**: ASGI server
- **Python-dotenv**: Environment variable management
- **Custom System Prompt**: Senior Telugu Professor persona with comprehensive instructions

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client
- **MediaRecorder API**: Browser audio recording

## 🎨 UI Features

- **Telugu-Focused Design**: Header and footer in Telugu and English
- **Gradient Design**: Blue-to-purple gradient theme
- **Responsive Layout**: Works on desktop and mobile
- **Real-time Feedback**: Recording timer, loading states, processing indicators
- **Token Display**: Per-message and session total token usage with lightning icon
- **Conversation History**: Scrollable history with timestamps and token details
- **Unicode Support**: Full Telugu script rendering
- **Error Handling**: Clear, user-friendly error messages
- **Accessibility**: Semantic HTML and ARIA labels

## 🔐 Security Notes

- API keys are stored in `.env` file (never commit this to git)
- CORS is configured for development (update for production)
- Audio files are temporarily stored and immediately deleted after processing

## 🚀 Production Deployment

### Backend
1. Update CORS origins in `main.py` to your frontend URL
2. Use a production ASGI server (Uvicorn with workers)
3. Set up proper environment variable management
4. Consider rate limiting and authentication

### Frontend
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Update API_BASE_URL in `App.jsx` to your backend URL
3. Deploy to Vercel, Netlify, or similar platform

## 🐛 Troubleshooting

### Microphone not working
- Check browser permissions
- Ensure you're using HTTPS (required for microphone access)
- Try a different browser

### API errors
- Verify OpenAI API key is valid
- Check API key has sufficient credits
- Ensure backend server is running

### CORS errors
- Make sure backend is running on port 8000
- Check CORS configuration in `main.py`

## 📚 Documentation

For comprehensive product information, see:
- **[PRD.md](./PRD.md)**: Complete Product Requirements Document with architecture, features, and specifications

## 🎯 System Behavior

### Telugu Input
- Analyzes grammar, clarity, and vocabulary
- Provides enhanced Roman Telugu output
- Optionally explains significant corrections
- Maintains original meaning and tone

### Non-Telugu Input
- Politely declines in Telugu
- Response: "Kshaminchhandi, nenu Telugu tappa itara bhashalalo manchiga maatlaadalenu. Dayachesi Telugulo maatlaadandi."
- Does not process non-Telugu content

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ for the Telugu language using OpenAI, React, and FastAPI**

**తెలుగు భాష మెరుగుదల కోసం ప్రేమతో రూపొందించబడింది**
