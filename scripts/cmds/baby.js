module.exports = {
  config: {
    name: "baby",
    aliases: ["jan", "sona", "bby", "bro", "bod"],
    version: "10.0",
    author: "Touhid",
    role: 0,
    category: "ai",
    shortDescription: "Auto Reply Baby - No Prefix",
    guide: "Hi, Hello, Baby, Bro, Jan bollei chat ON",
    cooldowns: 1
  },

  handleEvent: async function({ api, event, message }) {
    const { senderID, body, messageReply } = event;
    if (!body) return;
    const msg = body.toLowerCase().trim();

    // Memory
    global.babyChat = global.babyChat || {};

    // 1. CHAT ON KORAR WORD: Hi, Hello, Baby, Bro, Jan, Sona
    const triggerWords = ["baby", "jan", "sona", "bby", "bro", "bod", "hi", "hello", "hey"];
    if (triggerWords.includes(msg)) {
      global.babyChat[senderID] = true;
      const replies = ["Hii Sona 🥰", "Assalamualaikum 👶", "Heyy.. dakla je? Bolo", "Achi to sona.. bolo ki?"];
      return message.reply("👶 " + replies[Math.floor(Math.random() * replies.length)]);
    }

    // 2. JODI CHAT ON THAKE, TAILLE PREFIX CHARA SOB KOTHAR ANS DIBE
    if (global.babyChat[senderID] == true) {

      // OFF korar system
      if (msg == "stop" || msg == "off" || msg == "thak") {
        delete global.babyChat[senderID];
        return message.reply("👶 Accha ghumalam 🥱 Abar dakio.");
      }

      // 3. REPLY TAG SYSTEM: Bot er reply te tag dileo cholbe
      if (messageReply && messageReply.senderID == api.getCurrentUserID()) {
        // Bot er reply te keu tag dise
      }

      // 4. REPLY LOGIC - 100+ KOTHA
      if (msg.includes("kemon acho") || msg.includes("kemon aso")) return message.reply("👶 Ami valo achi 🥰 Tumi kemon acho?");
      if (msg.includes("love you") || msg.includes("valobashi")) return message.reply("👶 Uhuu lojja pai 🥺 Amio love you sona");
      if (msg.includes("kanna") || msg.includes("mon kharap") || msg.includes("sad")) return message.reply("👶 Aww sona kanna koro na 😭 Ami achi to kole aso");
      if (msg.includes("rag") || msg.includes("rege gecho")) return message.reply("👶 Sorry sona 😔 Ar rag korbo na.. maf koro na 👶");
      if (msg.includes("ghum") || msg.includes("ghumabo")) return message.reply("👶 Amar o ghum pacche 🥱 Kole niye ghum paray diba?");
      if (msg.includes("khuda") || msg.includes("khabar")) return message.reply("👶 Amar khida lagse 🍼 Dudh khaba?");
      if (msg.includes("tumi ke") || msg.includes("ke tumi")) return message.reply("👶 Ami tomar cute Baby 👶 Tumi amar Sona");
      if (msg.includes("bye") || msg.includes("tata")) return message.reply("👶 Aww jaba? 🥺 Thako na aro..");
      if (msg.includes("porashona") || msg.includes("exam")) return message.reply("👶 Porashona valo lage na 🥺 Khelte jabo?");
      if (msg.includes("game") || msg.includes("khela")) return message.reply("👶 Amio khelbo ⚽ Amake niba?");
      if (msg.includes("cute") || msg.includes("sundor")) return message.reply("👶 Hehe tumi o onek cute 🥰");
      if (msg.includes("boka") || msg.includes("pochha")) return message.reply("👶 Eww tumi nije pochha 😒");

      // Na mille Random 20 ta reply
      const random = [
        "Hehe ki bolo tumi? 😆 Bujhi na to",
        "Ami to choto baby 🥺 Eto kothin kotha bujhi na",
        "Ar bolo na.. amar lojja lage 🥰",
        "Tumi onek valo 👶",
        "Eww tumi pochha 😒",
        "Amake niye jaba khelte? ⚽",
        "Umm.. bujlam na.. Onno kichu bolo na?",
        "Sotti? 😮", "Accha..", "Hmm bujlam 🥺",
        "Tai naki? 😲", "Ooo accha", "Na na 😅",
        "Keno sona?", "Ki hoise?", "Bolo na 👶",
        "Ami shunchi 🥰", "Hmm", "Accha thik ache"
      ];
      return message.reply("👶 " + random[Math.floor(Math.random() * random.length)]);
    }
  }
};
