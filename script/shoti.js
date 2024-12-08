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
  credits: 'Developer',
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const filePath = path.join(__dirname, 'shoti.mp4');

  let sentMessage;

  try {
    sentMessage = await api.sendMessage(global.font('🔄 Fetching a random Shoti video. Please wait...'), threadID, messageID);

    const response = await axios.get('https://shoti.kenliejugarap.com/getvideo.php?apikey=shoti-0763839a3b9de35ae3da73816d087d57d1bbae9f8997d9ebd0da823850fb80917e69d239a7f7db34b4d139a5e3b02658ed26f49928e5ab40f57c9798c9ae7290c536d8378ea8b01399723aaf35f62fae7c58d08f04');

    if (sentMessage) {
      await api.unsendMessage(sentMessage.messageID);
    }

    if (response.data.status) {
      const videoUrl = response.data.videoDownloadLink;

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
        body: global.font('🎥 Here is your Shoti video:'),
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);

      fs.unlinkSync(filePath);
    } else {
      await api.sendMessage(global.font('Failed to fetch a Shoti video. Please try again later.'), threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    if (sentMessage) {
      await api.unsendMessage(sentMessage.messageID);
    }
    return api.sendMessage(global.font('An error occurred while fetching the Shoti video. Please try again later.'), threadID, messageID);
  }
};
