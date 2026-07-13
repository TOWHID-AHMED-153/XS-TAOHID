module.exports = {
  config: {
    name: "love",
    aliases: ["lc"],
    version: "3.0",
    author: "Touhid",
    role: 0,
    category: "fun",
    shortDescription: "Check love %",
    longDescription: "Calculate love compatibility between two people",
    usage: "love <name1> - <name2>",
    guide: "{p}love Touhid - Sathi",
    cooldowns: 3
  },

  onStart: async function({ api, event, args, message }) {
    const input = args.join(" ");

    if (!input.includes("-")) {
      return message.reply(`❌ Format: ${this.config.usage}\nEx: love Touhid - Sathi`);
    }

    const [fname, sname] = input.split("-").map(n => n.trim());
    
    if (!fname || !sname) {
      return message.reply("❌ 2 ta name lagbe: love Touhid - Sathi");
    }

    // Same name = 100%
    if (fname.toLowerCase() === sname.toLowerCase()) {
      return message.reply(`💖 ${fname} ❤️ ${sname}\nMatch: 100%\n💍 Nijekei biye koro bhai`);
    }

    // Fixed % based on name, so same name = same result
    let sum = 0;
    const key = (fname + sname).toLowerCase().replace(/\s/g, "");
    for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
    const percentage = (sum % 100) + 1;

    const bar = "█".repeat(Math.floor(percentage / 10)) + "░".repeat(10 - Math.floor(percentage / 10));

    let vibe = "";
    if (percentage <= 20) vibe = "😅 Just friends";
    else if (percentage <= 40) vibe = "🤝 Kichu ekta ache";
    else if (percentage <= 60) vibe = "😏 Not bad at all";
    else if (percentage <= 80) vibe = "🔥 Chemistry jome gese";
    else vibe = "💍 Eita to soulmate level";

    return message.reply(
`💖 Love Calculator v3 💖
━━━━━━━━━━━
${fname} + ${sname}

${bar} ${percentage}%

${vibe}`
    );
  }
};
