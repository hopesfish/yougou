$().ready(function() {
    // 根据屏幕宽度置顶样式
    var width = document.body.clientWidth,
        names = [
            '阿迪达斯',
            '新百伦',
            '耐克',
            '他她',
            '范斯',

            '匡威',
            '彪马',
            '拔佳',
            '森达',
            '百丽',

            '鳄鱼',
            '三叶草',
            '亚瑟士',
            '大嘴猴',
            '天美意',

            '奥卡索',
            '思加图',
            '接吻猫',
            '百思图',
            '鬼冢虎',

            '莱尔斯丹',
        ];

    if (width && width < 360 && $('#finddiff-entry').size() > 0) {
        $('#finddiff-set').show();
        $('#finddiff-set').click(function() {
            window.location.reload();
        });
        return;
    }

    var logos = $('.logo-wrap').children(),
        idx = 0,
        stages = [
            {theme: 'max-logo-wrap', total: 8, bonus: 1},
        ],
        finds = [],
        find = 0,
        playing = false,
        bonus = 0,
        seconds = 30;

    if (logos.length == 0) {
        alert('无Logo数据');
        return;
    }
    if (logos.length != names.length) {
        alert('Logo数据异常');
        return;
    }

    // add event
    $('.logo-wrap').on('click', '.active', function(e){
        if (!playing) { return; }

        var element = $(e.currentTarget);


        if (parseInt(element.attr('data-idx')) == find) {
            bonus += stages[idx].bonus;
            idx++;
            scene(); 
        } else {
            $(".minus-seconds").css({
                left:element.position().left + 60,
                top:element.position().top + 30
            }).addClass('fadeout');
            setTimeout(function() {
                $(".minus-seconds").removeClass('fadeout');
            }, 1000);
            $(e.currentTarget).addClass('wrong');
            seconds -= 3;
        }
    });
    

    function scene() {
        // next
        if (idx >= stages.length) {
            idx = stages.length - 1;
        }

        // reset
        $('.logo-wrap').removeClass('max-logo-wrap');
        $('.logo-wrap .active').removeClass('active');
        finds = [];

        // init
        var len = names.length;
        var stage = stages[idx], token = parseInt(12345678 * Math.random()) + parseInt(87654321 * Math.random());
        var map = {};
        for (var i=0; i<stage.total; i++) {
            var position = (token + i) % len;
            finds.push(position);
        }

        //console.info(finds);
        find = finds[parseInt(finds.length * Math.random(), 10)];

        // render
        for (var i=0; i<finds.length; i++) {
            $(logos[finds[i]]).addClass('active');
            $(logos[finds[i]]).attr('data-idx', finds[i]);
        }
        $('.logo-name-wrap span').text(names[find]);
    }

    function start() {
        $('#finddiff-entry').hide();
        $('#finddiff-end').hide();

        $('.start').removeClass("layer-show").addClass("layer");
        $('.end').removeClass("layer-show").addClass("layer");
        $('#finddiff-game').show();

        // 开始游戏
        playing = true;
        // 生成场景
        scene();
        // 倒计时
        seconds = 30;
        var timers = setInterval(function() {
            if (seconds <= 0) {
                playing = false;
                update();
                end();
                clearInterval(timers);
            } else {
                $('.remain-time').text('剩余时间：' + --seconds + '秒 金币数：' + bonus + '个');
                $('#finddiff-end .result-wrap span').text(bonus);
            }
        }, 1000);
    }

    function update() {
        $.ajax({
            type: 'GET',
            url: './' + $('#finddiff-game').attr('data-id') + '/bonus',
            data: { bonus: bonus, token: (new Date()).getTime() },
            dataType: 'text',
            success: function(data) {
                $('.remain-time').text('剩余时间：' + seconds + '秒 金币数：' + bonus + '个');
                setTimeout(function() {
                    $('#finddiff-last').hide();
                }, 3000);
            },
            error: function(xhr, type) {
                alert('无法保存游戏分数！');
            }
        })
    }

    function end() {
        $('#finddiff-entry').hide();
        $('#finddiff-game').hide();
        $('#finddiff-end').show();
    }

    $('.start-btn').click(function() {
        start();
    });

    $('.restart-btn').click(function() {
        start();
    });

    $('.share-btn').click(function() {
        $("#finddiff-mask").show();
    });
    $("#finddiff-mask").click(function() {
        $(this).hide();
    });

    $('#finddiff-game').hide();
    $('#finddiff-end').hide();
});