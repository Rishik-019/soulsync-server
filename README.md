# soulsync-server

soulsync-server is a Node.js-based backend designed to provide empathetic AI-driven chat and voice synthesis services. This server acts as a bridge between your application and powerful AI APIs, including Groq for chat and ElevenLabs for text-to-speech.

## Features

- **Empathetic Chatbot**: Leveraging the Llama 3.1 model via Groq, the `/chat` endpoint provides an AI therapist named SoulSync.
- **Text-to-Speech**: The `/speak` endpoint uses ElevenLabs to convert text into natural-sounding speech.
- **Easy to Deploy**: With a straightforward setup, you can get the server running in minutes.

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/soulsync-server.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root of your project and add the following:
   ```env
   GROQ_API_KEY=your_groq_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## API Documentation

### `/chat`

- **Method**: `POST`
- **Description**: This endpoint receives a user's message and returns an empathetic response from the AI therapist, SoulSync.
- **Request Body**:
  ```json
  {
    "message": "Hello"
  }
  ```
- **Response**:
  ```json
  {
    "reply": "I’m here with you."
  }
  ```

### `/speak`

- **Method**: `POST`
- **Description**: This endpoint converts text into an audio file.
- **Request Body**:
  ```json
  {
    "text": "Hello from SoulSync"
  }
  ```
- **Response**:
  - A successful response will return an `audio/mpeg` file.
  - An unsuccessful response will return a status code of `400` or `500`.
