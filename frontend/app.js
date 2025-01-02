// Map playlist years to Spotify playlist IDs
const playlistIdMap = {
  24: "2bR0FolfI76QE8M8giBzhn",
  23: "6uivv9vtO5IsMGbpFeGTIp",
  22: "4bAroK32FCD00iLZzcsws5",
  21: "",
  20: "6sh76wCrD1y39NOLTDR7UE",
  19: "3SaBlrnyPuocFMkCxC619l",
  18: "5v3tjBrkJwoqYdsSePL4W3",
};

// Display links to all playlists
const playlistLinksDiv = document.getElementById("playlist-links");

const sortedKeys = Object.keys(playlistIdMap).sort((a, b) => b - a);

sortedKeys.forEach((year, index) => {
  const link = document.createElement("a");
  link.href = `/${year}`;
  link.textContent = year;

  playlistLinksDiv.appendChild(link);

  if (index < sortedKeys.length - 1) {
    const separator = document.createTextNode(" / ");
    playlistLinksDiv.appendChild(separator);
  }
});

// Extract the path from the URL
const year = window.location.pathname.split("/")[1];
console.log("full pathname", window.location.pathname.split("/"));

// If a year is accessed, fetch and display the playlist
if (year) {
  const playlistContent = document.getElementById("playlist-content");
  const playlistId = playlistIdMap[year];

  if (!playlistId) {
    playlistContent.innerHTML = `<p>DNF</p>`;
  } else {
    // Add a link to the playlist on Spotify
    const spotifyLink = document.createElement("p");
    spotifyLink.innerHTML = `[ <a href="https://open.spotify.com/playlist/${playlistId}" target="_blank">spotify</a> ]`;
    playlistContent.appendChild(spotifyLink);

    // Fetch and display playlist data
    fetch(`/api/playlist/${playlistId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching playlist: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const list = document.createElement("ul");
        data.tracks.items.slice(0, 25).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `${item.track.name} // ${item.track.artists
            .map((a) => a.name)
            .join(", ")}`;
          list.appendChild(li);
        });
        playlistContent.appendChild(list);
      })
      .catch((err) => {
        console.error("Error in app.js:", err);
        playlistContent.innerHTML = `<p>Error: ${err.message}</p>`;
      });
  }
}
