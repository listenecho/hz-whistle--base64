const { arriveResStatsServer } = require('../data');
const { noop } = require('../util');

module.exports = (server/* , options */) => {
  server.on('request', (req, res) => {
    res.on('error', noop);
    arriveResStatsServer(req, res);
    res.end();
  });
};

