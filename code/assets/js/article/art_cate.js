$(function () {
    //1.初始化  获取文章分类列表数据  
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                console.log(res);
                //模板引擎  传对象  用属性
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        });
    }

    //2.为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-add').html()
        });
    })
    //因为 当点击了添加按钮  才会生成弹出框 所以不能直接给form添加submit事件
    //3.所以通过代理的形式  为form_add 表单添加绑定 submit 事件
    var layer = layui.layer
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                //判断状态码
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //因为我们添加成功了  所以得重新渲染页面
                initArtCateList();
                layui.layer.msg('恭喜你 添加文章成功')
                layer.close(indexAdd)
            }
        });
    })

    //4.显示修改form表单
    var indexEdit = null;
    var form = layui.form
    $('tbody').on('click', '.btn_edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //赋值
                form.val('form_edit', res.data)
            }
        });


    })

    //4.1 修改 提交
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //因为我们更新成功了 所以要重新渲染页面中的数据
                initArtCateList();
                layer.msg('恭喜你,文章类别更改成功');
                layer.close(indexEdit)
            }
        });
    })

    //5  通过代理的形式 为删除按钮添加绑定事件
    $('tbody').on('click', '.btn_delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //因为我们更新成功了  所有要重新渲染页面数据
                    initArtCateList();
                    layer.msg('恭喜您 文章类别删除成功');
                    layer.close(index)
                }
            });
        });

    })


})