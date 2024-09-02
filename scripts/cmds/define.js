const axios = require("axios");

module.exports = {
  config: {
    name: "define",
    version: "1.0",
    author: "XyryllPanget",
    role: 0,
    shortDescription: {
      en: "Define a word.",
    },
    longDescription: {
      en: "Use this command to get the definition of a word."
    },
    category: "Education",
  },

  onStart: async function ({ api, event, args }) {
    try {
      const word = args.join(" ").trim();

      if (!word) {
        api.sendMessage("Please provide a word to define.", event.threadID);
        return;
      }

      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`);
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const wordData = data[0];
        const wordDefinition = wordData.meanings[0]?.definitions[0]?.definition || "No definition found.";

        const definitionMessage = `Word: ${word}\nDefinition:\n${wordDefinition}`;
        api.sendMessage(definitionMessage, event.threadID);
      } else {
        api.sendMessage(`No definition found for the word "${word}".`, event.threadID);
      }
    } catch (error) {
      console.error("Error fetching word definition:", error);
      api.sendMessage("An error occurred while fetching the word definition. Please try again later.", event.threadID);
    }
  },
};
