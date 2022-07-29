const { arriveRulesServer } = require('../data');
const { noop } = require('../util');

module.exports = (server/* , options */) => {
  server.on('request', (req, res) => {
    const { ruleValue } = req.originalReq
    process.env.RULE_VALUE = ruleValue
    res.on('error', noop);
    arriveRulesServer(req, res);
    res.end();
  });
};
