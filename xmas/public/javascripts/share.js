var data, url = $(".gifts").attr("data-url");

data = {
	'img': 'http://localhost:3001/images/bonus.jpg?mobile_build_version',
  	'link': url,
  	'desc': '亲~快来帮我点亮圣诞树！我要赢优购200元礼品卡和耐克/阿迪达斯/大嘴猴的奖品啦！',
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