require(['src/js/mod/mod-a', 'src/js/mod/mod-b', 'src/tmpl/tmpl-a'], function(modA, modB, tmplA) {
  console.log("this is js-pkg-a.js");
  console.log("this is js-pkg-a");
  function req() {
    console.log("request");
      $.ajax({
          url: 'http://localhost:3000/mock/test.js',
          dataType: 'json',
          success: function(data) {
              console.log("success");
              console.log(JSON.stringify(data));
          },
          error: function() {
              console.error("error");
          }
      });
  }
  // req();
});

//TODO 这个需要自动插入
