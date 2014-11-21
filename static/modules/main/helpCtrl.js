/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('helpCtrl', ['$scope', '$routeParams', '$location', '$http',
        function($scope, $routeParams, $location, $http){
            $scope.help = {};

            var title = '', contents = [];
            switch($routeParams.type) {
            case 'about':
                title = '关于优购优惠券管理后台';
                contents.push("微笑（www.yougouwx.com)，是一个基于移动互联网的早期教育产品及服务平台。我们致力于用优秀的技术结合贴近需求的创意，为万千家庭及儿童创造更多愉快而科学的成长体验。");
                contents.push("优购优惠券管理后台是我们的核心产品。以微信为入口，我们为中国0-6岁早期教育机构提供完整的移动互联网业务解决方案，开创一种全新的园所文化和家校沟通方式，实现随时随地的家园连接，为儿童和家庭创建一种简单紧密的成长共享氛围。");
                contents.push("我们的团队中既有移动互联网领域经验丰富的产品及技术人员，也有早期教育领域深耕多年的一线专家顾问。我们将陆续应用最新的技术，工具，及平台，带给中国0-6岁早期教育市场前所未有、未曾体验过的创新产品及服务。");
            break;
            case 'register':
                title = '如何进行身份认证';
                contents.push("第一步：在公众账号里点击左下角键盘图标，出现输入框之后，回复手机号码（请确保此手机号码与你提供给幼儿园的手机号码一致）");
                contents.push("第二步：根据消息引导，上传你的头像照片（点击右侧“+”号后，再点击“照片”从相册里选择头像添加。家长用户请上传孩子的头像，方便老师辨识。");
                contents.push("第三步：点击“认证链接”后，输入预设密码（预设密码由本园老师直接发放给家长）后，完善和确认孩子的个人资料，包括选择孩子生日，父母身份等，点击“完成”即可完成认证。");
                contents.push('<img src="images/help/register.jpeg">');
            break;
            case 'read':
                title = "如何查看各种信息";
                contents.push('第一步：点击你想查看的菜单“本园生活”，“班级动态”或是“家园互动”。如果公众号当前出现的是输入框，请点击左下角键盘图标进行切换。');
                contents.push('第二步：点击菜单“班级动态”，可以分别查看留言板、班级相册儿童成长记录和本班课程计划。');
                contents.push('<img src="images/help/read1.jpeg">');
                contents.push('<img src="images/help/read2.jpeg">');
            break;
            case 'publish':
                title = "如何发布各种信息";
                
                contents.push('<strong>发布留言到留言板</strong>');
                contents.push('第一步：选择菜单“家园互动”-“发布留言” （点击左下角键盘图标可以随时切换菜单和输入框），会收到消息提示进一步操作。');
                contents.push('第二步：点击左下角键盘图标，出现输入框后，在输入框里直接输入你想对老师说的话。回复文字后会收到消息提示进一步操作。');
                contents.push('第三步：在输入框里输入数字“1”确认发布。输入“2”取消发布。');
                contents.push('第四步：消息上传成功后。根据消息提示中“点击查看”字样，进入留言板可以查看自己的发布留言和本班老师发布的留言。留言仅你和本班老师可见。');
                contents.push('<img src="images/help/message1.jpeg">');

                contents.push('<strong>发布照片到班级相册</strong>');
                contents.push('第一步：选择菜单“家园互动”-“发布照片”，会收到消息提示进一步操作。');
                contents.push('第二步：发布照片前需要为你所发布的照片添加主题。点击左下角键盘图标，输入照片主题文字。输入主题文字后会收到消息提示进一步操作。');
                contents.push('第三步：点击右下角“+”号后，点击照片，从相册中选择你要上传的照片。如你想回复多张照片可以从相册进行多选。');
                contents.push('第四步：图片上传成功后，根据消息引导，在输入框中回复“1”确认发布。输入“2”取消发布。');
                contents.push('第五步：点击消息提示中“点击查看”字样，跳转到班级相册查看你及本班其他家长和教师上传的照片。');
                contents.push('<img src="images/help/photo.jpeg">');
                
                contents.push('<strong>添加图片或文字到儿童成长记录</strong>');
                contents.push('第一步：选择菜单“家园互动”-“添加成长记录”，会收到消息提示进一步操作。');
                contents.push('第二步：点击左下角键盘图标之后，出现输入框，在输入框中回复“1”发布纯文字记录，回复“2”则是发布照片记录。（教师用户需要根据消息提示先选择本班一名儿童之后，再进行相关操作）');
                contents.push('第三步：选择输入之后再根据相关的信息提示，输入文字或是选择照片发布。发布照片需要先添加主题。');
                contents.push('第四步：输入文字或上传照片之后，在输入框中输入“1”确认发布。输入“2”取消发布。');
                contents.push('第五步：点击消息提示中“点击查看”字样，跳转到儿童成长记录查看教师及家长共同维护的记录主页。');
                contents.push('<img src="images/help/record.jpeg">');

                contents.push('<strong>如何简单快捷的请假？</strong>');
                contents.push('第一步：选择菜单“家园互动”-“我要请假”，会收到消息提示引导选择或输入请假开始日期。');
                contents.push('第二步：选择或输入请假开始日期之后，再会收到消息提示，输入请假天数。');
                contents.push('第三步：输入请假天数之后，根据消息提示选择请假事由并做具体说明。');
                contents.push('第四步：根据消息提示回复回复“1”确认提交，老师会及时收到消息推送提醒。');
                contents.push('<img src="images/help/leave.jpeg">');
            break;
            case 'profile':
                title = "如何修改资料并添加家长";

                contents.push('第一步：点击“个人中心”-“修改个人资料”或“修改密码');
                contents.push('第二步：点击自动回复的消息提示，进入相关的页面，进入相应的修改操作。');
                contents.push('第三步：如需修改个人头像，点击“个人中心”-“修改个人资料”之后，点击左下角键盘图标后，再点击右侧“+”后，点击照片，进入相册进行选择。');
                contents.push('第四步：如果爸爸妈妈都想使用，首先通过认证的爸爸或妈妈，可以通过点击“添加家长”，根据消息引导将没有通过认证一方的手机号添加进来。另外一方即可在对应的公众账号中完成认证。');
                contents.push('<img src="images/help/profile.jpeg">');
            break;
            case 'tips':
                title = "生活助手";

                contents.push('回复【天气】查看天气预报');
                contents.push('回复【交通】查看交通路况');
                contents.push('回复【儿歌】在线听儿歌');
            break;
            }
            contents.push('任何问题或建议，请发邮件到');
            contents.push('<a href="mailto:support@yougouwx.com">support@yougouwx.com</a>');

            $scope.help.title = ' - ' + title;
            $scope.help.content = '<div><p>' + contents.join("</p><p>") + '</p></div>';
        }]
    );
    }
});