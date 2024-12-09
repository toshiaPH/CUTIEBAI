module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  aliases: ['info'],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: 'Developer',
};

module.exports.run = async function({ api, event, enableCommands, args, Utils, prefix }) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    
    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `📋 | ${global.font('𝖢𝖬𝖣𝖲 𝖫𝗂𝗌𝗍')}: 〔${prefix}〕\n`;
      helpMessage += `𝖳𝗈𝗍𝖺𝗅 ${global.font('𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌')}: ${commands.length}🏷️\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `${global.font(`\t${i + 1}. 「 ${prefix}${commands[i]} 」`)}\n`;
      }

      helpMessage += `\n${global.font('𝖥𝗈𝗋 𝖺𝗅𝗅 𝖼𝗆𝖽𝗌, 𝗍𝗒𝗉𝖾 "𝗁𝖾𝗅𝗉 𝖺𝗅𝗅"')}`;
      api.sendMessage(global.font(helpMessage), event.threadID, event.messageID);

    } else if (input.toLowerCase() === 'all') {
      let allCommandsMessage = `📋 | ${global.font('𝖢𝖬𝖣𝖲 𝖫𝗂𝗌𝗍')}: 〔${prefix}〕\n`;
      allCommandsMessage += `𝖳𝗈𝗍𝖺𝗅 ${global.font('𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌')}: ${commands.length}🏷️\n\n`;

      commands.forEach((cmd, index) => {
        allCommandsMessage += `${global.font(`\t${index + 1}. 「 ${prefix}${cmd} 」`)}\n`;
      });

      api.sendMessage(global.font(allCommandsMessage), event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `📋 | ${global.font('𝖢𝖬𝖣𝖲 𝖫𝗂𝗌𝗍')}: 〔${prefix}〕\n`;
      helpMessage += `𝖳𝗈𝗍𝖺𝗅 ${global.font('𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌')}: ${commands.length}🏷️\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `${global.font(`\t${i + 1}. 「 ${prefix}${commands[i]} 」`)}\n`;
      }

      helpMessage += `\nPage ${page} of ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(global.font(helpMessage), event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input.toLowerCase()))?.[1];
      if (command) {
        const { name, version, role, aliases = [], description, usage, credits, cooldown } = command;
        const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: user' : (role === 1 ? '➛ Permission: admin' : (role === 2 ? '➛ Permission: thread Admin' : ''))) : '';
        const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = description ? `Description: ${description}\n` : '';
        const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
        const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
        const versionMessage = version ? `➛ Version: ${version}\n` : '';
        const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';
        const message = ` 「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(global.font(message), event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.handleEvent = async function({ api, event, prefix }) {
  const { threadID, messageID, body } = event;
  const message = prefix ? 'This is my prefix: ' + prefix : "Sorry, I don't have a prefix";
  if (body?.toLowerCase().startsWith('prefix')) {
    api.sendMessage(global.font(message), threadID, messageID);
  }
};
