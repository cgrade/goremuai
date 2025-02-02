# Goremu AI for Image and Video Processing

This allows users to upload images and generate videos based on text input. It utilizes various libraries and APIs to handle image processing, text-to-speech conversion, and video generation.

## Features

- Upload an image using the command `!imageUpload`.
- Provide text using the command `!text <your text>` to generate a video from the uploaded image.
- Convert text to speech using Google Text-to-Speech.
- Combine video and audio into a final output.

## Requirements

- Node.js
- Discord.js
- dotenv
- node-fetch
- fluent-ffmpeg
- gtts

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the required packages:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Discord bot token and API key:

   ```plaintext
   DISCORD_BOT_TOKEN=your_discord_bot_token
   API_KEY=your_api_key
   ```

4. Run the bot:
   ```bash
   node bot.js
   ```

## Commands

- `!imageUpload`: Upload an image. The bot will respond with a confirmation and prompt for text input.
- `!text <your text>`: Provide text to generate a video from the previously uploaded image.

## License

This project is licensed under the MIT License.
