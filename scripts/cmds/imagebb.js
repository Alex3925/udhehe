const axios = require('axios');
const path = require('path');

module.exports = {
	config: {
		name: "imgbb",
		version: "1.0.0",
		role: 0,
		description: {
			vi: "Tải lên hình ảnh lên imgbb",
			en: "Upload an image to imgbb"
		},
		category: "image",
		credits: "cliff",
		hasPrefix: false,
		usePrefix: false,
		cooldowns: 5
	},

	langs: {
		vi: {
			usage: "{pn} <hình ảnh đính kèm>",
			usages: "{pn} <hình ảnh đính kèm>"
		},
		en: {
			usage: "{pn} <attached image>",
			usages: "{pn} <attached image>"
		}
	},

	onStart: async function ({ api, event, getLang }) {
		try {
			let imageUrl;
			if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
				imageUrl = event.messageReply.attachments[0].url;
			} else if (event.attachments.length > 0) {
				imageUrl = event.attachments[0].url;
			} else {
				return api.sendMessage(getLang("no_attachment_detected"), event.threadID, event.messageID);
			}

			const uploadUrl = 'https://apis-samir.onrender.com/upload';
			const data = { file: imageUrl };

			const response = await axios.post(uploadUrl, data, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			const result = response.data;

			if (result && result.image && result.image.url) {
				const cleanImageUrl = result.image.url.split('-')[0];
				api.sendMessage({ body: `${cleanImageUrl}.jpg` }, event.threadID);
			} else {
				api.sendMessage(getLang("failed_to_upload_image"), event.threadID);
			}
		} catch (error) {
			console.error('Error:', error);
			api.sendMessage(`Error: ${error.message}`, event.threadID);
		}
	}
};
