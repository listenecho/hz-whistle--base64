const { arriveStatsServer } = require('../data');
const { noop } = require('../util');

module.exports = (server/* , options */) => {
  server.on('request', (req, res) => {
    res.on('error', noop);
    arriveStatsServer(req, res);
    res.end();
  });
};
