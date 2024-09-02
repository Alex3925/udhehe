global.GoatBot.commands.add({
  name: 'remini',
  description: 'Convert a link into a remini-style image',
  onStart: async (message, args) => {
    const url = args[0];
    if (!url.startsWith('http')) {
      message.reply('Please provide a valid URL.');
      return;
    }

    try {
      // Replace the API endpoint and parameters with those for the remini service
      const response = await fetch(`https://markdevs-last-api-a4sm.onrender.com/api/remini?input=${url}`);
      const data = await response.json();

      // Process the response and send the result
      const result = data.output;
      message.reply(`Here is the remini-style image: ${result}`);
    } catch (error) {
      message.reply(`Error: ${error.message}`);
    }
  },
});
