$().ready(function() {
    var names = $('.logo-name-wrap').children(),
        logos = $('.logo-wrap').children(),
        idx = 0,
        stages = [
            {theme: 'max-logo-wrap', total: 5, bonus: 1},
            {theme: 'max-logo-wrap', total: 5, bonus: 1},
            {theme: 'max-logo-wrap', total: 5, bonus: 1},
            {theme: 'max-logo-wrap', total: 5, bonus: 1},
            {theme: 'max-logo-wrap', total: 5, bonus: 1},
            {theme: 'max-logo-wrap', total: 5, bonus: 1},
            {theme: 'medium-logo-wrap', total: 12, bonus: 3},
            {theme: 'medium-logo-wrap', total: 12, bonus: 3},
            {theme: 'medium-logo-wrap', total: 12, bonus: 3},
            {theme: 'medium-logo-wrap', total: 12, bonus: 3},
            {theme: 'medium-logo-wrap', total: 12, bonus: 3},
            {theme: 'medium-logo-wrap', total: 12, bonus: 3},
        ],
        finds = [],
        playing = false,
        bonus = 0;

    if (names.length != logos.length) {
        alert('初始化游戏失败！');
        return;
    }

    // add event
    $('.logo-wrap').on('click', '.active', function(e){
        if (parseInt($(e.currentTarget).attr('data-idx')) == finds[0]) {
            bonus += stages[idx].bonus;
            idx++;
            scene(); 
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
        for (var i=1; i<stage.total + 1; i++) {
            finds.push((token + i) % len);
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
        var seconds = 45;
        var timers = setInterval(function() {
            if (seconds <= 0) {
                clearInterval(timers);
                playing = false;
                update();
                end();
            } else {
                $('.remain-time').text('剩余时间：' + --seconds + '秒 金币数：' + bonus + '个');
            }
        }, 1000);
        $('.remain-time').text('剩余时间：' + seconds + '秒 金币数：' + bonus + '个');
    }
    //start();

    function update() {
        alert(bonus);
        $.ajax({
            type: 'GET',
            url: './' + $('#finddiff-game').attr('data-id') + '/bonus',
            data: { bonus: bonus, token: (new Date()).getTime() },
            dataType: 'text',
            success: function(data) {
                //window.location.reload();
            },
            error: function(xhr, type) {
                //alert('无法保存游戏分数！');
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