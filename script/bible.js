const axios = require('axios');

module.exports.config = {
  name: "bible",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Fetch a random Bible verse.",
  usage: "bible",
  credits: "Marjhun Baylon",
  cooldown: 0
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    const response = await axios.get('https://bible-api.com/?random=verse');
    const { reference, text, translation_name } = response.data;

    const message = global.font(`📖“– Reference: ${reference}\n\n"${text.trim()}"\n\nTranslation: ${translation_name}`);
    api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error("Error fetching Bible verse:", error.message);
    api.sendMessage(
      global.font("Sorry, I couldn't fetch a Bible verse at the moment. Please try again later."),
      threadID,
      messageID
    );
  }
};