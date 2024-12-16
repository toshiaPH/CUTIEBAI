module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  aliases: ['info'],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: 'Marjhun Baylon',
};

module.exports.run = async function({ api, event, enableCommands, args, Utils, prefix }) {
  const input = args.join(' ');
  const hasprefix = prefix || '';

  try {
    const commands = enableCommands[0].commands;

    if (!input) {
      const pageSize = 20;
      let page = 1;
      let start = (page - 1) * pageSize;
      let end = start + pageSize;
      let helpMessage = `📋 | CMDS List: 〔${hasprefix || 'No Prefix'}〕\n`;
      helpMessage += `Total Commands: ${commands.length} 🏷️\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `${i + 1}. 「 ${hasprefix}${commands[i]} 」\n`;
      }

      helpMessage += `\nFor all commands, type "${hasprefix}help all"`;
      api.sendMessage(global.font(helpMessage), event.threadID, event.messageID);

    } else if (input.toLowerCase() === 'all') {
      let allCommandsMessage = `📋 | CMDS List: 〔${hasprefix || 'No Prefix'}〕\n`;
      allCommandsMessage += `Total Commands: ${commands.length} 🏷️\n\n`;

      commands.forEach((cmd, index) => {
        allCommandsMessage += `${index + 1}. 「 ${hasprefix}${cmd} 」\n`;
      });

      api.sendMessage(global.font(allCommandsMessage), event.threadID, event.messageID);

    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pageSize = 20;
      let start = (page - 1) * pageSize;
      let end = start + pageSize;

      if (start >= commands.length) {
        api.sendMessage(global.font("Page number is out of range."), event.threadID, event.messageID);
        return;
      }

      let helpMessage = `📋 | CMDS List: 〔${hasprefix || 'No Prefix'}〕\n`;
      helpMessage += `Total Commands: ${commands.length} 🏷️\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `${i + 1}. 「 ${hasprefix}${commands[i]} 」\n`;
      }

      helpMessage += `\nPage ${page} of ${Math.ceil(commands.length / pageSize)}`;
      api.sendMessage(global.font(helpMessage), event.threadID, event.messageID);

    } else {
      const command = commands.find(cmd => cmd.toLowerCase() === input.toLowerCase());
      if (command) {
        const { name, version, role, aliases = [], description, usage, credits, cooldown } = command;
        const roleMessage = role === 0 ? '➛ Permission: User' : role === 1 ? '➛ Permission: Admin' : '➛ Permission: Thread Admin';
        const message = `
          「 Command Info 」
          ➛ Name: ${name}
          ➛ Version: ${version || 'N/A'}
          ➛ ${roleMessage}
          ➛ Aliases: ${aliases.join(', ') || 'None'}
          ➛ Description: ${description || 'None'}
          ➛ Usage: ${usage || 'None'}
          ➛ Credits: ${credits || 'None'}
          ➛ Cooldown: ${cooldown || 'None'} seconds
        `;
        api.sendMessage(global.font(message), event.threadID, event.messageID);
      } else {
        api.sendMessage(global.font('Command not found.'), event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.error(error);
    api.sendMessage(global.font('An error occurred while processing the command.'), event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function({ api, event, prefix }) {
  const { threadID, messageID, body } = event;
  const message = prefix 
    ? `This is my prefix: ${prefix}` 
    : "Sorry, I don't have a prefix";

  if (body?.toLowerCase().startsWith('prefix')) {
    api.sendMessage(global.font(message), threadID, messageID);
  }
};
