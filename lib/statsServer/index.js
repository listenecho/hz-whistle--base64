module.exports = (server, options) => {

    // options 同上，initial.js的options是同一个对象
    server.on('request', (req, res) => {
      const oReq = req.originalReq;
      const oRes = req.originalRes;
 
    //   req.clientIp: 请求的客户端IP，注意：挂在req里面
 
    //   oReq.id: 请求的ID，每个请求对应一个唯一的ID
    //   oReq.headers: 请求的原始headers，而req.headers包含了一些插件自定义字段
    //   oReq.ruleValue: 配置的规则值， 如：whistle.xxx://ruleValue
    //   oReq.url: 请求的完整url
    //   oReq.realUrl: 请求的真实url，一般为空
    //   oReq.method: 请求方法
    //   oReq.clientPort: 请求的客户端端口
    //   oReq.globalValue: pattern @globalValue
    //   oReq.proxyValue: 配置的代理规则，一般为空
    //   oReq.pacValue: 配置的pac规则，一般为空
 
    //   oRes.serverIp: 服务端IP，只有在server或resServer、resStatsServer才能获取到
    //   oRes.statusCode: 响应状态码，同 oRes.serverIp
 
      // 获取抓包数据，不需要等待响应完成
      req.getReqSession((s) => {
        const { url } = s;
        let data = getQueryParam(url, "data")
        console.log(data, 44);
        if(!data) return
          data = JSON.parse(base64decode(data))
          const { _event, _e } = data
          console.log(_event, _e, s);
        if (!s && _event === "_web_stay") {
            s.id = null
        }
        console.log(s, 454545);
      })
      // 获取完整的抓包数据，要等待响应完成
      req.getSession((s) => {
        // 如果设置了 enable://hide 会获取到空数据
        if (!s) {
          return;
        }
        res.send()
        // do sth
      })
      // 获取WebSocket或Socket请求的帧数据列表
      // 返回 1~16 个帧数据
      req.getFrames((list) => {
        // 如果为空表示该长连接已断开
        if (!list) {
          return;
        }
        // do sth
      })
    });
  };