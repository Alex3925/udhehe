module.exports = {
	config: {
		name: "sim",
		version: "1.0.0",
		author: "jerome",
		role: 0,
		description: {
			vi: "Talk to sim",
			en: "Talk to sim"
		},
		countDown: 0,
		hasPrefix: false,
		category: "sim",
		guide: {
			vi: "sim",
			en: "sim"
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
		let { messageID, threadID, senderID, body } = event;
		let tid = threadID,
			mid = messageID;
		const content = encodeURIComponent(args.join(" "));
		if (!args[0]) return api.sendMessage("Please type a message...", tid, mid);
		try {
			const res = await axios.get(`https://sim-api-ctqz.onrender.com/sim?query=${content}`);
			const respond = res.data.respond;
			if (res.data.error) {
				api.sendMessage(`Error: ${res.data.error}`, tid, (error, info) => {
					if (error) {
						console.error(error);
					}
				}, mid);
			} else {
				api.sendMessage(respond, tid, (error, info) => {
					if (error) {
						console.error(error);
					}
				}, mid);
			}
		} catch (error) {
			console.error(error);
			api.sendMessage("An error occurred while fetching the data.", tid, mid);
		}
	},
};
