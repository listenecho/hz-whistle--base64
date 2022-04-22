

function JSONFormat() {
    var _toString = Object.prototype.toString;
    function format(object, indent_count){
        var html_fragment = '';
        switch(_typeof(object)){
            case 'Null' :0
                html_fragment = _format_null(object);
                break;
            case 'Boolean' :
                html_fragment = _format_boolean(object);
                break;
            case 'Number' :
                html_fragment = _format_number(object);
                break;
            case 'String' :
                //replace blank to html blank to display in html.
                object  = object.replace(/ /g,"&nbsp;");
                html_fragment = _format_string(object);
                break;
            case 'Array' :
                html_fragment = _format_array(object, indent_count);
                break;
            case 'Object' :
                if(object instanceof BigNumber){
                    html_fragment = _format_number(object.toFixed());
                }else{
                    html_fragment = _format_object(object, indent_count);
                }
                html_fragment = _format_object(object, indent_count)
                break;
        }
        return html_fragment;
    };

    function _format_null(object){
        return '<span class="json_null" contenteditable="true">null</span>';
    }

    function _format_boolean(object){
        return '<span class="json_boolean" contenteditable="true">' + object + '</span>';
    }

    function _format_number(object){
        return '<span class="json_number" contenteditable="true">' + object + '</span>';
    }

    function _format_string(object){
        object = object.replace(/\</g,"&lt;");
        object = object.replace(/\>/g,"&gt;");
        if(0 <= object.search(/^http/)){
            object = '<a href="' + object + '" target="_blank" class="json_link">' + object + '</a>'
        }
        return '<span class="json_string" contenteditable="true">"' + object + '"</span>';
    }

    function _format_array(object, indent_count){
        var tmp_array = [];
        for(var i = 0, size = object.length; i < size; ++i){
            tmp_array.push(indent_tab(indent_count) + format(object[i], indent_count + 1));
        }
        return '<span data-type="array" data-size="' + tmp_array.length + '"><i  style="cursor:pointer;" class="fa fa-minus-square-o" onclick="hide(this)"></i>[<br/>'
            + tmp_array.join(',<br/>')
            + '<br/>' + indent_tab(indent_count - 1) + ']</span>';
    }

    function _format_object(object, indent_count){
        var tmp_array = [];
        for(var key in object){
            let highLightKey = ""
            if(["_page_visit_id", "_pv_id", "_title", "_ev_dt_f_i", "_event_duration_from_in"].includes(key)) {
                highLightKey = "highLightKey"
            }
            tmp_array.push( indent_tab(indent_count) + `<span class="json_key ${highLightKey}" contenteditable="true">${key}</span>:` +  format(object[key], indent_count + 1));
        }
        return '<span  data-type="object"><i  style="cursor:pointer;" class="fa fa-minus-square-o" onclick="hide(this)"></i>{<br/>'
            + tmp_array.join(',<br/>')
            + '<br/>' + indent_tab(indent_count - 1) + '}</span>';
    }

    function indent_tab(indent_count){
        return (new Array(indent_count + 1)).join('&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    function _typeof(object){
        var tf = typeof object,
            ts = _toString.call(object);
        return null === object ? 'Null' :
            'undefined' == tf ? 'Undefined'   :
                'boolean' == tf ? 'Boolean'   :
                    'number' == tf ? 'Number'   :
                        'string' == tf ? 'String'   :
                            '[object Function]' == ts ? 'Function' :
                                '[object Array]' == ts ? 'Array' :
                                    '[object Date]' == ts ? 'Date' : 'Object';
    };
    var _JSONFormat = function(origin_data){
        // this.data = origin_data ? origin_data :
        //     JSON && JSON.parse ? JSON.parse(origin_data) : eval('(' + origin_data + ')');
        let stringedJSON = origin_data.replace(/([^\\]\"):\s*(\[)?([-+Ee0-9.]+)/g, '$1: $2"jsondotcnprefix$3"');
        try {
            var temp = JSON.parse(stringedJSON, (key, value) => {
                // only changing strings
                if (typeof value !== 'string') return value;
                // only changing number strings
                if (!value.startsWith('jsondotcnprefix')) return value;
                // chop off the prefix
                value = value.slice('jsondotcnprefix'.length);
                // pick your favorite arbitrary-precision library
                return new BigNumber(value).toNumber();
            });
            this.data = temp;
        } catch (e) {
            this.data = JSON.parse(origin_data);
            console.log(e);
        } finally {

        }
    };

    _JSONFormat.prototype = {
        constructor : JSONFormat,
        toString : function(){
            return format(this.data, 1);
        }
    }

    return _JSONFormat;
}


