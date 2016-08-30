require(['src/js/mod/mod-a', 'src/js/mod/mod-b', 'src/tmpl/tmpl-a'], function (modA, modB, tmplA) {
    console.log("this is js-pkg-a.js");
    console.log("this is js-pkg-a");
});

//TODO 这个需要自动插入
require(['src/mock/api']);

/**
 * 测试ajax请求
 */
require(function () {
    function req() {
        console.log("request");
        $.ajax({
            url: 'http://localhost:3000/mock/test.json',
            dataType: 'json',
            success: function (data) {
                console.log("success");
                console.log(JSON.stringify(data));
            },
            error: function () {
                console.error("error");
            }
        });
    }

    $(function () {
        req();
    });
});