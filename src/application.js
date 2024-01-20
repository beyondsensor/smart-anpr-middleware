const axios = require('axios');
const fs = require('fs'); // Node.js built-in module for file system operations

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'http://admin:abcde12345@192.168.0.101/ISAPI/Event/notification/alertStream',
  headers: {}
};

axios.request(config)
  .then((response) => {

    const outputStream = fs.createWriteStream('output.txt'); // Replace 'output.txt' with your desired file name
    response.data.pipe(outputStream);

    // Optionally, you can listen to events for more control
    response.data.on('data', chunk => {
      console.log('Received a chunk of data:', chunk);
    });

    response.data.on('end', () => {
      console.log('Stream ended');
    });

    response.data.on('error', err => {
      console.error('Error in stream:', err);
    });
  })
  .catch((error) => {
    console.log(error);
  });
