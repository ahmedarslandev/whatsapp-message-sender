const express = require("express");
const path = require("path");
const { whatsappQueue } = require("./queues/whatsappQueue");
const cors = require('cors')

require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.render("index");
});

// Middleware to parse raw image data
app.use(cors({origin:"157.90.174.166"}))
app.use(express.raw({ type: "image/*", limit: "10mb" }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());

// Route to handle image upload and sending
app.post("/api/v1/send-image",(req, res) => {

  const { imagePath, recipientNumber, user } = req.body;
  if (!imagePath || !recipientNumber || !user) {
    res.status(404).json({
      success: false,
      message: "Data fields are empty. Please enter full data in the fields",
    });
    return 
  }

  whatsappQueue.add("process-caller-ids", {
    imagePath,
    recipientNumber,
    user,
  });

  return res.status(201).json({ success: true, message: "ImageSent to user" });
});
// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
