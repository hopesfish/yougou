var left = $(".profile span").attr("data-left"),
	data;

data = {
	'img': 'http://localhost:3001/images/bonus.jpg?mobile_build_version',
  	'link': window.location.href,
  	'desc': '快来帮我装扮优购圣诞礼物树！',
  	'title': ''
};

wechat('timeline', data, function() {});
wechat('friend', data, function() {});
wechat('showOptionMenu', function() {});  

$().ready(function() {
	$(".help").click(function() {
		$(".mask").show();
	});

	$(".mask").click(function() {
		$(this).hide();
	});
});