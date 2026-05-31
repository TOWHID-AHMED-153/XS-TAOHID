const fs = require("fs-extra");
const { utils } = global;

const ALLOWED_UIDS = ["61590451466463"];

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "S AY EM",
		countDown: 5,
		role: 0,
		description: "Change bot prefix (restricted)",
		category: "config",
		guide: {
			en:
				"   {p}prefix <new prefix>\n" +
				"   Example:\n" +
				"   {p}prefix #\n\n" +
				"   {p}prefix <new prefix> -g (admin only)\n" +
				"   Example:\n" +
				"   {p}prefix # -g\n\n" +
				"   {p}prefix reset"
		}
	},

	langs: {
		en: {
			reset: "🔄 𝐏𝐫𝐞𝐟𝐢𝐱 𝐑𝐞𝐬𝐞𝐭!\n➤ Default: %1",
			onlyAdmin: "⚠️ 𝐎𝐧𝐥𝐲 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧 𝐂𝐚𝐧 𝐂𝐡𝐚𝐧𝐠𝐞 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱",
			notAllowed: "❌ 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝!\n➤ You can't use this command",
			confirmGlobal: "🌐 𝐂𝐨𝐧𝐟𝐢𝐫𝐦 𝐆𝐥𝐨𝐛𝐚𝐥 𝐂𝐡𝐚𝐧𝐠𝐞\n➤ React this message to apply new prefix",
			confirmThisThread: "💬 𝐂𝐨𝐧𝐟𝐢𝐫𝐦 𝐂𝐡𝐚𝐭 𝐂𝐡𝐚𝐧𝐠𝐞\n➤ React this message to apply new prefix",
			successGlobal: "✅ 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱 𝐔𝐩𝐝𝐚𝐭𝐞𝐝\n➤ New Prefix: %1",
			successThisThread: "✅ 𝐂𝐡𝐚𝐭 𝐏𝐫𝐞𝐟𝐢𝐱 𝐔𝐩𝐝𝐚𝐭𝐞𝐝\n➤ New Prefix: %1",
			myPrefix:
				"╭───〔 🤖 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 〕───╮\n \n" +
				"👤 𝐔𝐬𝐞𝐫: %1\n\n" +
				"🌐 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱: %2\n\n" +
				"💬 𝐆𝐥𝐨𝐛𝐚𝐥 𝐓𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐮𝐬𝐞: %3\n\n" +
				"🤖 𝐁𝐨𝐭 𝐍𝐍: ᴛᴏᴜʜɪᴅ ʙᴏᴛ
				"╰───────────────────╯"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {

		if (!ALLOWED_UIDS.includes(event.senderID)) {
			return message.reply(getLang("notAllowed"));
		}

		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g")
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(
			args[1] === "-g"
				? getLang("confirmGlobal")
				: getLang("confirmThisThread"),
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;

		if (event.userID !== author)
			return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang, usersData }) {
		if (event.body && event.body.toLowerCase() === "prefix")
			return async () => {
				const userName = await usersData.getName(event.senderID);
				const botName = global.GoatBot.config.nickNameBot || "Bot";
				return message.reply(
					getLang(
						"myPrefix",
						userName,
						global.GoatBot.config.prefix,
						utils.getPrefix(event.threadID),
						botName
					)
				);
			};
	}
};
