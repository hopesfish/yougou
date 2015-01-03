var left = $(".profile span").attr("data-left"),
	data;

data = {
	'img': 'http://localhost:3001/images/bonus.jpg?mobile_build_version',
  	'link': window.location.href,
  	'desc': '我还差' + left + '元就能领取200元购物卡了！可购买Nike/Adidas/新百伦/百丽/思加图/天美意/TATA等你来选购！',
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