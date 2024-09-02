const axios = require('axios');

// Helper function to check for inappropriate content
function containsInappropriateContent(result) {
  const bannedWords = ["porn", "xxx", "adult", "nsfw", "pinayflex", "lexilore", "Jhonny sins", "hongkong doll"]; // Add more words if needed
  const title = result.title.toLowerCase();
  const snippet = result.snippet.toLowerCase();

  for (const word of bannedWords) {
    if (title.includes(word) || snippet.includes(word)) {
      return true;
    }
  }
  return false;
}

// Map to store banned users
const bannedUsers = new Map();

module.exports = {
  config: {
    name: "google",
    aliases: ["search", "g"],
    version: "2.0",
    author: "XyryllPanget",
    role: 0,
    shortDescription: {
      en: "Searches Google for a given query."
    },
    longDescription: {
      en: "This command searches Google for a given query and returns the top 5 results."
    },
    category: "utility",
    guide: {
      en: "To use this command, type !google <query>."
    }
  },
  onStart: async function ({ api, event, args }) {
    const query = args.join(' ');
    if (!query) {
      api.sendMessage("Please provide a search query.", event.threadID);
      return;
    }

    // Check if user is banned
    if (bannedUsers.has(event.senderID)) {
      const timeRemaining = (bannedUsers.get(event.senderID) - Date.now()) / 1000;
      api.sendMessage(`You are banned from using this command. Time remaining: ${timeRemaining.toFixed(0)} seconds.`, event.threadID);
      return;
    }

    const cx = "7514b16a62add47ae"; // Replace with your Custom Search Engine ID
    const apiKey = "AIzaSyAqBaaYWktE14aDwDE8prVIbCH88zni12E"; // Replace with your API key
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

    try {
      const response = await axios.get(url);
      const searchResults = response.data.items.slice(0, 5);

      // Filter out inappropriate content
      const filteredResults = searchResults.filter(result => !containsInappropriateContent(result));

      if (filteredResults.length === 0) {
        // Notify admin about the triggered banned word
        const adminID = '100075778393362'; // Replace with the admin's user ID or Facebook ID
        const senderName = event.senderID === event.threadID ? '(Gc name)' : '(name)';
        const adminMessage = `The banned word "${query}" was triggered by ${senderName} (${event.senderID}) in thread ${event.threadID}.`;
        api.sendMessage(adminMessage, adminID);

        // Ban the user for 30 seconds
        bannedUsers.set(event.senderID, Date.now() + 30000);
        api.sendMessage("Sorry, that search query is not allowed.", event.threadID);
        return;
      }

      let message = `Top 5 results for '${query}':\n\n`;
      filteredResults.forEach((result, index) => {
        message += `${index + 1}. ${result.title}\n${result.link}\n${result.snippet}\n\n`;
      });
      api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while searching Google.", event.threadID);
    }
  }
};
