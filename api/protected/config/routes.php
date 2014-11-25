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
		'api/autoreply/<replyId:\d+>'=>'autoreply/restupdate',
		'api/activity/dream/<dreamId:[\d\w-]{36}?>'=>'dream/restupdate',
		'api/activity/dream/<dreamId:[\d\w-]{36}?>/vote'=>'vote/restcreate',
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
		'api/activity/dream'=>'dream/restlist',
		'api/activity/dream/<id:[\d\w-]{36}?>'=>'dream/restget',
		'api/activity/dream/start'=>'dream/reststart',
	),


	'@delete'=>array(
		'api/user/<userId:[\d\w-]{36}?>'=>'user/restremove',
		'api/activity/<activityId:[\d\w-]{36}?>'=>'activity/restremove',
		'api/activity/<id:[\d\w-]{36}?>/coupon/<couponId:[\d\w-]{36}?>'=>'coupon/restremove',
		'api/autoreply/<replyId:[\d\w-]{36}?>'=>'autoreply/restremove',
	),
);
?>