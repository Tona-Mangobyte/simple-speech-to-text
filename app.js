const openai = require('openai');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

async function transcribeAudio(filename, apiKey, retries = 3, delay = 1000) {
    try {
        // Initialize the OpenAI client with the given API key.
        const openAiClient = new openai.OpenAI({
            apiKey,
            timeout: 900 * 1000, // timeout seconds * ms - API key from environment variables.
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
        if (retries > 0 && error.cause?.code === "ECONNRESET") {
            console.log(`Retrying... (${3 - retries + 1})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return transcribeAudio(filename, apiKey, retries - 1, delay * 2);
        } else {
            console.error(error.cause);
            console.error('Error', error);
        }
        // Log any errors that occur during transcription.
        // console.error('Error', error);
    }
}

// Immediately invoked function expression (IIFE) to run the transcription process.
(async () => {
    // Transcribe the specified audio file using the API key from environment variables.
    const data = await transcribeAudio("simple.mp3", process.env.OPENAI_API_KEY);
    // Log the transcription result.
    console.log(data);
})();