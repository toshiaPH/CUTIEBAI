const axios = require('axios');
const google = require('googlethis');

module.exports.config = {
  name: 'lyrics',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['lyrics'],
  description: 'Get lyrics for a song',
  usages: 'lyrics [song name]',
  credits: 'Marjhun Baylon',
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "googlethis": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const songName = args.join(' ');

  if (!songName) {
    return api.sendMessage(
      global.font("Missing input. Please provide a song name."),
      threadID,
      messageID
    );
  }

  try {
    const res = await google.search("lyrics " + songName);

    if (res.knowledge_panel && res.knowledge_panel.lyrics) {
      api.sendMessage(
        global.font(
          "•———•°• Lyrics •°•———•\n\n" +
          res.knowledge_panel.lyrics +
          "\n\n•———•°• The End •°•———•"
        ),
        threadID,
        messageID
      );
    } else {
      api.sendMessage(
        global.font("Lyrics not found. Please try another song."),
        threadID,
        messageID
      );
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error.message);
    api.sendMessage(
      global.font("An error occurred while fetching the lyrics. Please try again later."),
      threadID,
      messageID
    );
  }
};
