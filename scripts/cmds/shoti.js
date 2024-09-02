module.exports = {
	config: {
		name: "shoti",
		version: "1.0.0",
		role: 0,
		credits: "libyzxy0",
		description: {
			vi: "Tạo video TikTok ngẫu nhiên.",
			en: "Generate a random tiktok video."
		},
		commandCategory: "Entertainment",
		usages: "[]",
		cooldowns: 0,
		usePrefix: true
	},

	langs: {
		vi: {
			usages: "[]"
		},
		en: {
      usages: "[]",
      downloading: "Downloading...",
      downloaded_successfully: "Downloaded successfully!"
    }
  },
			
	onStart: async function ({ api, event, args, getLang }) {
		api.setMessageReaction("⏳", event.messageID, () => {}, true);
		api.sendTypingIndicator(event.threadID, true);

		const { messageID, threadID } = event;
		const fs = require("fs");
		const axios = require("axios");
		const request = require("request");
		const prompt = args.join(" ");

		if (!prompt[0]) {
			api.sendMessage(getLang("downloading"), threadID, messageID);
		}

		try {
			const response = await axios.post(`https://shoti-server-v2.vercel.app/api/v1/get`, { apikey: `$shoti-1hfnksfp3ek6aidop7g` });

			const path = __dirname + `/cache/shoti/shoti.mp4`;
			const file = fs.createWriteStream(path);
			const rqs = request(encodeURI(response.data.data.url));
			rqs.pipe(file);

			file.on(`finish`, () => {
				setTimeout(function () {
					api.setMessageReaction("✅", event.messageID, () => {}, true);
					return api.sendMessage({
						body: getLang("downloaded_successfully", {
							username: `@${response.data.data.user.username}`,
							userNickname: response.data.data.user.nickname,
							userID: response.data.data.user.userID,
							duration: response.data.data.duration
						}),
						attachment: fs.createReadStream(path)
					}, threadID);
				}, 1000);
			});

			file.on(`error`, (err) => {
				api.sendMessage(`Error: ${err}`, threadID, messageID);
			});
		} catch (err) {
			api.sendMessage(`Error: ${err}`, threadID, messageID);
		}
	}
};
