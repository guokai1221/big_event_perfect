// 入口函数
$(function () {
    // 1.定义密码规则(3个)
    var form = layui.form;
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        //1.1所有密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //1.2新密码 新密码和旧密码不能一样
        samePwd: function (value) {
            if (value == $('[name=oldPwd').val()) {
                return '新密码和旧密码不能相同~'
            }
        },
        //1.3确认密码 两次新密码必须相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次新密码输入不一致"
            }
        }
    });

    //修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改密码成功')
                //重置表单
                $('.layui-form')[0].reset();
            }
        });
    })
})