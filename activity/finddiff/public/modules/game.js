$().ready(function() {
    // 根据屏幕宽度置顶样式
    var width = document.body.clientWidth,
        names = [
            '阿迪达斯',
            '新百伦',
            '耐克',
            '他她',
            '万斯',

            '匡威',
            '彪马',
            '拔佳',
            '森达',
            '百丽',

            '法鳄',
            '三叶草',
            '亚瑟士',
            '大嘴猴',
            '天美意',

            '奥卡索',
            '接吻猫',
            '百思图',
            '鬼冢虎',

            '莱尔斯丹',
        ], found = {}, voice = true;

    if (width <= 400) {
        $('#finddiff-set').show();
        $('#finddiff-set').click(function() {
            $(".set-img").hide();
            $(".loading-img").show();
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        });
        return;
    }

    var logos = $('.logo-wrap').children(),
        idx = 0,
        stages = [
            {theme: 'min-logo-wrap', total: 8, bonus: 1},
            {theme: 'min-logo-wrap', total: 8, bonus: 1},
            {theme: 'min-logo-wrap', total: 8, bonus: 1},
            {theme: 'min-logo-wrap', total: 8, bonus: 1},
            {theme: 'min-logo-wrap', total: 8, bonus: 1},

            {theme: 'mid-logo-wrap', total: 10, bonus: 1},
            {theme: 'mid-logo-wrap', total: 10, bonus: 1},
            {theme: 'mid-logo-wrap', total: 10, bonus: 1},
            {theme: 'mid-logo-wrap', total: 10, bonus: 1},
            {theme: 'mid-logo-wrap', total: 10, bonus: 1},

            {theme: 'max-logo-wrap', total: 12, bonus: 1},
            {theme: 'max-logo-wrap', total: 12, bonus: 1},
            {theme: 'max-logo-wrap', total: 12, bonus: 1},
            {theme: 'max-logo-wrap', total: 12, bonus: 1},
            {theme: 'max-logo-wrap', total: 12, bonus: 1},
        ],
        finds = [],
        find = 0,
        playing = false,
        bonus = 0,
        seconds = 30;

    if ($('#finddiff-game').size() > 0) {
        if (logos.length == 0) {
            alert('无Logo数据');
            return;
        }
        if (logos.length != names.length) {
            alert('Logo数据异常');
            return;
        }
    }

    // add event
    $('.logo-wrap').on('click', '.active', function(e){
        if (!playing) { return; }

        var element = $(e.currentTarget), voiceHandler;

        if (voiceHandler) {
            clearTimer(voiceHandler);
        }

        if (parseInt(element.attr('data-idx')) == find) {
            bonus += stages[idx].bonus;
            idx++;
            scene();
            if (voice) {
                $('#timeAudio')[0].pause();
                $('#rightAudio')[0].play();
                voiceHandler = setTimeout(function() {
                    $('#rightAudio')[0].pause();
                    $('#timeAudio')[0].play();
                }, 1000);
            }
        } else {
            $(".minus-seconds").css({
                left:element.position().left - 20,
                top:element.position().top
            }).addClass('fadeout');
        
            $(e.currentTarget).addClass('wrong');

            setTimeout(function() {
                $(".minus-seconds").removeClass('fadeout');
                $(e.currentTarget).removeClass('wrong');
            }, 1000);

            seconds -= 3;
            if (voice) {
                $('#timeAudio')[0].pause();
                $('#wrongAudio')[0].play();
                voiceHandler = setTimeout(function() {
                    $('#wrongAudio')[0].pause();
                    $('#timeAudio')[0].play();
                }, 1000);
            }
        }
    });
    

    function scene() {
        // next
        if (idx >= stages.length) {
            idx = stages.length - 1;
        }

        // reset
        $('.logo-wrap').removeClass('min-logo-wrap');
        $('.logo-wrap').removeClass('mid-logo-wrap');
        $('.logo-wrap').removeClass('max-logo-wrap');
        $('.logo-wrap .active').removeClass('active');
        finds = [];

        // init
        var len = names.length;
        var stage = stages[idx], token = parseInt(12345678 * Math.random()) + parseInt(87654321 * Math.random());
        var map = {}, foundIdx;
        for (var i=0; i<stage.total; i++) {
            var position = (token + i) % len;
            finds.push(position);
        }

        foundIdx = parseInt(finds.length * Math.random());
        // 不能重复
        if (found[foundIdx]) {
            for (var i=parseInt(foundIdx * Math.random()); i<finds.length; i++) {
                if (!found[foundIdx]) {
                    foundIdx = i;
                    break;
                }
            }
        }

        //console.info(finds);
        //console.info(found);
        found[foundIdx] = 'used';
        find = finds[foundIdx];

        // render
        $('.logo-wrap').addClass(stage.theme);
        for (var i=0; i<finds.length; i++) {
            $(logos[finds[i]]).addClass('active');
            $(logos[finds[i]]).attr('data-idx', finds[i]);
        }
        $('.logo-name-wrap span').text(names[find]);
    }

    function start() {
        if (voice) {
            $('#timeAudio')[0].play();
        }

        $('#finddiff-entry').hide();
        $('#finddiff-end').hide();

        $('.start').removeClass("layer-show").addClass("layer");
        $('.end').removeClass("layer-show").addClass("layer");
        $('#finddiff-game').show();

        // 开始游戏
        playing = true;

        idx = 0;

        // 生成场景
        scene();
        // 倒计时
        seconds = 30;
        // 总分
        bonus = 0;

        var timers = setInterval(function() {
            if (seconds <= 0) {
                playing = false;
                end();
                clearInterval(timers);
            } else {
                $('.remain-time .time').text(--seconds + '秒');
                $('.remain-time .bonus').text(bonus + '个');
                if (seconds < 10) {
                    $('.remain-time').addClass('remain-time-warning');
                }
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
            },
            error: function(xhr, type) {
                //alert('无法保存游戏分数！');
            }
        })
    }

    function end() {
        update();
        $('#finddiff-end .result-wrap span.result').text(bonus);
        $('#finddiff-entry').hide();
        $('#finddiff-game').hide();
        $('#finddiff-end').show();
        $('.remain-time .time').text('30秒');
        $('.remain-time .bonus').text('0个');
        setTimeout(function() {
            $('#wrongAudio')[0].pause();
            $('#rightAudio')[0].pause();
            $('#timeAudio')[0].pause();
        }, 1000);
    }

    $('#finddiff-voice').click(function() {
        if ($('#finddiff-voice').hasClass('disable')) {
            voice = true;
            $('#finddiff-voice').removeClass('disable');
            $('#wrongAudio')[0].pause();
            $('#rightAudio')[0].pause();
            $('#timeAudio')[0].play();
        } else {
            voice = false;
            $('#finddiff-voice').addClass('disable');
            $('#wrongAudio')[0].pause();
            $('#rightAudio')[0].pause();
            $('#timeAudio')[0].pause();
        }
    });

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
});