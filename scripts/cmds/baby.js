module.exports = {
  config: {
    name: "baby",
    aliases: ["jan", "sona", "bby", "bro", "bod"],
    version: "10.1",
    author: "Touhid",
    role: 0,
    category: "ai",
    shortDescription: "Auto Reply Baby - No Prefix",
    guide: "Hi, Hello, Baby, Bro, Jan bollei chat ON",
    cooldowns: 1
  },

  // Eita sudhu.cmd install er jonno. Kaj kore na.
  onStart: async function({ message }) {
    return message.reply("👶 Baby bot install hoye gese. Ekhon 'hi' likho.");
  },

  // Asol kaj eita korbe
  handleEvent: async function({ api, event, message }) {
    const { senderID, body, messageReply } = event;
    if (!body) return;
    const msg = body.toLowerCase().trim();
    global.babyChat = global.babyChat || {};

    const triggerWords = ["baby", "jan", "sona", "bby", "bro", "bod", "hi", "hello", "hey"];
    if (triggerWords.includes(msg)) {
      global.babyChat[senderID] = true;
      const replies = ["Hii Sona 🥰", "Assalamualaikum 👶", "Heyy.. dakla je? Bolo"];
      return message.reply("👶 " + replies[Math.floor(Math.random() * replies.length)]);
    }

    if (global.babyChat[senderID] == true) {
      if (msg == "stop" || msg == "off" || msg == "thak") {
        delete global.babyChat[senderID];
        return message.reply("👶 Accha ghumalam 🥱 Abar dakio.");
      }
      if (msg.includes("kemon acho")) return message.reply("👶 Ami valo achi 🥰 Tumi kemon acho?");
      if (msg.includes("love you")) return message.reply("👶 Uhuu lojja pai 🥺 Amio love you sona");
      if (msg.includes("kanna")) return message.reply("👶 Aww sona kanna koro na 😭");
      if (msg.includes("rag")) return message.reply("👶 Sorry sona 😔 Maf koro na");
      if (msg.includes("ghum")) return message.reply("👶 Amar o ghum pacche 🥱");
      if (msg.includes("khuda")) return message.reply("👶 Amar khida lagse 🍼");
      if (msg.includes("tumi ke")) return message.reply("👶 Ami tomar cute Baby 👶");
      if (msg.includes("bye")) return message.reply("👶 Aww jaba? 🥺 Thako na");
      const random = ["Hehe ki bolo? 😆","Ami bujhi na 🥺","Ar bolo na lojja lage 🥰","Tumi valo 👶","Eww pochha 😒"];
      return message.reply("👶 " + random[Math.floor(Math.random() * random.length)]);
    }
  }
};
