module.exports = {
	config: {
		name: "ai",
		version: "1.0.0",
		author: "Developer",
		role: 0,
		description: {
			vi: "An AI command powered by GPT-4",
			en: "An AI command powered by GPT-4"
		},
		countDown: 3,
		hasPrefix: false,
		category: "ai",
		guide: {
			vi: "Ai [promot]",
			en: "Ai [promot]"
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
		const input = args.join(" ");
		if (!input) {
			api.sendMessage(
				`Please provide a question or statement after 'ai'. For example: 'ai What is the capital of France?'`,
				event.threadID,
				event.messageID
			);
			return;
		}
		api.sendMessage(`Pls Wait...🔍 "${input}"`, event.threadID, event.messageID);
		try {
			const { data } = await axios.get(
				`https://soyeon-gpt4.onrender.com/api?prompt=${encodeURIComponent(input)}`
			);
			const response = data.response;
			api.sendMessage(response, event.threadID, event.messageID);
		} catch (error) {
			api.sendMessage(
				"An error occurred while processing your request.",
				event.threadID,
				event.messageID
			);
		}
	},
};
