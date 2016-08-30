/**
 * 用于拦截ajax请求的数据
 */
define(['node_modules/mockjs/dist/mock'], function(Mock) {
    console.log("mock ing");
    console.log(Mock);
    //测试URL
    Mock.mock('/mock/test.json', {
        'name': '@name',
        'age|1-100': 100,
        'color': '@color'
    });
});
