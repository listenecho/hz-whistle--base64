
;(function() {
  function $(selector) {
    return document.querySelector(selector);
  }

  function onClick(elem, l) {
    elem.addEventListener('click', l);
  }

  var urlTab = $('#urlTab');
  var urlResult = $('#urlResult');
  var noop = function() {};

  function showJSON() {
    urlTab.className = 'active';
    urlResult.style.display = 'block';
  }

  showJSON();
  onClick(urlTab, showJSON);

  
  var wb = window.whistleBridge;
  var cgiOpts = {
    url: 'whistle.hz-parse-base64/hz-base64/base64',
    type: 'post',
    mode: 'cancel'
  };
  var getUrlJSON = wb.createRequest(cgiOpts);
  wb.addSessionActiveListener(function(item) {
    if (!item) {
      urlResult.innerHTML = '请选择抓包数据';
      return;
    }
    var loadJSON = function() {
      urlResult.innerHTML = '计算中...';
      urlResult.onclick = noop;
      getUrlJSON({ text: item.url }, function(data) {
        if (!data) {
          urlResult.onclick = loadJSON;
          urlResult.innerHTML = '请求失败，请点击<strong>重试</strong>！';
          return;
        }
        urlResult.innerHTML = data.json;
      });
    };
    loadJSON();
  });
})();
