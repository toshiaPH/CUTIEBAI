const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usages: "ai [prompt]",
  credits: 'Developer',
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args.join(' ');

  if (!input) {
    return api.sendMessage(global.font(`Please provide a question or statement after 'ai'. For example: 'ai What is the capital of France?'`),
      threadID,
      messageID
    );
  }

  try {
    const sentMessage = await api.sendMessage(global.font(`🔍 Processing: "${input}"`), threadID, messageID);
    const sentMessageID = sentMessage.messageID;

    // Fetch response from the new API
    const { data } = await axios.get(`https://api.kenliejugarap.com/freegpt-openai/?question=${encodeURIComponent(input)}`);

    if (data.status) {
      // Send the AI response
      await api.editMessage(global.font(data.response), sentMessageID);
    } else {
      await api.editMessage('The API returned an error. Please try again later.', sentMessageID);
    }
  } catch (error) {
    console.error(error);
    return api.sendMessage('An error occurred while processing your request.', threadID, messageID);
  }
};
