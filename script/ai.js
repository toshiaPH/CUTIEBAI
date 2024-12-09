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
  const { threadID, messageID, senderID } = event;
  const input = args.join(' ');

  if (!input) {
    return api.sendMessage(global.font(`Please provide a question or statement after 'ai'. For example: 'ai What is the capital of France?'`),
      threadID,
      messageID
    );
  }

  try {
    const sentMessage = await api.sendMessage(global.font(`⏳ Processing: "${input}"`), threadID, messageID);
    const sentMessageID = sentMessage.messageID;

    const { data } = await axios.get(`https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(input)}&userid=${senderID}`);

    if (data.status === "true" && data.response) {
      await api.editMessage(global.font(data.response), sentMessageID);
    } else {
      await api.editMessage(global.font('The API returned an error or an invalid response. Please try again later.'), sentMessageID);
    }
  } catch (error) {
    console.error(error);
    return api.sendMessage(global.font('An error occurred while processing your request. Please try again later.'), threadID, messageID);
  }
};
