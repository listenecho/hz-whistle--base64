// 解析路由参数
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
  
  
  // base64解析
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
  
    // 格式化数据
    const formatData = function(content) {
      let result = '';
      if (content != '') {
          try {
              var _JSONFormat = JSONFormat()
             
              result =  new _JSONFormat(content, 4).toString();
          } catch (e) {
              result = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
          }
         
      } else {
          result = '<span style="color: #f1592a;font-weight:bold;">' + "数据有误" + '</span>';
      }
      return result
    }