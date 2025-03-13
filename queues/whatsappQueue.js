const bullmq = require("bullmq");
const { redis } = require("../clientConfig/redis");
const { sendFile } = require("../utils/sendFile");
const CreateClient = require("../clientConfig/client");


let client;
CreateClient().then((res) => {
  client = res;
  console.log("WhatsApp client initialized.");
});

const whatsappQueue = new bullmq.Queue("send-whatsapp-image", {
  connection: redis,
});

const whatsappWorker = new bullmq.Worker(
  "send-whatsapp-image",
  async (job) => {
    try {
      if (!client) {
        await CreateClient().then((res) => {
          client = res;
          console.log("WhatsApp client initialized.");
        });
      }

      const { imagePath, recipientNumber, user } = job.data;
      await sendFile(imagePath, recipientNumber, user, client);
      console.info(`WhatsApp image sent successfully for user: ${user.email}`);
    } catch (error) {
      console.error(`Error processing WhatsApp image job:`, error);
    }
  },
  { connection: redis }
);

module.exports = { whatsappQueue, whatsappWorker };
