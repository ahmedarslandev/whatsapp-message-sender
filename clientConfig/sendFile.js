const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

async function SendFile(res, image, client, recipient, walletId) {
  const tempFilePath = image.filepath;
  const fileData = await fs.promises.readFile(tempFilePath);

  const base64Data = fileData.toString("base64");
  const mimeType = image.mimetype || "image/jpeg";

  const media = new MessageMedia(mimeType, base64Data, image.originalFilename);

  console.log(`Sending image to ${recipient}@c.us`);
  const response = await client.sendMessage(`${recipient}@c.us`, media, {
    caption: `WalletId : ${walletId}`,
  });
  console.log(`Image sent to ${recipient}@c.us`, response);

  res.send("Image sent successfully!");
}

module.exports = SendFile;
