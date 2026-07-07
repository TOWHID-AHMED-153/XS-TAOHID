const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "catbox",
    version: "2.1",
    author: "Rocky Chowdhury",
    countDown: 5,
    role: 0,
    shortDescription: "Upload media to catbox.moe",
    longDescription: "Reply to a photo/video/attachment OR give a direct URL to upload it to catbox.moe and get a permanent link",
    category: "utility",
    guide: {
      en: "{pn}: reply to a photo/video/attachment\n{pn} <direct URL>: upload from a direct link"
    }
  },

  onStart: async function ({ api, event, message, args }) {
    try {
      const { messageReply } = event;
      let sources = [];

      if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        for (const att of messageReply.attachments) {
          if (att.url) sources.push({ url: att.url, type: att.type });
        }
      }

      if (args.length > 0) {
        for (const arg of args) {
          if (/^https?:\/\//i.test(arg)) {
            sources.push({ url: arg, type: "link" });
          }
        }
      }

      if (sources.length === 0) {
        return message.reply(
          "❌ কোনো photo/video/attachment এর সাথে reply দাও, অথবা সরাসরি একটা direct URL দাও।"
        );
      }

      await message.reply(`⏳ ${sources.length}টা ফাইল আপলোড হচ্ছে, একটু অপেক্ষা করো...`);

      const tempDir = path.join(__dirname, "cache");
      await fs.ensureDir(tempDir);

      const results = [];

      for (let i = 0; i < sources.length; i++) {
        const { url, type } = sources[i];

        const cleanUrl = url.split("?")[0];
        let ext = path.extname(cleanUrl);

        if (!ext || ext.length > 5 || /[^a-zA-Z0-9.]/.test(ext)) {
          if (type === "photo" || type === "animated_image") ext = ".jpg";
          else if (type === "video") ext = ".mp4";
          else if (type === "audio") ext = ".mp3";
          else ext = ".bin";
        }

        const filePath = path.join(tempDir, `catbox_${Date.now()}_${i}${ext}`);

        try {
          // ✅ FIX 1: real browser-like headers, নাহলে FB CDN error/HTML page দিয়ে দেয়
          const response = await axios.get(url, {
            responseType: "arraybuffer",
            timeout: 60000,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              "Referer": "https://www.facebook.com/"
            },
            maxRedirects: 5
          });

          const buffer = Buffer.from(response.data);

          // ✅ FIX 2: ডাউনলোড হওয়া ফাইলটা আসলেই media কিনা যাচাই (HTML error page না তো)
          const contentType = response.headers["content-type"] || "";
          const isHtml = contentType.includes("text/html");
          const tooSmall = buffer.length < 1024; // 1KB এর কম হলে সন্দেহজনক

          if (isHtml || tooSmall) {
            results.push(
              `❌ [${i + 1}] ডাউনলোড হওয়া ফাইলটা invalid/broken মনে হচ্ছে (হয়তো লিংকটা expire হয়ে গেছে)। আবার reply/attachment দিয়ে চেষ্টা করো।`
            );
            continue;
          }

          await fs.writeFile(filePath, buffer);

          const form = new FormData();
          form.append("reqtype", "fileupload");
          form.append("fileToUpload", fs.createReadStream(filePath));

          const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 120000
          });

          const link = uploadRes.data;

          if (typeof link === "string" && link.trim().startsWith("http")) {
            results.push(`✅ [${type || "file"}] (${(buffer.length / 1024 / 1024).toFixed(2)}MB)\n${link.trim()}`);
          } else {
            results.push(`❌ [${i + 1}] catbox upload ফেইল: ${String(link).slice(0, 150)}`);
          }
        } catch (err) {
          results.push(`❌ [${i + 1}] Error: ${err.message}`);
        } finally {
          fs.remove(filePath).catch(() => {});
        }
      }

      return message.reply(results.join("\n\n"));
    } catch (err) {
      console.error("[catbox cmd error]", err);
      return message.reply("❌ Unexpected error: " + err.message);
    }
  }
};
