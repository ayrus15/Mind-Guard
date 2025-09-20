# Groq AI Integration for MindGuard AI

## Overview

MindGuard AI uses **Groq's lightning-fast inference** to provide advanced mental health support through real-time conversations. The Groq API integration is fully implemented and provides superior response quality and speed compared to traditional AI APIs.

## Current Implementation Status

✅ **FULLY IMPLEMENTED** - The Groq API is already integrated and working in the chatbot.

### What's Already Working

1. **Groq AI Service** (`/backend/src/utils/groq-ai-service.ts`)
   - Complete implementation with advanced mental health prompting
   - Risk assessment and crisis intervention
   - Multiple therapeutic approaches (CBT, DBT, ACT, trauma-informed care)
   - Adaptive personality modes
   - Conversation history context
   - Fallback mechanism if API fails

2. **Chat Controller Integration** (`/backend/src/controllers/chatController.ts`)
   - Groq service is used via `generateGroqResponse` function
   - Sentiment analysis integration
   - Conversation history support

3. **Comprehensive Testing** (`/backend/src/__tests__/groq-ai-service.test.ts`)
   - Full test coverage for all Groq service functionality
   - Risk assessment testing
   - Response generation testing
   - Error handling testing

## Configuration

### 1. Environment Setup

Copy the example environment file and configure your Groq API key:

```bash
cd backend
cp .env.example .env
```

### 2. Groq API Key

Add your Groq API key to the `.env` file:

```env
# Groq AI Configuration
GROQ_API_KEY=your-actual-groq-api-key-here
```

**How to get a Groq API key:**
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### 3. Verification

The system will automatically validate your configuration on startup:

- ✅ **API key configured**: "Groq AI service initialized successfully"
- ⚠️ **Missing API key**: "Groq API key not properly configured. Fallback responses will be used."

## How It Works

### 1. Message Flow

```
User Message → Sentiment Analysis → Groq AI Service → Advanced Response
                     ↓                    ↓
           Conversation History    Risk Assessment
                     ↓                    ↓
              Context Building    Crisis Intervention
```

### 2. Features

#### **Risk Assessment**
- **High Risk**: Suicidal ideation, immediate self-harm
- **Medium Risk**: Hopelessness, self-harm thoughts
- **Low Risk**: General mental health concerns

#### **Adaptive Personalities**
- **Empathetic Mode**: For emotional support
- **Practical Mode**: For problem-solving
- **Mindful Mode**: For anxiety/stress
- **Wise Mode**: For life transitions

#### **Crisis Intervention**
- Automatic detection of crisis indicators
- Immediate crisis resource provision
- Safety assessment and professional help guidance

### 3. Model Configuration

Currently using:
- **Model**: `llama3-8b-8192`
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 1000
- **Top P**: 0.9

## Testing the Integration

### 1. Run Tests

```bash
cd backend
npm test -- --testPathPattern=groq-ai-service.test.ts
```

### 2. Manual Testing

Start the backend server:

```bash
cd backend
npm run dev
```

The server will show:
- ✅ "Groq AI service initialized successfully" (if API key is configured)
- ⚠️ Warning messages if API key is missing

### 3. Example Conversations

Try these test messages through the chat interface:

**Low Risk:**
```
"I had a difficult day at work"
```

**Medium Risk:**
```
"I feel hopeless and worthless"
```

**High Risk:**
```
"I want to end it all tonight"
```

## Fallback Mechanism

If the Groq API is unavailable:
1. **Automatic Fallback**: Uses built-in mental health responses
2. **Crisis Detection**: Still works for safety
3. **No Service Interruption**: Chat continues to function
4. **Error Logging**: Detailed error information for debugging

## Performance

Groq provides:
- **Ultra-fast inference**: ~100-500ms response times
- **High throughput**: Handles multiple concurrent users
- **Reliable uptime**: Enterprise-grade service

## Troubleshooting

### Common Issues

1. **"Groq API key not properly configured"**
   - Ensure `GROQ_API_KEY` is set in `.env`
   - Verify the key is not the placeholder value

2. **"401 Authentication Error"**
   - Check if your API key is valid
   - Verify you have credits/usage remaining

3. **"Rate Limit Error"**
   - Your API usage has exceeded limits
   - Wait for rate limit reset or upgrade your plan

4. **"Network Error"**
   - Check internet connection
   - Verify Groq API status

### Debug Mode

Set `DEBUG=true` in your `.env` file for detailed logging:

```env
DEBUG=true
LOG_LEVEL=debug
```

## Advanced Configuration

### Custom Prompting

The system prompt can be customized in `/backend/src/utils/groq-ai-service.ts`:

```typescript
const MINDGUARD_GROQ_PROMPT = `Your custom prompt here...`;
```

### Model Selection

You can change the model in the `generateResponse` method:

```typescript
model: 'llama3-70b-8192', // For higher quality responses
// or
model: 'mixtral-8x7b-32768', // For longer context
```

## Next Steps

The Groq integration is complete and production-ready. To enhance it further, consider:

1. **Fine-tuning**: Custom model training for mental health
2. **Streaming**: Real-time response streaming
3. **Multi-modal**: Image and voice integration
4. **Analytics**: Response quality metrics

## Support

For Groq API issues:
- [Groq Documentation](https://console.groq.com/docs)
- [Groq Discord Community](https://discord.gg/groq)

For MindGuard AI issues:
- Check the test suite: `npm test`
- Review error logs in the console
- Verify environment configuration