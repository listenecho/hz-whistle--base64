const { getQueryParam,  base64decode} = require('../../utils')

module.exports = (server, options ) => {
    server.on('request', (req, res) => {
      const { fullUrl } = req.originalReq;
      let data = getQueryParam(fullUrl, "data")
      if(!data) return
        data = JSON.parse(base64decode(data))
        const { _event, _e,  } = data
       
        if(_event === "_web_stay") {
          req.originalReq.id = null
          console.log(_event, _e, );
          res.end(`https://wxtest.life.cntaiping.com/beidou/collect excludeFilter://`);
        } else {
        }
    });
  };