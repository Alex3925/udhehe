module.exports.config = {
  name: "shoti2",
  version: "1.0.0",
  hasPermission: 0,
  credits: "libyzxy0",
  description: "Generate a random TikTok video.",
  commandCategory: "Entertainment",
  usages: "[]",
  cooldowns: 0,
  usePrefix: true,
  dependencies: {
    axios: "",
    "fs-extra": "",
    "path": ""
  }
};

module.exports.handleResponse = async function ({ api, event, args, clients, commandName, Currencies, globalCooldowns, client, ...others }) {
  const axios = global.nodemodule["axios"];
  const fsExtra = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];

  api.setMessageReaction("⏳", event.messageID, (err) => {
  }, true);
  api.sendTypingIndicator(event.threadID, true);

  const { messageID, threadID } = event;
  const prompt = args.join(" ");

  if (!prompt[0]) {
    api.sendMessage("Downloading...", threadID, messageID);
  }

  try {
    const response = await axios.post(`https://shoti-server-v2.vercel.app/api/v1/get`, { apikey: `$shoti-1hfnksfp3ek6aidop7g` });

    const path = __dirname + `/cache/shoti/shoti.mp4`;
    const file = fsExtra.createWriteStream(path);
    const rqs = request(encodeURI(response.data.data.url));
    rqs.pipe(file);
    file.on(`finish`, () => {
      setTimeout(function() {
        api.setMessageReaction("✅", event.messageID, (err) => {
        }, true);
        return api.sendMessage({
          body: `Downloaded Successfull(y). \n\nuserName : \n\n@${response.data.data.user.username} \n\nuserNickname : \n\n${response.data.data.user.nickname} \n\nuserID : \n\n${response.data.data.user.userID} \n\nDuration : \n\n${response.data.data.duration}`, 
          attachment: fsExtra.createReadStream(path)
        }, threadID);
      }, 1000);
    });
    file.on(`error`, (err) => {
      api.sendMessage(`Error: ${err}`, threadID, messageID);
    });
  } catch (err) {
    api.sendMessage(`Error: ${err}`, threadID, messageID);
  };
};
