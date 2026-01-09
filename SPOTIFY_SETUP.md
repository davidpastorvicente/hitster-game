# Spotify API Setup Guide

## Getting Your Spotify API Credentials

1. **Go to Spotify Developer Dashboard**
   - Visit: https://developer.spotify.com/dashboard/applications
   - Log in with your Spotify account (create one if needed - it's free!)

2. **Create an App**
   - Click "Create app"
   - Fill in the form:
     - App name: "Hitster Game" (or any name you like)
     - App description: "Music guessing game"
     - Redirect URI: `http://localhost:5173` (not needed for this app but required)
     - Check "Web API"
   - Accept terms and click "Save"

3. **Get Your Credentials**
   - You'll see your app dashboard
   - Copy the **Client ID**
   - Click "Show client secret" and copy the **Client Secret**

4. **Add to Your Project**
   - Create a file named `.env` in the root directory
   - Add your credentials:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

5. **Restart the dev server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## Notes
- The `.env` file is already in `.gitignore` so your credentials won't be committed
- The Spotify free tier is sufficient for this app
- 30-second preview clips are automatically provided by Spotify
