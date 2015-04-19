<?php
return array(

	'@post'=>array(
		'api/auth'=>'user/restauth',
		'api/user/<userId:[\d\w-]{36}?>'=>'user/restupdate',
		'api/activity'=>'activity/restcreate',
		'api/activity/<activityId:[\d\w-]{36}?>'=>'activity/restupdate',
		'api/activity/<activityId:[\d\w-]{36}?>/coupon'=>'coupon/restcreate',
		'api/activity/<activityId:[\d\w-]{36}?>/coupon/<couponId:[\d\w-]{36}?>'=>'coupon/restupdate',
		'api/autoreply'=>'autoreply/restcreate',
		'api/autoreply/<replyId:[\d\w-]{36}>'=>'autoreply/restupdate',

		'api/activity/finddiff/<finddiffId:[\d\w-]{36}?>'=>'finddiff/restupdate',
		'api/activity/finddiff/<finddiffId:[\d\w-]{36}?>/result'=>'finddiffResult/restcreate',

		'api/activity/wxgift/<wxgiftId:[\d\w-]{36}?>'=>'wxgift/restupdate',
		/*
		'api/activity/dream/<dreamId:[\d\w-]{36}?>'=>'dream/restupdate',
		'api/activity/dream/<dreamId:[\d\w-]{36}?>/vote'=>'vote/restcreate',

		'api/activity/xmas/<xmasId:[\d\w-]{36}?>'=>'xmas/restupdate',
		'api/activity/xmas/<xmasId:[\d\w-]{36}?>/vote'=>'xmasVote/restcreate',

		'api/activity/luckybag/<luckybagId:[\d\w-]{36}?>'=>'luckybag/restupdate',
		'api/activity/luckybag/<luckybagId:[\d\w-]{36}?>/actions/exchange'=>'luckybag/restexchange',
		'api/activity/luckybag/<luckybagId:[\d\w-]{36}?>/vote'=>'luckybagVote/restcreate',*/
	),

	'@get'=>array(
		'api/user'=>'user/restindex',
		'api/user/<id:[\d\w-]{36}?>'=>'user/restget',
		'api/activity'=>'activity/restindex',
		'api/activity/<id:[\d\w-]{36}?>'=>'activity/restget',
		'api/coupon'=>'coupon/restindex',
		'api/activity/<activityId:[\d\w-]{36}?>/coupon'=>'coupon/restindex',
		'api/activity/<activityId:[\d\w-]{36}?>/coupon/timeline'=>'coupon/resttimeline',
		'api/coupon/achieve'=>'coupon/restachieve',
		'api/autoreply'=>'autoreply/restlist',
		'api/autoreply/migrate'=>'autoreply/restmigrate',
		'api/autoreply/<replyId:[\d\w-]{36}?>'=>'autoreply/restget',

		'api/activity/finddiff'=>'finddiff/restlist',
        'api/activity/finddiff/rank'=>'finddiff/restrank',
        'api/activity/finddiff/<id:[\d\w-]{36}?>'=>'finddiff/restget',
        'api/activity/finddiff/start'=>'finddiff/reststart',
        'api/activity/finddiff/sort'=>'finddiff/restsort',
        'api/activity/finddiff/<finddiffId:[\d\w-]{36}?>/result'=>'finddiffResult/restlist',

        'api/activity/wxgift/<id:[\d\w-]{36}?>'=>'wxgift/restget',
        'api/activity/wxgift/start'=>'wxgift/reststart',

		/*
		'api/activity/dream'=>'dream/restlist',
		'api/activity/dream/rank'=>'dream/restrank',
		'api/activity/dream/<id:[\d\w-]{36}?>'=>'dream/restget',
		'api/activity/dream/start'=>'dream/reststart',
		'api/activity/dream/<dreamId:[\d\w-]{36}?>/vote'=>'vote/restlist',

		'api/activity/xmas'=>'xmas/restlist',
		'api/activity/xmas/rank'=>'xmas/restrank',
		'api/activity/xmas/<id:[\d\w-]{36}?>'=>'xmas/restget',
		'api/activity/xmas/start'=>'xmas/reststart',
		'api/activity/xmas/winner'=>'xmas/restwinner',
		'api/activity/xmas/<xmasId:[\d\w-]{36}?>/vote'=>'xmasVote/restlist',

		'api/activity/luckybag'=>'luckybag/restlist',
		'api/activity/luckybag/rank'=>'luckybag/restrank',
		'api/activity/luckybag/<id:[\d\w-]{36}?>'=>'luckybag/restget',
		'api/activity/luckybag/start'=>'luckybag/reststart',
		'api/activity/luckybag/<luckybagId:[\d\w-]{36}?>/vote'=>'luckybagVote/restlist',*/
	),


	'@delete'=>array(
		'api/user/<userId:[\d\w-]{36}?>'=>'user/restremove',
		'api/activity/<activityId:[\d\w-]{36}?>'=>'activity/restremove',
		'api/activity/<id:[\d\w-]{36}?>/coupon/<couponId:[\d\w-]{36}?>'=>'coupon/restremove',
		'api/autoreply/<replyId:[\d\w-]{36}?>'=>'autoreply/restremove',
	),
);
?>