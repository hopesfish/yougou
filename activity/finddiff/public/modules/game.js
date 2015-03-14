$().ready(function() {
    // 根据屏幕宽度置顶样式
    var width = document.body.clientWidth,
        TOTAL = {min: 5, max: 12};
    if (width < 380) {
        alert('请将手机设置成横屏模式！');
        window.location.reload();
        return;
    }
    alert(width);
    if (width <= 480) {
        TOTAL.min = 6;
        $(document.body).addClass("ip4");
    } else if (width >= 640) {
        TOTAL.min = 8;
        $(document.body).addClass("ip6");
    }

    var names = $('.logo-name-wrap').children(),
        logos = $('.logo-wrap').children(),
        idx = 0,
        stages = [
            {theme: 'max-logo-wrap', total: TOTAL.min, bonus: 1},
            /*{theme: 'max-logo-wrap', total: TOTAL.min, bonus: 1},
            {theme: 'max-logo-wrap', total: TOTAL.min, bonus: 1},
            {theme: 'max-logo-wrap', total: TOTAL.min, bonus: 1},
            {theme: 'max-logo-wrap', total: TOTAL.min, bonus: 1},
            {theme: 'max-logo-wrap', total: TOTAL.min, bonus: 1},*/
            //{theme: 'medium-logo-wrap', total: TOTAL.max, bonus: 3},
            //{theme: 'medium-logo-wrap', total: TOTAL.max, bonus: 3},
        ],
        finds = [],
        playing = false,
        bonus = 0,
        seconds = 45;

    if (names.length != logos.length) {
        alert('初始化游戏失败！');
        return;
    }

    // add event
    $('.logo-wrap').on('click', '.active', function(e){
        if (!playing) { return; }

        if (parseInt($(e.currentTarget).attr('data-idx')) == finds[0]) {
            bonus += stages[idx].bonus;
            idx++;
            scene(); 
        } else {
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
        $('.logo-name-wrap .active').removeClass('active');
        finds = [];

        // init
        var len = names.length;
        var stage = stages[idx], token = parseInt(12345678 * Math.random()) + parseInt(87654321 * Math.random());
        var map = {};
        for (var i=0; i<stage.total; i++) {
            var position = (token + parseInt(100 * Math.random())) % len;
            while(map[position]) {
                position++;
            }
            map[position] = 1;
            finds.push(position);
        }

        //console.info(finds);

        // render
        $('.logo-wrap').addClass(stage.theme);
        $(names[finds[0]]).addClass('active');
        for (var i=0; i<finds.length; i++) {
            $(logos[finds[i]]).addClass('active');
            $(logos[finds[i]]).attr('data-idx', finds[i]);
        }
    }

    function start() {
        $('#finddiff-entry').hide();
        $('.start').removeClass("layer-show").addClass("layer");
        $('.end').removeClass("layer-show").addClass("layer");
        $('#finddiff-game').show();

        // 开始游戏
        playing = true;
        // 生成场景
        scene();
        // 倒计时
        seconds = 45;
        var timers = setInterval(function() {
            if (seconds <= 0) {
                playing = false;
                update();
                end();
                clearInterval(timers);
            } else {
                $('.remain-time').text('剩余时间：' + --seconds + '秒 金币数：' + bonus + '个');
            }
        }, 1000);
        $('.remain-time').text('剩余时间：' + seconds + '秒 金币数：' + bonus + '个');
    }
    //start();

    function update() {
        

        $.ajax({
            type: 'GET',
            url: './' + $('#finddiff-game').attr('data-id') + '/bonus',
            data: { bonus: bonus, token: (new Date()).getTime() },
            dataType: 'text',
            success: function(data) {
                var best = parseInt($('.result-wrap .bonus').text()), msg = '';
                if (bonus > best) {
                    msg = '历史最好成绩：' + bonus + '个金币！！！';
                    $('.result-wrap .bonus').text(bonus);
                } else if (bonus > 0) {
                    msg = '本次只获得' + bonus + '个金币，请继续加油！'
                } else {
                    msg = '一句话：加油！'
                }
                alert(msg);
            },
            error: function(xhr, type) {
                alert('无法保存游戏分数！');
            }
        })
    }

    function end() {
        $('#finddiff-entry').show();
        $('.end').addClass("layer-show");
        $('#finddiff-game').hide();
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
});