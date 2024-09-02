module.exports = {
	config: {
		name: "deku",
		version: "1.0.0",
		author: "Neth", // Cmd created, API by Joshua Sy
		role: 0,
		description: {
			vi: "To chat deku AI",
			en: "To chat deku AI"
		},
		countDown: 2,
		hasPrefix: true,
		category: "deku",
		guide: {
			vi: "deku [prompt]",
			en: "deku [prompt]"
		}
	},
	langs: {
		vi: {
			$12: "// Your Vietnamese translation here"
		},
		en: {
			$13: "// Your English translation here"
		}
	},
	onStart: async function ({ api, event, args }) {
		const axios = require("axios");
		try {
			const prompt = encodeURIComponent(args.join(" "));
			if (!prompt) return api.sendMessage("🤖 Please enter a prompt!!!", event.threadID, event.messageID);
			api.sendMessage("🤖 Deku AI is processing your question...", event.threadID, event.messageID);
			const apiUrl = "https://deku-rest-api.replit.app/deku?prompt=";
			const response = await axios.get(apiUrl + prompt);
			const responseData = response.data.data;
			return api.sendMessage(`🤖: ${responseData}\n\n\nThis bot was created on PROJECT BOTIFY by Neth.`, event.threadID, event.messageID);
		} catch (error) {
			console.error(error);
			return api.sendMessage(error.message, event.threadID, event.messageID);
		}
	},
};
