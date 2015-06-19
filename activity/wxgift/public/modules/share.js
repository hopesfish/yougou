var apiElement = $("#jsApi");

wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: apiElement.attr('appId'), // 必填，公众号的唯一标识
    timestamp: apiElement.attr('timestamp'), // 必填，生成签名的时间戳
    nonceStr: apiElement.attr('nonceStr'), // 必填，生成签名的随机串
    signature: apiElement.attr('signature'),// 必填，签名，见附录1
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.ready(function(){

    wx.onMenuShareTimeline({
        title: '分享本内容至朋友圈，即可获赠优购（←全国最大的鞋服电商平台）送出的30元礼品卡！', // 分享标题
        link: $("#share-link").attr('url'), // 分享链接
        imgUrl: 'http://weixin.yougou.com/activity/wxgift/share.png', // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            onShared();
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            alert('亲~分享到朋友圈才能领礼品卡哦！');
        }
    });

    wx.onMenuShareAppMessage({
        title: '优购送您30元礼品卡啦！', // 分享标题 优购给您发新年红包啦！
        desc: '分享本内容至朋友圈，即可获赠优购（←全国最大的鞋服电商平台）送出的30元礼品卡！', // 分享描述
        link: $("#share-link").attr('url'), // 分享链接
        imgUrl: 'http://weixin.yougou.com/activity/wxgift/share.png', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
            // 用户确认分享后执行的回调函数
            //onShared();
            alert('亲~分享到朋友圈才能领礼品卡哦！');
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            alert('亲~分享到朋友圈才能领礼品卡哦！');
        }
    });
});
wx.error(function(res){
    //alert(res.message || '签名过期！');
});

function onShared() {
    // 用户确认分享后执行的回调函数
    $('.redbag-wrap').hide();
    $('.progress-wrap').show();

    joinQuene();
}

function onGot(data) {
    $('.redbag-wrap').show();
    $('.got-wrap').show();
    $('.progress-wrap').hide();
    $('.code').text(data.code);
}

function onRunout() {
    $('.redbag-wrap').show();
    $('.runout-wrap').show();
    $('.progress-wrap').hide();
}

function joinQuene() {
    var joinUrl = $('#join-link').attr('url');
    $.ajax({
        url: joinUrl,
        dataType: 'json',
        success: function(data) {}
    });
}

function checkProgress() {
    var progressUrl = $('#progress-link').attr('url');
    $.ajax({
        url: progressUrl,
        dataType: 'json',
        success: function(data) {
            if (data.shared === '1') {
                onGot(data);
            } else if (data.shared === '2') {
                onRunout();
            } else {
                setTimeout(function() {
                    checkProgress();
                }, 4000);
            }
        }
    });
}
// onRunout();
// onShared();
checkProgress();