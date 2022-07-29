const { arriveResStatsServer } = require('../data');
const { noop } = require('../util');
const events = require("../events")

module.exports = (server/* , options */) => {
  server.on('request', (req, res) => {
    res.on('error', noop);
    const { ruleValue } = req.originalReq
    process.env.RULE_VALUE = ruleValue
    console.log("ruleValue", ruleValue);
    events.setSecretKey(ruleValue)
    arriveResStatsServer(req, res);
    res.end();
  });
};

