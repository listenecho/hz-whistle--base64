layui.use('form', function(){
    var form = layui.form;
    //监听提交
    form.on('submit(formDemo)', function(data){
        fetch('hz-base64/event', {
            method: 'post'
        }).then(function(response) {
            response.json().then(res => {
                console.log(res);
            })
        }).catch(function(err) {
        });
      layer.msg(JSON.stringify(data.field));
      return false;
    });
  });