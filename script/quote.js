const axios = require('axios');

module.exports.config = {
  name: "quote",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Get a random quote based on a given prompt.",
  usage: "quote [prompt]",
  credits: "Developer",
  cooldown: 0
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  const prompt = args.join(' ');

  if (!prompt) {
    return api.sendMessage(global.font("Please provide a prompt. For example: 'quote Love' or 'quote Happiness'."),
      threadID,
      messageID
    );
  }

  try {
    const response = await axios.get(`https://api.jsongpt.com/json?prompt=${encodeURIComponent(prompt)}&quotes=array of quotes`);
    const { quotes } = response.data;

    if (quotes && quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      api.sendMessage(global.font(`"${randomQuote}"`), threadID, messageID);
    } else {
      api.sendMessage(global.font("No quotes were found for your prompt. Please try a different topic."), threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage(global.font("Sorry, I couldn't fetch a quote at the moment. Please try again later."), threadID, messageID);
  }
};