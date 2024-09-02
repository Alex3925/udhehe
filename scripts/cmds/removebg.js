const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "removebg",
    version: "1.0",
    role: 0,
    description: {
      vi: "Tăng cường ảnh của bạn bằng cách loại bỏ nền.",
      en: "Enhance your photo by removing the background."
    },
    category: "Utility",
    credits: "cliff",//api by hazey 
    countDown: 2
  },

  langs: {
    vi: {
      usage: "trả lời ảnh",
      usages: "trả lời ảnh"
    },
    en: {
      usage: "replying photo",
      usages: "replying photo"
    }
  },

  onStart: async function ({ api, event, args, getLang }) {
    let pathie = __dirname + `/../cache/remove_bg.jpg`;
    const { threadID, messageID } = event;

    let photoUrl = event.messageReply ? event.messageReply.attachments[0].url : args.join(" ");

    if (!photoUrl) {
      api.sendMessage(getLang("please_reply_or_provide_photo_url"), threadID, messageID);
      return;
    }

    try {
      api.sendMessage(getLang("removing_background"), threadID, messageID);
      const response = await axios.get(`https://haze-code-merge-0f8f4bbdea12.herokuapp.com/api/try/removebg?url=${encodeURIComponent(photoUrl)}`);
      const processedImageURL = response.data.image_data;

      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      api.sendMessage({
        body: getLang("background_removed_successfully"),
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    } catch (error) {
      api.sendMessage(`Error processing image: ${error}`, threadID, messageID);
    };
  }
};
