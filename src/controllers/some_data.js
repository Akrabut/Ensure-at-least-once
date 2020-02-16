const router = require('express').Router();
const SomeData = require('../models/some_data');
const redis = require('../redis/db_connector');
const { sendSingleData } = require('../services/unsent_data_handler');

router.get('/', async (req, res) => {
  try {
    const data = await SomeData.findAll({});
    res.json(data);
  } catch(err) {
    res.status(404).end();
  }
});

async function saveToSQL(req) {
  return SomeData.create({
    someData: req.body.someData,
    someOtherData: req.body.someOtherData,
  });
}

function saveToRedis(savedData) {
  // generate idemoptency key for instrumentation in client (to avoid duplicate api calls)
  // if scaling/system distribution were considerations here the key would be generated with something like "uniqid"
  // the keys have "to_send-" prefix to differentiate them from keys used by other imaginary developers in the company
  if (!redis.set(`to_send-${savedData.id}`, JSON.stringify(savedData))) throw new Error('RedisError');
}

router.post('/', async (req, res) => {
  try {
    if (!req.body.someData || !req.body.someOtherData) throw Error;
    // data is saved to the sql database
    const savedData = await saveToSQL(req, res);
    // data is saved to the redis database in case server crashes
    // this is the fastest database, so this is the fastest guarantee we can get for distributed systems
    // server can still crash between this two statements and data will not be sent
    saveToRedis(savedData);
    await sendSingleData(savedData);
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;