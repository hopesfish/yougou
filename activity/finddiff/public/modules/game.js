$().ready(function() {
    function start() {
        $('#finddiff-entry').hide();
        $('.start').removeClass("layer-show").addClass("layer");
        $('.end').removeClass("layer-show").addClass("layer");
        $('#finddiff-game').show();

        setTimeout(function() {
            update();
            end();
        }, 3000);
    }

    function update() {
        $.ajax({
            type: 'GET',
            url: './' + $('#finddiff-game').attr('data-id') + '/bonus',
            data: { bonus: '10', token: (new Date()).getTime() },
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