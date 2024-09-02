const axios = require('axios');

module.exports = {
  config: {
    name: "wikipedia",
    aliases: ["wiki"],
    description: "Fetches the summary of a topic from Wikipedia.",
    category: "Utility",
    usage: "wikipedia <topic>",
  },
  onStart: async function ({ api, event, args }) {
    const topic = args.join(' ');
    if (!topic) {
      api.sendMessage("Please provide a topic to search on Wikipedia.", event.threadID);
      return;
    }

    try {
      const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
      const { title, extract, content_urls } = response.data;
      if (extract) {
        let message = `Wikipedia Summary for '${title}':\n\n${extract}\n\nRead more: ${content_urls.desktop.page}`;
        api.sendMessage(message, event.threadID);
      } else {
        api.sendMessage(`No Wikipedia summary found for '${topic}'.`, event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the Wikipedia summary.", event.threadID);
    }
  },
};
