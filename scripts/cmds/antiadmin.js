const fs = require("fs");

function loadAdminData() {
	try {
		const data = fs.readFileSync("admin.json", "utf8");
		return JSON.parse(data);
	} catch (error) {
		return {};
	}
}

function saveAdminData(adminData) {
	fs.writeFileSync("admin.json", JSON.stringify(adminData, null, 2));
}

let adminState = loadAdminData();

module.exports = {
	config: {
		name: "antiadmin",
		version: "1.0.0",
		role: 2,
		permissions: 2,
		credits: "Cliff", // do not change the credits
		hasPrefix: false,
		usePrefix: false,
		description: "anti gc admin: If someone removes you from admin, the bot will add you again as admin. If the bot is removed from admin, moye moye",
		usage: "{pn} off or on - current state always on",
		usages: "{pn} off or on - current state always on",
		cooldown: 5,
		commandCategory: "ADMIN",
		cooldowns: 5,
	},
	run: async function ({ api, event, args }) {
		if (args[0] === "off") {
			adminState[event.threadID] = "off";
			saveAdminData(adminState);
			return api.sendMessage(`Disabled.`, event.threadID);
		} else if (args[0] === "on") {
			delete adminState[event.threadID];
			saveAdminData(adminState);
			return api.sendMessage(`Enabled.`, event.threadID);
		} else {
			return api.sendMessage(`Usage: {pn} off to turn off`, event.threadID);
		}
	},
	handleEvent: async function ({ api, event }) {
		if (adminState[event.threadID] === "off" || !event.logMessageData || event.logMessageData.ADMIN_EVENT !== "remove_admin") {
			return;
		}

		const threadID = event.threadID;
		const targetID = event.logMessageData.TARGET_ID;
		const authorID = event.author;

		try {
			if (authorID !== api.getCurrentUserID() && targetID !== api.getCurrentUserID()) {
				await api.changeAdminStatus(threadID, targetID, true);
				await api.changeAdminStatus(threadID, authorID, false);
			}
		} catch (error) {
			console.error("Error", error);
		}
	},
};
