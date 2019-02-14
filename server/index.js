const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const { buildTranslations } = require('./translations');

const PORT = 4000;

const start = async () => {
  console.log('Gathering data...');
  const translations = await buildTranslations(axios.get);
  console.log('translations.length: ', translations.length);

  const app = express();
  app.use(morgan('tiny'));
  app.use('/ok', (req, res) => res.sendStatus(200));
  app.use('/translations', (req, res) => res.send(translations));
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

start();
