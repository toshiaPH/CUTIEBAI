const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
  name: "music",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ['play'],
  usage: 'music [prompt]',
  description: 'Search and download music from YouTube',
  credits: 'Developer',
  cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const query = args.join(' ');
  if (!query) {
    return api.sendMessage(
      global.font("Please provide the title of the song you want to play. Example: \"music [song name]\""),
      threadID,
      messageID
    );
  }

  try {
    api.sendMessage(global.font(`Searching for "${query}"...`), threadID, messageID);

    const searchResponse = await axios.get('https://apiv2.kenliejugarap.com/ytsearch', {
      params: { title: query }
    });

    if (!searchResponse.data || !searchResponse.data.videos || searchResponse.data.videos.length === 0) {
      return api.sendMessage(
        global.font(`No results found for "${query}". Please try a different song title.`),
        threadID,
        messageID
      );
    }

    const firstResult = searchResponse.data.videos[0];
    const videoUrl = firstResult.url;

    api.sendMessage(global.font(`Found "${firstResult.title}". Preparing to download...`), threadID, messageID);

    const downloadResponse = await axios.get('https://apiv2.kenliejugarap.com/music', {
      params: { url: videoUrl }
    });

    if (!downloadResponse.data || !downloadResponse.data.response) {
      return api.sendMessage(
        global.font('An error occurred while fetching the download link. Please try again later.'),
        threadID,
        messageID
      );
    }

    const audioUrl = downloadResponse.data.response;
    const title = downloadResponse.data.title || 'Unknown Title';
    const filename = `${title}.mp3`.replace(/[^a-zA-Z0-9. ]/g, '_');
    const filePath = path.join(__dirname, 'cache', filename);

    const fileStream = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    fileStream.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const message = {
      body: global.font(`🎵 Here is your song: ${title}`),
      attachment: fs.createReadStream(filePath)
    };

    await api.sendMessage(message, threadID, messageID);

    fs.unlinkSync(filePath);

  } catch (error) {
    console.error('Error:', error);
    api.sendMessage(
      global.font('An error occurred while processing your request. Please try again later.'),
      threadID,
      messageID
    );
  }
};