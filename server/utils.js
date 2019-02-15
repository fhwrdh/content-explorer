const R = require('ramda');
const format = require('date-fns/format');

const DEBUG = true;
const debug = args =>
  DEBUG &&
  console.log.apply(console, [format(Date.now(), 'YYYY.MM.DD.HH:mm:SS'), args]);
const mapIndex = R.addIndex(R.map);

module.exports = {
  debug,
  mapIndex,
};
