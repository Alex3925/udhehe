module.exports = {
	config: {
		name: "ngl",
		version: "1.0.0",
		role: 2,
		credits: "Eugene Aguilar",
		description: {
			vi: "Gửi tin nhắn đến trò chuyện NGL",
			en: "Send a message to the NGL chat"
		},
		usages: "/ngl <username> | <message> | <count>",
		commandCategory: "fun",
		cooldowns: 10
	},

	langs: {
		vi: {
			usages: "/ngl <tên người dùng> | <tin nhắn> | <số lần>"
		},
		en: {
			usages: "/ngl <username> | <message> | <count>"
		}
	},

	onStart: async function ({ api, event, args, getLang }) {
		const content = args
			.join(" ")
			.split("|")
			.map((item) => item.trim());
		let username = content[0];
		let count = parseInt(content[1]);
		let message = content[2];

		if (!username || !message || isNaN(count) || count <= 0 || !Number.isInteger(count)) {
			api.sendMessage(getLang("invalid_command_usage"), event.threadID, event.messageID);
			return;
		}

		try {
			const response = await axios.get(`https://eurix-api.replit.app/ngl/spam?username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}&count=${encodeURIComponent(count)}`);
			await api.sendMessage(`Sent ${count} messages to ${username}`, event.threadID, event.messageID);
		} catch (error) {
			api.sendMessage(getLang("error_occurred_try_again"), event.threadID, event.messageID);
			console.error("Error in /ngl command:", error);
		}
	}
};
