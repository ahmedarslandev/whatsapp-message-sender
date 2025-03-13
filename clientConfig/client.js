const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const puppeteer = require("puppeteer-core"); // Import puppeteer-core

async function CreateClient() {
  // Launch Puppeteer with options
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // Add other puppeteer options here if needed
  });

  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./Whatsapp-session" }),
    puppeteer: {
      browser,
    },
  });

  // Generate QR code for WhatsApp login
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Scan the QR code to log in.");
  });

  // Log when WhatsApp client is ready
  client.on("ready", async () => {
    isClientReady = true;
    console.log("WhatsApp client is ready!");

    // Retrieve and log all available WIDs
    try {
      const chats = await client.getChats();
      console.log("Available WIDs:");
      chats.forEach((chat) => {
        console.log(`- ${chat.id._serialized}`);
      });
    } catch (error) {
      console.error("Failed to retrieve WIDs:", error);
    }
  });

  // Handle errors that occur during the connection
  client.on("auth_failure", () => {
    console.error("Authentication failed. Please scan the QR code again.");
  });

  // Handle connection loss
  client.on("disconnected", () => {
    isClientReady = false;
    console.log("WhatsApp client disconnected.");
    // Optionally, you can call client.initialize() here to reinitialize
  });

  client.initialize();
  return client;
}

module.exports = CreateClient;
