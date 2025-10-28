# ✍️ Acharya AI - Telugu Language Enhancement

**Acharya** (ఆచార్య - meaning "Teacher" in Telugu) is a precise, professional, and respectful virtual Telugu language expert. This AI system accepts Telugu audio input, transcribes it using OpenAI's Whisper API, and provides enhanced, grammatically correct Telugu text while strictly preserving the original meaning and tone.

## ✨ Features

- 🎤 **Real-time Audio Recording**: Record Telugu audio directly from your browser
- 🗣️ **Speech-to-Text**: Powered by OpenAI Whisper (gpt-4o-transcribe) for accurate Telugu transcription
- 📝 **Grammar & Spelling Correction**: Fixes all grammatical errors, spelling mistakes, and punctuation
- ✨ **Text Enhancement**: Improves sentence structure, vocabulary, and clarity
- 🎯 **Meaning Preservation**: Strictly maintains original intent and tone - never alters meaning
- 🚫 **Telugu-Only Processing**: Politely declines non-Telugu script input in Telugu
- 💬 **Conversation History**: Track all corrections and improvements with timestamps
- ⚡ **Token Tracking**: Monitor API usage per message and session total
- 🎨 **Modern UI**: Beautiful gradient design with pen logo and Telugu text support
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

**Input (with grammar error)**:
- **You speak**: "ఆమె రేపు ఆఫీస్ కి వెళ్తాడు" (incorrect verb conjugation)

**Output (corrected)**:
- **AI transcribes**: "ఆమె రేపు ఆఫీస్ కి వెళ్తాడు"
- **AI enhances**: "ఆమె రేపు ఆఫీస్ కి వెళ్తుంది" (corrected: వెళ్తాడు → వెళ్తుంది)
- **Note**: Only corrected text is returned, no explanations unless explicitly requested

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
- **Output**: Corrected Telugu text (in Telugu script) with token usage
- **Behavior**: Returns only the corrected text, no explanations

### `POST /process-audio`
Complete pipeline: transcribe Telugu audio + enhance text
- **Input**: Telugu audio file
- **Output**: Original transcription + Enhanced Telugu text + Token usage

### `GET /health`
Check API health and configuration status

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **OpenAI API**: 
  - **gpt-4o-transcribe**: Advanced Telugu speech-to-text transcription
  - **gpt-4o-mini**: Language enhancement and grammar correction
- **Uvicorn**: ASGI server
- **Python-dotenv**: Environment variable management
- **Acharya System Prompt**: Precise, professional Telugu language expert with strict rules

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

## 🎯 Acharya AI System Behavior

### Core Function
Acharya receives text in Telugu script and returns a polished, correct version with:
- ✅ Grammar corrections (verb conjugations, case endings, etc.)
- ✅ Spelling fixes
- ✅ Improved sentence structure (clarity and flow)
- ✅ Enhanced vocabulary (precise, appropriate word choices)
- ✅ Punctuation corrections

### Core Rules

1. **Output Format**: Response is ONLY the final, corrected text in Telugu script
2. **Meaning Preservation**: NEVER alters the user's original intent or meaning
3. **No Explanations**: Does not explain corrections unless explicitly asked
4. **Telugu-Only**: If input is NOT in Telugu script (e.g., English, Hindi, etc.), responds with:
   > "క్షమించండి, నేను కేవలం తెలుగు లిపిలో రాసిన వాక్యాలను మాత్రమే సరిదిద్దగలను. దయచేసి మీ అభ్యర్థనను తెలుగులో అందించండి."

### Examples

**Example 1 - Grammar Error**:
- Input: `ఆమె రేపు ఆఫీస్ కి వెళ్తాడు.`
- Output: `ఆమె రేపు ఆఫీస్ కి వెళ్తుంది.`

**Example 2 - Word Order/Clarity**:
- Input: `నేను చూసాను ఆ సినిమా నిన్న చాలా బాగుంది.`
- Output: `నేను నిన్న చూసిన ఆ సినిమా చాలా బాగుంది.`

**Example 3 - Vocabulary Enhancement**:
- Input: `మీరు దయచేసి నాకు కొంచెం హెల్ప్ చేస్తారా?`
- Output: `మీరు దయచేసి నాకు కొంచెం సహాయం చేస్తారా?`

**Example 4 - Non-Telugu Input**:
- Input: `Hello, how are you?`
- Output: `క్షమించండి, నేను కేవలం తెలుగు లిపిలో రాసిన వాక్యాలను మాత్రమే సరిదిద్దగలను. దయచేసి మీ అభ్యర్థనను తెలుగులో అందించండి.`

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ for the Telugu language community**

**Acharya AI - Your Telugu Language Expert**

**ఆచార్య AI - తెలుగు భాష మెరుగుదల సహాయకి**
