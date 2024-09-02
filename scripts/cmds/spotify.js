const axios = require('axios');
const fs = require('fs');

module.exports = {
	config: {
		name: "spotify",
		version: "1.0.0",
		author: "cliff",
		role: 0,
		description: {
			vi: "Tìm kiếm và phát nhạc từ Spotify",
			en: "Search and play music from Spotify"
		},
		category: "spotify",
		guide: {
			vi: "[tên bài hát]",
			en: "[song name]"
		},
		countDown: 5
	},

	langs: {
		vi: {
			usage: "[tên bài hát]",
			usages: "[tên bài hát]"
		},
		en: {
			usage: "[song name]",
			usages: "[song name]"
		}
	},

	onStart: async function ({ api, event, args, getLang }) {
		const listensearch = encodeURIComponent(args.join(" "));
		const apiUrl = `https://hiroshi-api-hub.replit.app/music/spotify?search=${listensearch}`;

		if (!listensearch) return api.sendMessage(getLang("please_provide_song_name"), event.threadID, event.messageID);

		try {
			api.sendMessage(getLang("searching_music_on_spotify"), event.threadID, event.messageID);

			const response = await axios.get(apiUrl);
			const [{ name, track, download, image }] = response.data;

			if (name) {
				const filePath = `${__dirname}/../cache/${Date.now()}.mp3`;
				const writeStream = fs.createWriteStream(filePath);

				const audioResponse = await axios.get(download, { responseType: 'stream' });

				audioResponse.data.pipe(writeStream);

				writeStream.on('finish', () => {
					api.sendMessage({
						body: getLang("music_from_spotify", { name, track, download, image }),
						attachment: fs.createReadStream(filePath),
					}, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
				});
			} else {
				api.sendMessage(getLang("couldnt_find_requested_music"), event.threadID);
			}
		} catch (error) {
			console.error(error);
			api.sendMessage(getLang("error_processing_request"), event.threadID);
		}
	}
};
