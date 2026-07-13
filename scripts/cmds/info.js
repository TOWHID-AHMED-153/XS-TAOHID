const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "info",
    version: "1.0",
    author: "Touhid",
    role: 0,
    category: "info",
    shortDescription: "Bot info with pic",
    cooldowns: 5,
    hasPrefix: false
  },

  onStart: async function() {},

  run: async function({ api, event, message }) {
    const imgUrl = "https://i.imgur.com/yAInnf2.jpeg"; // <-- EKHANE TOR PIC ER LINK BOSHA
    const imgPath = path.join(__dirname, "cache", "info.jpg");

    try {
      // Pic download
      const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
      await fs.ensureDir(path.join(__dirname, "cache"));
      await fs.writeFile(imgPath, Buffer.from(res.data));

      // Message pathano
      return message.reply({
        body: `👶 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 👶\n\n` +
              `**Name:** XS-TAOHID BOT\n` +
              `**Version:** 16.0\n` +
              `**Author:** Touhid\n` +
              `**Status:** Online 🟢\n\n` +
              `Amake `baby` bole dak dis 🥰`,
        attachment: fs.createReadStream(imgPath)
      });

    } catch (e) {
      return message.reply("Sona pic load hoyni 😔 Sudhu info dilam.");
    }
  }
};
