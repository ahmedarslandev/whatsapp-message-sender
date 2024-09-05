async function SendMessage(msg, client, recipient, res) {
  console.log(`Sending message to ${recipient}@c.us`);
  const response = await client.sendMessage(`${recipient}@c.us`, msg);
  console.log(`Message sent to ${recipient}@c.us`, response);
  // Clean up the temporary file
  res.send("Image sent successfully!");
}

module.exports = SendMessage;
