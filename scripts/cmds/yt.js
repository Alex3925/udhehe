const axios = require('axios');

// Helper function to check for inappropriate content
function containsInappropriateContent(video) {
  const bannedWords = ["porn", "xxx", "adult", "nsfw","lexi","sins"]; // Add more words if needed
  const title = video.snippet.title.toLowerCase();
  const description = video.snippet.description.toLowerCase();

  for (const word of bannedWords) {
    if (title.includes(word) || description.includes(word)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  config: {
    name: "youtube",
    aliases: ["yt"],
    version: "1.0",
    author: "XyryllPanget",
    role: 0,
    shortDescription: {
      en: "Searches YouTube for videos.",
    },
    longDescription: {
      en: "This command searches YouTube for videos based on the given query and returns the top 5 results.",
    },
    category: "Utility",
    guide: {
      en: "To use this command, type !youtube <query>.",
    },
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) {
      api.sendMessage("Please provide a search query.", event.threadID);
      return;
    }

    const apiKey = "AIzaSyB_RSF0xylQkMxOqglhfIkAqYt7mTSxrLE"; // Replace with your YouTube API key
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(url);
      const searchResults = response.data.items;

      // Filter out inappropriate content
      const filteredResults = searchResults.filter(video => !containsInappropriateContent(video));

      if (filteredResults.length === 0) {
        api.sendMessage("Sorry, that search query is not allowed.", event.threadID);
        return;
      }

      let message = "";
      filteredResults.forEach((result, index) => {
        const title = result.snippet.title;
        const description = result.snippet.description;
        const videoId = result.id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        message += `Search Result ${index + 1}:\nTitle: ${title}\nDescription: ${description}\nLink: ${videoUrl}\n\n`;
      });
      api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while searching YouTube.", event.threadID);
    }
  },
};
