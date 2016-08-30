/**
 * Created by ramboyan on 16/8/26.
 */
define(['node_modules/mockjs/dist/mock'], function (Mock) {
    //测试URL
    return {
        "person": Mock.mock({
            'name': '@name',
            'age|1-100': 100,
            'color': '@color'
        }),
        "animal": Mock.mock({
            'name': '@name',
            'age|1-100': 100,
            'color': '@color'
        })
}
});