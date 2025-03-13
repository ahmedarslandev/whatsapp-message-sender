const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs/promises");
const mime = require("mime-types");

const sendFile = async (imageFilePath, recipient, data, client) => {
  try {
    console.log("WHATS_APP_CLIENT_CALLED");

    const fileData = await fs.readFile(imageFilePath);
    const base64Data = fileData.toString("base64");
    const mimeType = mime.lookup(imageFilePath) || "image/jpeg";

    const media = new MessageMedia(mimeType, base64Data);
    console.info(`Sending image to ${recipient}@c.us`);

    const formattedMessage = `
        📌 *User Details* 📌
        ----------------------------
        🆔 *ID:* ${JSON.stringify(data._id)}
        👤 *Name:* ${data.name}
        📧 *Email:* ${data.email}
        🛠 *Role:* ${data.role}
        ✅ *Verified:* ${data.isVerified ? "Yes" : "No"}
        🏪 *Store ID:* ${JSON.stringify(data.store)}
        💰 *Wallet ID:* ${JSON.stringify(data.walletId)}
        ----------------------------
        `;

    if (client) {
      const response = await client.sendMessage(`${recipient}@c.us`, media, {
        caption: `User details : ${formattedMessage}`,
      });
      console.info(`Image sent to ${recipient}@c.us`);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { sendFile };
