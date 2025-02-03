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
            response_format: 'verbose_json',
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


function processTranscription(transcription) {
    return transcription.segments.map((data) => {
        return { sentence: data.text.trim(),  duration: data.end - data.start };
    }
    ).filter(sentence => sentence.length > 0);
}

// Immediately invoked function expression (IIFE) to run the transcription process.
(async () => {
    // Transcribe the specified audio file using the API key from environment variables.
    const transcription = await transcribeAudio("audio/simple_en.mp3", process.env.OPENAI_API_KEY);
    if (transcription) {
        const processedData = processTranscription(transcription);
        console.log(processedData);
        console.log(transcription);
    }
})();