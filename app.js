const openai = require('openai');
const fs = require('node:fs');
const dotenv = require('dotenv');

dotenv.config();

async function transcribeAudio(filename, apiKey) {
    try {
        // Initialize the OpenAI client with the given API key.
        const openAiClient = new openai.OpenAI({
            apiKey,
        });

        // Send the audio file for transcription using the specified model.
        const transcription = await openAiClient.audio.transcriptions.create({
            file: fs.createReadStream(filename),
            model: 'whisper-1',
        });
        console.info(transcription);
        // Return the transcription result.
        return transcription;
    } catch (error) {
        // Log any errors that occur during transcription.
        console.error(error.cause);
        console.error('Error', error);
    }
}

// Immediately invoked function expression (IIFE) to run the transcription process.
(async () => {
    // Transcribe the specified audio file using the API key from environment variables.
    const data = await transcribeAudio("testing.m4a", process.env.OPENAI_API_KEY);
    // Log the transcription result.
    console.log(data);
})();