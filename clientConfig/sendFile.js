const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

async function SendFile(res, image, client, recipient, walletId) {
  const tempFilePath = image.filepath;
  // Read the file data as a buffer
  const fileData = await fs.promises.readFile(tempFilePath);

  // Convert file data to Base64
  const base64Data = fileData.toString("base64");
  const mimeType = image.mimetype || "image/jpeg"; // Adjust as needed

  // Create the MessageMedia object
  const media = new MessageMedia(mimeType, base64Data, image.originalFilename);

  // Ensure the client is ready
  // Send the image using MessageMedia
  console.log(`Sending image to ${recipient}@c.us`);
  const response = await client.sendMessage(`${recipient}@c.us`, media, {
    caption: `WalletId : ${walletId}`,
  });
  console.log(`Image sent to ${recipient}@c.us`, response);

  // Clean up the temporary file
  res.send("Image sent successfully!");
}

module.exports = SendFile;
