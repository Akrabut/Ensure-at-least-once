const express = require('express');
require('dotenv').config();

const server = express();

server.use(require('helmet')());
server.use(require('cors')());
server.use(express.json());

require('./middlewares/middleware');

server.use('/api/some-data', require('./controllers/some_data'));

const { sendMultipleData } = require('./services/unsent_data_handler');
server.listen(process.env.PORT, async () => {
  // server sends all unsent data first thing after it starts
  // the redis database contains objects that were saved to the SQL DB but not sent
  await sendMultipleData();
  console.log(`Server running on port ${process.env.PORT}`);
});