const axios = require('axios');
const config = {
  baseURL: 'https://akhiro-rest-api.onrender.com/api/nglspam',
  params: {
    u: '',
    q: '',
    a: ''
  }
};

module.exports = {
  name: 'nglspam',
  onStart: async function (client, message, args) {
    try {
      const response = await axios.get(config);
      message.reply(response.data.result);
    } catch (error) {
      message.reply('An error occurred while making the request.');
    }
  }
};
