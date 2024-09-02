const goatbot = require('goatbot');

class TempMailCommand extends goatbot.Command {
  constructor() {
    super({
      name: 'tempmail',
      version: '1.0.0',
      role: 0,
      hasPrefix: true,
      description: 'Generate a temporary email or check its inbox.',
      usage: 'tempmail [create | inbox email]',
      credits: 'Lorex',
      cooldown: 3,
    });
  }

  async run(api, event, args) {
    const subCommand = args[0];

    if (subCommand === 'create') {
      try {
        const tempEmail = await this.generateTempEmail();
        api.sendMessage(`Temporary email created\n\n${tempEmail}`, event.threadID, event.messageID);
      } catch (error) {
        api.sendMessage(error.message, event.threadID, event.messageID);
        console.error(error);
      }
    } else if (subCommand === 'inbox') {
      const email = args[1];

      if (!email) {
        api.sendMessage('Please provide an email to check its inbox.', event.threadID, event.messageID);
        return;
      }

      try {
        const inboxMessages = await this.getInbox(email);
        let inboxText = 'Inbox Messages: 📬\n\n';

        inboxMessages.forEach(message => {
          inboxText += `📩 Sender: ${message.from}\n📨 Subject: ${message.subject}\n📝 Message: ${message.body}\n\n
