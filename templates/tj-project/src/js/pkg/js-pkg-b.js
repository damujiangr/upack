require(['src/js/mod/mod-a', 'src/js/mod/mod-c'], function(modA, modC) {
  console.log("this is js-pkg-b.js");
});



//TODO 独立为模块
require(['src/mock/api']);

/**
 * 测试ajax请求
 */
require(function(){
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
  $(function(){
    req();
  });
});

/**
 * 测试随机数据
 */
require(["src/mock/test"],function(test){
  console.log("-------------");
  console.log(test.person);
  console.log(test.animal);
  console.log("-------------");
});
