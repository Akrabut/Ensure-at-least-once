const axios = require('axios');
const redis = require('../redis/db_connector');

async function sendSingleData(data) {
  try {
    await axios.post(process.env.WEBHOOK_URI, data);
    // the redis server is a list of unsent messages, so message is deleted after being sent
    redis.del(`to_send-${data.id}`);
  } catch(err) {
    throw new Error('WebhookError');
  }
}

function parseRedisData(id) {
  // wtf callbacks in 2020
  return new Promise(res => {
    redis.get(id, (err, rep) => res(JSON.parse(rep)));
  });
}

// this is a little sphagetti, but its either this or adding more questionable dependencies
async function sendMultipleData() {
  let cursor = '0';
  // keys with a "to_send-" prefix are objects that were saved but not sent
  redis.scan(cursor, 'MATCH', 'to_send-*', (err, rep) => {
    if(err) throw err;
    cursor = rep[0];
    if(cursor === '0') return;
    // for each key in redis DB, fetch value, send parsed value and delete pair from DB
    rep[1].forEach(async id => await sendSingleData(await parseRedisData(id)));
  });
}

module.exports = {
  sendSingleData,
  sendMultipleData,
}