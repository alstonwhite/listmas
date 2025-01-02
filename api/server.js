const express = require("express");
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = 3000;

// Environment variables
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

// Serve static files (frontend)
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));

// Get Spotify access token
async function getAccessToken() {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

// Fetch playlist data by ID
async function getPlaylistTracks(accessToken, playlistId) {
  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}

// API endpoint to fetch playlist by ID
app.get("/api/playlist/:id", async (req, res) => {
  const playlistId = req.params.id;

  try {
    const accessToken = await getAccessToken();
    const playlistData = await getPlaylistTracks(accessToken, playlistId);
    res.json(playlistData);
  } catch (error) {
    console.error("Error fetching playlist:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Fallback route for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
