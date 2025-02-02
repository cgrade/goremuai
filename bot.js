import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch'; // Use import instead of require
import fs from 'fs';
import gtts from 'gtts';
import ffmpeg from 'fluent-ffmpeg';
let imageUrl = ''; // Variable to store the uploaded image URL

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Command to handle image upload
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore messages from other bots

    if (message.content.startsWith('!imageUpload')) {
        if (message.attachments.size > 0) {
            imageUrl = message.attachments.first().url; // Store the image URL
            message.reply(`Image received: ${imageUrl}. Now, please provide text using !text <your text>.`);
        } else {
            message.reply('Please attach an image with the command.');
        }
    }

    // Command to handle text input
    if (message.content.startsWith('!text')) {
        const text = message.content.slice('!text'.length).trim();
        if (text && imageUrl) {
            message.reply(`Text received: ${text}. Now generating video...`);
            // Call your video generation function here
            await generateVideoFromImage(imageUrl, 'output_video.mp4'); // Use the stored imageUrl
            message.reply('Video generated successfully!'); // Notify user after generation
            imageUrl = ''; // Reset imageUrl after processing
        } else {
            message.reply('Please provide text with the command after uploading an image.');
        }
    }
});

// Function to download image
async function downloadImage(url, savePath) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer(); // Use arrayBuffer instead of buffer
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(savePath, buffer);
}

// Generate video from image
async function generateVideoFromImage(imagePath, outputVideoPath) {
    const api_key = process.env.API_KEY; // Use the API key from the .env file
    const url = "https://api.segmind.com/v1/face-to-sticker";

    // Prepare the request payload
    const data = {
        image_path: imagePath, // Assuming the API requires the image path
    };

    // Make the API request
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': api_key,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to generate video from image: ' + response.statusText);
    }

    const result = await response.json();
    // Process the result to generate the video
    console.log(result);
    // Save or use the result as needed
}

// Convert Text to speech
function textToSpeech(text, outputAudioPath) {
    const tts = new gtts(text, 'en');
    tts.save(outputAudioPath, (err) => {
        if (err) throw err;
    });
}

// Combining video and audio
function combineVideoAudio(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .input(audioPath)
            .outputOptions('-c:v copy')
            .outputOptions('-c:a aac')
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}