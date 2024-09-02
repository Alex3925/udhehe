module.exports = {
	config: {
		name: "teach",
		version: "1",
		author: "Grey | api by jerome",
		role: 0,
		description: {
			vi: "Teach Simsimi",
			en: "Teach Simsimi"
		},
		countDown: 0,
		hasPrefix: false,
		category: "teach",
		guide: {
			vi: "Teach",
			en: "Teach"
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
	onStart: async function ({ api, event, args, prefix }) {
		const axios = require("axios");
		try {
			const text = args.join(" ");
			const text1 = text.substr(0, text.indexOf(' => '));
			const text2 = text.split(" => ").pop();
	
			if (!text1 || !text2) {
				return api.sendMessage(`Usage: ${prefix}teach hi => hello`, event.threadID, event.messageID);
			}
	
			const response = await axios.get(`https://sim-api-ctqz.onrender.com/teach?ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
			api.sendMessage(`Your ask: ${text1}\nSim respond: ${text2}\nSuccesfull teach`, event.threadID, event.messageID);
		} catch (error) {
			console.error("An error occurred:", error);
			api.sendMessage("Please provide both a question and an answer\nExample: Teach hi => hello", event.threadID, event.messageID);
		}
	},
};
