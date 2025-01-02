const axios = require("axios");

exports.handler = async (event) => {
  const playlistId = event.path.split("/").pop(); // Extract playlist ID from the path

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing environment variables" }),
    };
  }

  try {
    // Get Spotify access token
    const tokenResponse = await axios.post(
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

    const accessToken = tokenResponse.data.access_token;

    // Fetch playlist data
    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(playlistResponse.data),
    };
  } catch (error) {
    console.error("Error fetching playlist:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
