if(!global.babyChat) global.babyChat = new Map();

module.exports = {
  config: {
    name: "baby",
    version: "13.0",
    author: "Touhid",
    role: 0,
    category: "ai",
    shortDescription: "Baby",
    guide: "",
    cooldowns: 0,
    prefix: false // Eita main jadu. Prefix lagbe na.
  },

  onStart: async function() {},

  handleEvent: async function({ api, event, message }) {
    const { senderID, body } = event;
    if (!body) return;
    let msg = body.toLowerCase().trim();
    
    // . ! / sob remove kore dibe
    msg = msg.replace(/^[\.\!\/#]+/, "");

    // 1. ON
    if (["baby", "jan", "sona", "hi", "hello"].includes(msg)) {
      global.babyChat.set(senderID, true);
      return message.reply("👶 Hii Sona 🥰 Bolo");
    }

    // 2. Chat ON thakle
    if (global.babyChat.get(senderID) === true) {
      if (msg == "stop") {
        global.babyChat.delete(senderID);
        return message.reply("👶 Accha ghumalam 🥱");
      }
      if (msg.includes("kemon acho")) return message.reply("👶 Valo 🥰 Tumi?");
      return message.reply("👶 Hmm.. ki bolo sona? 😆");
    }
  }
};
