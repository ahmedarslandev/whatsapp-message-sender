const express = require("express");
const CreateClient = require("./clientConfig/client");
const formidable = require("formidable");
const SendFile = require("./clientConfig/sendFile");
const SendMessage = require("./clientConfig/sendMessage");

const path = require("path");

require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.render("index");
});

// Initialize the WhatsApp client
let client;
CreateClient().then((res) => {
  client = res;
  console.log("WhatsApp client initialized.", client, res);
});

// Middleware to parse raw image data

app.use(express.raw({ type: "image/*", limit: "10mb" }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Route to handle image upload and sending
app.post("/send-image", async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the form:", err);
      return res.status(500).send("Error parsing the form.");
    }

    const walletId = fields.walletId; // Retrieve wallet ID from the fields
    const image = files.image; // Retrieve image file from the files

    if (!walletId || !image) {
      return res.status(400).send("Wallet ID or image is missing.");
    }
    const recipient = process.env.AdminNumber; // Adjust to correct format if needed

    try {
      await SendFile(res, image[0], client, recipient, walletId);
    } catch (error) {
      console.error("Error sending image:", error);
      res.status(500).send("Failed to send image.");
    }
  });
});

app.get("/send-msg/:msg", async function (req, res) {
  const msg = req.params.msg;
  const recipient = process.env.AdminNumber;
  SendMessage(msg, client, recipient, res);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
