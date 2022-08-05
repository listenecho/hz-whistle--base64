
// 解析路由参数
const getQueryParam = function(urlP: string, paramP: string) {
    let param = paramP.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    param = param.replace("$", "\\$");
    let url = decodeURIComponent(urlP);
    var regexS = "[\\?&]" + param + "=([^&#]*)",
      regex = new RegExp(regexS),
      results = regex.exec(url);
    if (
      results === null ||
      //@ts-ignore
      (results && typeof results[1] !== "string" && results[1].length)
    ) {
      return "";
    }
    return decodeURIComponent(results[1]);
  };


 export const base64decode = function (str: string)  {
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

export const resloveEventData = (data: any[]) => {
    if (!Array.isArray(data)) return []
    const newData = data.filter(item => {
        if (item.url && item.url.indexOf("data=") !== -1) {
            const base64 = getQueryParam(item.url, "data")
            const ext = getQueryParam(item.url, "ext")
            const decodeBase64Json = JSON.parse(base64decode(base64))
            const decodeBase64 = base64decode(base64)
            const properties = decodeBase64Json.properties || {}

            item.json = decodeBase64Json || {}
            item.ext = ext
            item.event = decodeBase64Json._event || decodeBase64Json._e
            item.pvId = properties._page_visit_id || decodeBase64Json._pv_id
            item.title = properties._title || decodeBase64Json._title
            item.url = properties._url || decodeBase64Json._url
            item.pathname = properties._url_path || decodeBase64Json._url_p
            item.lib = decodeBase64Json._lib || (decodeBase64Json.lib ? decodeBase64Json.lib._lib : "-")
            item.jsonString = decodeBase64
            return item
        }

    })
   return newData
}