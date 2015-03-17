$().ready(function() {
    // 根据屏幕宽度置顶样式
    var width = document.body.clientWidth,
        TOTAL = {min: 5, max: 12};
    if (width < 480 && $('#finddiff-entry').size() > 0) {
        window.location.href = $('#finddiff-entry').attr('data-set');
        return;
    }
    if (width >= 640) {
        TOTAL.min = 8;
        $(document.body).addClass("ip6");
    } else {
        TOTAL.min = 6;
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
        find = 0,
        playing = false,
        bonus = 0,
        seconds = 30;

    if (names.length == 0 || logos.length == 0) {
        return;
    }
    //console.info(names.length);
    //console.info(logos.length);
    if (names.length != logos.length) {
        alert('初始化游戏失败！');
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
        $('.logo-name-wrap .active').removeClass('active');
        finds = [];

        // init
        var len = names.length;
        var stage = stages[idx], token = parseInt(12345678 * Math.random()) + parseInt(87654321 * Math.random());
        var map = {};
        for (var i=0; i<stage.total; i++) {
            var position = (token + i*3) % len;
            finds.push(position);
        }

        //console.info(finds);
        find = finds[parseInt(finds.length * Math.random())];

        // render
        $('.logo-wrap').addClass(stage.theme);
        $(names[find]).addClass('active');
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
        seconds = 30;
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
                    //msg = '历史最好成绩：' + bonus + '个金币！！！';
                    $('.result-wrap .bonus').text(bonus);
                }
                $('#finddiff-last .result').text(bonus);
                $('#finddiff-last').show();
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