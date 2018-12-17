/**
 * 图片中插入特征标签
 * @author zhujinrun
 * @since 2018-10-10 10:00
 */
(function($){

    var area = null;

    var builder = {
        debug: function(o){
            if (window.console && window.console.log){
                console.log(o);
            }
        },
        fire: function(key, elem, opts){
            if (typeof key == 'string') {
                if (this[key]){
                    return this[key](elem, opts);
                }else{
                    this.debug('function [' + key + '] undefined');
                }
            }
        },
        /**
         * 初始化插件
         * @param elem img 元素
         */
        init: function(elem){
            // TODO:页面刷新时需不需要进行初始化？若不进行初始化，下次加载结果依然会存在。
            //localStorage.setItem('labelArr', '[]');
            if ($(elem).parent('.kbs-label-area').length==0){
                $(elem).wrap('<div class="kbs-label-area"></div>');
                area = $(elem).parent('.kbs-label-area');
                builder.debug('image-label plugins initialized.');
                //面板监听
                //area.on({
                //    'drop': function (e) {
                //        builder.debug('image-label drop...');
                //        e.preventDefault();
                //        e.stopPropagation();
                //        var dataTransfer = e.dataTransfer || e.originalEvent.dataTransfer;
                //        var data = dataTransfer.getData("Text");
                //        if (data!='kbs-drag-active') return false;
                //        var _label = $('.' + data);
                //        _label.css({
                //            left: e.clientX || e.originalEvent.clientX,
                //            top: e.offsetY || e.originalEvent.clientY
                //        })
                //        _label.attr('_top', e.offsetY || e.originalEvent.clientY);
                //        _label.attr('_left', e.clientX || e.originalEvent.clientX);
                //        $(this).append($('.' + data));
                //        $('.' + data).removeClass('kbs-drag-active');
                //    },
                //    //'dragover': function (e) {
                //    //    e.preventDefault();
                //    //}
                //});
                ////面板标签监听
                //area.on('dragstart', '.kbs-label', function (e) {
                //    builder.debug('image-label dragstart...');
                //    var _this = this;
                //    $(_this).addClass('kbs-drag-active');
                //    var dataTransfer = e.dataTransfer || e.originalEvent.dataTransfer;
                //    dataTransfer.setData("Text", 'kbs-drag-active');
                //});
                area.on('dblclick', '.kbs-label', function(e){
                    var _this = this;
                    if (window.confirm('确定要删除当前标记吗?')){
                        $(this).remove();
                    }
                });
            }
        },
        /**
         * 加载 json
         * @param arr [{"text":"主队","index":"1","top":"139","left":"778"},{"text":"客队","index":"2","top":"98","left":"483"}]
         */
        loadData: function(elem, opts){
            $(opts.data).each(function(i, item){
                var _labelHtml = '<div _index="' + item.index + '" class="kbs-label kbs-label-arrow kbs-label-arrow-left kbs-label-black kbs-label-' + item.index +  '" draggable="true" style="top:' + item.top + 'px;left:' + item.left + 'px" _top="' + item.top + '" _left="' + item.left + '">' + item.text + '</div>';
                area.append(_labelHtml);
            });
        },
        /**
         * 获取标签，返回 json arr
         */
        getData: function(){
            var _arr = [];
            var _labelArr = area.find('.kbs-label');
            $(_labelArr).each(function(i, _label){
                var _json = {};               
                _json.text = $(_label).html();
                _json.index = $(_label).attr('_index');
                _json.top = $(_label).attr('_top');
                _json.left = $(_label).attr('_left');
                _arr.push(_json);
            });
            return _arr;
        },
        create_text: function(elem, opts){
            var _ind = area.find('.kbs-label').length;
            _ind++;
            var _top = $(elem).get(0).offsetTop + 10 + _ind * 20;
            var _left = $(elem).get(0).offsetLeft + 30;
            opts = $.extend({
                text: '标记',
                top: _top,
                left: _left
            }, opts);
            var _class = 'kbs-label-' + _ind;
            var _text = opts.text;
            var _labelHtml = '<div _index="' + _ind + '" class="kbs-label kbs-label-arrow kbs-label-arrow-left kbs-label-black ' + _class +  '" draggable="true">' + _text + '</div>';
            area.append(_labelHtml);
            var _label = area.find('.' + _class);
            _label.css({
                top: opts.top,
                left: opts.left
            });
            _label.attr('_top', opts.top);
            _label.attr('_left', opts.left);
        },
        create_icon: function (elem, opts) {
            var _ind = area.find('.kbs-label').length;
            _ind++;
            var _top = $(elem).get(0).offsetTop + 10 + _ind * 30;
            var _left = $(elem).get(0).offsetLeft + 30;
            opts = $.extend({
                text: './icons/xfx.png',
                top: _top,
                left: _left
            }, opts);
            var _class = 'kbs-label-' + _ind;
            var _text = opts.text;
            // TODO: 图片是否加上黑色背景
            var _labelHtml = '<div _index="' + _ind + '" class="kbs-label kbs-label-arrow kbs-label-arrow-left kbs-label-black ' + _class +  '" draggable="true"><img src="' + _text + '" alt="icon"></div>';
            //var _labelHtml = '<div _index="' + _ind + '" class="kbs-label ' + _class +  '" draggable="true"><img src="' + _text + '" alt="icon"></div>';
            area.append(_labelHtml).drag();
            var _label = area.find('.' + _class);
            _label.css({
                cursor: 'move',
                top: opts.top,
                left: opts.left
            });
            _label.attr('_top', opts.top);
            _label.attr('_left', opts.left);            
        },
        hide: function(elem, opts){
            area.find('.kbs-label').hide();
        },
        show: function(elem, opts){
            area.find('.kbs-label').show();
        },
        clear: function(elem, opts){
            var _labelArr = area.find('.kbs-label');
            if (_labelArr.length > 0){
                if (window.confirm('确定要删除全部标记吗?')){
                    $(_labelArr).each(function(i, _label){
                        //console.log(_label);
                        $(_label).remove();
                    });
                }
            }    
        }
    }


    $.fn.extend({
        /**
         *
         * @param key
         * @param opts
         */
        imageLabel: function(key, opts){
            var _this = this;
            if (key==undefined || typeof key!='string'){
                builder.init(_this);
            }else{
                if ($(_this).parent('.kbs-label-area').length==0) builder.init(_this);
                return builder.fire(key, _this, opts);
            }
        }
    });

    // 定义拖拽函数
    $.fn.drag = function () {

        var $this = $(this);
        var parent = $this.parent();

        var pw = parent.width();
        var ph = parent.height();
        var thisWidth = $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);
        var thisHeight = $this.height() + parseInt($this.css('padding-top'), 10) + parseInt($this.css('padding-bottom'), 10);

        var x, y, positionX, positionY;
        var isDown = false;

        var randY = parseInt(Math.random() * (ph - thisHeight), 10);
        var randX = parseInt(Math.random() * (pw - thisWidth), 10);


        parent.css({
            "position": "relative",
            "overflow": "hidden"
        });

        $this.css({
            "cursor": "move",
            "position": "absolute"
        }).css({
            top: randY,
            left: randX
        }).mousedown(function (e) {
            parent.children().css({
                "zIndex": "0"
            });
            $this.css({
                "zIndex": "1"
            });
            isDown = true;
            x = e.pageX;
            y = e.pageY;
            positionX = $this.position().left;
            positionY = $this.position().top;
            return false;
        });


        $(document).mouseup(function (e) {
            isDown = false;
        }).mousemove(function (e) {
            var xPage = e.pageX;
            var moveX = positionX + xPage - x;

            var yPage = e.pageY;
            var moveY = positionY + yPage - y;

            if (isDown == true) {
                $this.css({
                    "left": moveX,
                    "top": moveY
                });
            } else {
                return;
            }
            if (moveX < 0) {
                $this.css({
                    "left": "0"
                });
            }
            if (moveX > (pw - thisWidth)) {
                $this.css({
                    "left": pw - thisWidth
                });
            }
            if (moveY < 0) {
                $this.css({
                    "top": "0"
                });
            }
            if (moveY > (ph - thisHeight)) {
                $this.css({
                    "top": ph - thisHeight
                });
            }
        });
    };

})(jQuery);