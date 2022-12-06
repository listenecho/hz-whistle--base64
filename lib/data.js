const util = require('./util');

let reqIdList = [];
const reqData = {};
const MAX_BUF_SIZE = 600;
const MIN_BUF_SIZE = 500;
const COUNT = 50;

const updateStatus = (req, serverName, res) => {
  const reqId = util.getReqId(req, res);
  let item = reqData[reqId];
  if (!item) {
    item = {
      reqId,
      method: util.getMethod(req),
      url: util.getFullUrl(req),
      clientIp: util.getClientIp(req),
      ruleValue: util.getRuleValue(req),
      servers: {},
    };
    reqData[reqId] = item;
    reqIdList.push(reqId);
    let len = reqIdList.length;
    if (len > MAX_BUF_SIZE) {
      len -= MIN_BUF_SIZE;
      const removedIds = reqIdList.slice(0, len);
      removedIds.forEach(id => delete reqData[id]);
      reqIdList = reqIdList.slice(len);
    }
  }
  item.servers[serverName] = 1;
  item.statusCode = util.getStatusCode(req, res);
  item.serverIp = util.getServerIp(req, res);
};

exports.arriveStatsServer =  (req, res) => updateStatus(req, 'statsServer', res);
exports.arriveResStatsServer =  (req, res) => updateStatus(req, 'resStatsServer', res);
exports.arriveRulesServer =  (req, res) => updateStatus(req, 'rulesServer', res);
exports.arriveServer = (req, res) => updateStatus(req,  'server', res);
exports.arriveResRulesServer = (req, res) => updateStatus(req, 'resRulesServer', res);
exports.arriveTunnelRulesServer = (req, res) => updateStatus(req, 'tunnelRulesServer', res);
exports.arriveTunnelServer = (req, res) => updateStatus(req, 'tunnelServer', res);

exports.getReqList = (startReqId, count) => {
  count = count > 0 ? count : COUNT;
  let index = 0;
  if (startReqId) {
    index = reqIdList.indexOf(startReqId) + 1;
  } else {
    index = Math.max(0, reqIdList.length - count);
  }
  const result = reqIdList.slice(index, index + count);
  return result.map(id => {
    if (reqData[id] && !reqData[id].isSend) {
      reqData[id] && (reqData[id].isSend = true)
      return reqData[id]
    }
  }
  ).filter(_ => !!_);

};
