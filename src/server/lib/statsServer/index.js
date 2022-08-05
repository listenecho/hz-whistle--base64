const { arriveStatsServer } = require('../data');
const { noop } = require('../util');
const events = require("../events")

module.exports = (server/* , options */) => {
  server.on('request', (req, res) => {
    const { ruleValue } = req.originalReq
    process.env.RULE_VALUE = ruleValue
    events.setSecretKey(ruleValue)
    res.on('error', noop);
    arriveStatsServer(req, res);
    res.end();
  });
};