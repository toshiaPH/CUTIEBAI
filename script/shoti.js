const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'shoti',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['shotivideo'],
  description: 'Fetch and send a random Shoti TikTok video',
  usages: 'shoti',
  credits: 'Marjhun Baylon',
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;
  const filePath = path.join(__dirname, 'shoti.mp4');

  let sentMessage;

  try {
    sentMessage = await api.sendMessage(global.font(' Fetching a random Shoti video. Please wait...'), threadID, messageID);

    const shotiData = JSON.parse(fs.readFileSync(path.join(__dirname, 'shoti.json'), 'utf8'));
    const randomLink = shotiData[Math.floor(Math.random() * shotiData.length)];

    const response = await axios.get('https://www.tikwm.com/api/', {
      params: {
        url: randomLink,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1
      }
    });

    if (sentMessage) {
      await api.unsendMessage(sentMessage.messageID);
    }

    if (response.data.code === 0) {
      const videoUrl = `https://www.tikwm.com${response.data.data.hdplay}`;
      const title = response.data.data.title || 'No Title';

      const videoStream = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      videoStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await api.sendMessage({
        body: global.font(` Here's your Shoti video:\n\n Title: ${title}`),
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);

      fs.unlinkSync(filePath);
    } else {
      await api.sendMessage(global.font(' Failed to fetch a Shoti video. Please try again later.'), threadID, messageID);
    }
  } catch (error) {
    console.error(error);

    if (sentMessage) {
      await api.unsendMessage(sentMessage.messageID);
    }

    await api.sendMessage(global.font(' An error occurred while fetching the Shoti video. Please try again later.'), threadID, messageID);
  }
};
