
const options = require('./options');
const noop = () => {};
const getHeader = (req, name, res) => {
  const value = req.headers[name];
    if(name === options.STATUS_CODE_HEADER) {
      return res.statusCode
    }
  return value ? decodeURIComponent(value) : '';
};

exports.noop = noop;
exports.getReqId = (req, res) => getHeader(req, options.REQ_ID_HEADER, res);
exports.getRuleValue = (req, res) => getHeader(req, options.RULE_VALUE_HEADER, res);
exports.getFullUrl = (req, res) => getHeader(req, options.FULL_URL_HEADER, res);
exports.getRealUrl = (req, res) => getHeader(req, options.REAL_URL_HEADER, res);
exports.getMethod = (req, res) => getHeader(req, options.METHOD_HEADER, res);
exports.getClientIp = (req, res) => getHeader(req, options.CLIENT_IP_HEADER, res) || '127.0.0.1';
exports.getServerIp = (req, res) => getHeader(req, options.HOST_IP_HEADER, res);
exports.getStatusCode = (req, res) => getHeader(req, options.STATUS_CODE_HEADER, res);


