function screenshots(domId) {
    html2canvas(document.querySelector("#" + domId), {
        allowTaint: true,
        height: $("#" + domId).outerHeight() + 150
    }).then(function(canvas) {
        //生成base64图片数据
        var type = 'png';
        var imgData = canvas.toDataURL(type);
        var _fixType = function(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
        };
        // 加工image data，替换mime type
        imgData = imgData.replace(_fixType(type), 'image/octet-stream');
        var saveFile = function(data, filename) {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        };
        // 下载后的图片名
        var filename = (new Date()).getTime() + '.' + type;
        saveFile(imgData, filename);
    });
}