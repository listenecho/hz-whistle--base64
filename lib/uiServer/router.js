const getReqList = require('../get-list')
const JSONFormat = require("./jquery.json")
const forge = require('node-forge')
const { AES,  } = require("crypto-js")
const events = require("../events")
const UTF8 = require("crypto-js/enc-utf8");
const ECB = require("crypto-js/mode-ecb")
const Pkcs7 = require("crypto-js/pad-pkcs7")
const getQueryParam = function(urlP, paramP) {
  let param = paramP.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  param = param.replace("$", "\\$");
  let url = decodeURIComponent(urlP);
  var regexS = "[\\?&]" + param + "=([^&#]*)",
    regex = new RegExp(regexS),
    results = regex.exec(url);
  if (
    results === null ||
    (results && typeof results[1] !== "string" && results[1].length)
  ) { 
    return "";
  } 
  return decodeURIComponent(results[1]);
};

const base64decode = function (str)  {
  var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
	var bc = str.replace(/=/g,'').split(""), y, z, c, b, bs='';
	for(y in bc){
		c = '';
		for(z in base64Chars){
			if(bc[y]==base64Chars[z]){
				c = z;
				break;
			}
		}
		if(c == '') return '编码有误';
		b = Number(c).toString(2);
		if(b.length<6){
			b = ('00000'+b).slice(-6)
		}
		bs += b 
	}
	var j = Math.floor(bs.length/8), i, ha='', hb;
	for(i=0;i<j;i++){
		hb = parseInt(bs.slice(i*8,i*8+8),2).toString(16);
		if(hb.length<2) hb=('00'+hb).slice(-2);
		ha += '%'+hb;
	}
	return decodeURIComponent(ha)
}

const formatData = function(content) {
  let result = '';
  if (content != '') {
      try {
          result = new JSONFormat(content, 4).toString();
      } catch (e) {
          result = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
      }
     
  } else {
      result = '<span style="color: #f1592a;font-weight:bold;">' + "数据有误" + '</span>';
  }
  return result
}

  /**
   * 非堆成加密解密报文
   * @param {string} data
   * @returns
   */
const decryptRSA = (encrypted, privateKey) => {
  if(!privateKey || !encrypted) return
    try {
      const private = `-----BEGIN PRIVATE KEY-----${privateKey}-----END PRIVATE KEY-----`;
      // 设置私钥
      const privateK = forge.pki.privateKeyFromPem(private)
      return privateK.decrypt(forge.util.decode64(encrypted))
    } catch (e) {
      console.error("beidou decryptRSA", e);
    }
  }

  /**
   * 对称加密解码报文
   * @param {string} encrypted
   * @param {string} secretKey
   * @returns
   */
   function decrypt(encrypted, secretKey) {
    if(!encrypted || !secretKey) return
    try {
      var key = UTF8.parse(secretKey);
      const bytes = AES.decrypt(encrypted, key, {
        mode:ECB,
        padding:Pkcs7
      });
      return  UTF8.stringify(bytes).toString()
    } catch (e) {
      console.error("beidou decrypt", e);
    }
  }

module.exports = (router) => {
  router.post('/hz-base64/base64', (ctx) => {
    const { text, method, poastData } = ctx.request.body;
    let data = {}
    if(method.toUpperCase() == "POST") {
      const baseData = decodeURIComponent(base64decode(poastData).match(/data=(\S*)\&/)[1])
      data = baseData
    } else {
      data = getQueryParam(text, "data")
    }
    let deData = base64decode(data)
    let deDataParse = JSON.parse(deData)
    const {_epwd, _edata}  = deDataParse
    try {
      if(_epwd && _edata ) {
        const publicKey = decryptRSA(_epwd, events.getSecretKey())
        if(publicKey) {
          deDataParse._edata = JSON.parse(decrypt(_edata, publicKey))
          deData = JSON.stringify(deDataParse)
        }
      }
    } catch (e) {
      deData = "解密功能出错!"
      console.log("解密功能出错!", e);
    }
    ctx.body = {json: formatData(deData) };
  });
  router.get('/cgi-bin/list', getReqList);
};

