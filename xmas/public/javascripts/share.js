var data, url = $(".gifts").attr("data-url");

data = {
	'img': 'http://localhost:3001/images/bonus.jpg?mobile_build_version',
  	'link': url,
  	'desc': '亲~快来参与优购圣诞活动，帮我点亮圣诞树！我要赢优购200元礼品卡和大嘴猴/LEEcooper的精美奖品啦！',
  	'title': ''
};

wechat('timeline', data, function() {});
wechat('friend', data, function() {});
wechat('showOptionMenu', function() {});  

$().ready(function() {
    var jump = false;
    if ($(".prompt").size() == 0) { jump = true; }

	$("body").click(function() {
      if (jump) {
        $(".progress").show();
        window.location.href = $(".link").attr("href");
      } else {
        $(".prompt-overlay").show();
      }
	});

	$(".prompt-overlay").click(function(e) {
		$(this).hide();
        e.stopPropagation();
	});
});