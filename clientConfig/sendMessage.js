async function SendMessage(msg, client, recipient, res) {
  console.log(`Sending message to ${recipient}@c.us`);
  const response = await client.sendMessage(`${recipient}@c.us`, msg);
  console.log(`Message sent to ${recipient}@c.us`, response);
  return res.send("sent")
}

module.exports = SendMessage;
