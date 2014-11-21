$().ready(function() {
    $("#loginBtn").click(function() {
        if ($('#username').val() == '' || $("#password").val() == '') {
            alert('请输入账号和密码！');
            return;
        }
        var PATH = "";
        $.ajax({
            type: "POST",
            url: PATH + "/api/auth",
            dataType: 'json',
            data: { username: $('#username').val(), password: $("#password").val() }
         })
         .done(function(user) {
             $.cookie("wexuser", user.wexuser);
             $.cookie("wexkey", user.wexkey);
             $.cookie("wextoken", user.wextoken);

             window.location.href = "index.html";
         })
         .fail(function() {
             alert('抱歉，无法登录！');
         });
    });
});