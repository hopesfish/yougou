var left = $(".profile span").attr("data-left"),
	data;

data = {
	'img': 'http://localhost:3001/images/bonus.jpg?mobile_build_version',
  	'link': window.location.href,
  	'desc': '我还差' + left + '元就能领200元礼品卡了，赶快来帮我集资!',
  	'title': '优购时尚商城'
};

wechat('timeline', data, function() {});
wechat('friend', data, function() {});

$().ready(function() {
	$(".help").click(function() {
		$(".mask").show();
	});

	$(".mask").click(function() {
		$(this).hide();
	});
});