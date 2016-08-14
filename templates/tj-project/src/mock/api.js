/**
 * 用于拦截ajax请求的数据
 */
require(['mock'], function(Mock) {
    console.log("mock ing");
    console.log(Mock);
    //测试URL
    Mock.mock('http://localhost:3000/mock/test.js', {
        'name': '@name',
        'age|1-100': 100,
        'color': '@color'
    });
});
