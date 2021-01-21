$(function () {
    // 1.初始化  获取文章分类列表
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //赋值 渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')
    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    //4.为选择封面按钮 绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    //5.渲染文章封面
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        //如果用户不选则图片
        if (file == undefined) {
            return;
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    //6.设置按钮状态
    var state = '已发布'
    // $('#btnSave1').on('click', function () {
    //     state = '已发布'
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //7.发表文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //创建 FormData 对象
        var fd = new FormData($(this)[0]); //这里$(this)[0]叶可以写成this  都对 this就代指dom对象
        //添加按钮的状态
        fd.append('state', state)
        //生成2进制文件图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);// 查看fd    运用扩展运算符或者通过foreach循环查看
                // fd.forEach(function (value,key) {
                //     console.log(key,value);
                // })

                //!!! 发送 ajax  要在toBlob()函数里面！！！
                publishArticle(fd)

            })
    })

    //8.封装发布文章ajax
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意 如果是FormDate()传递数据 必须有两个false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你 发布文章成功")
                //通过location.href有个问题 就是跳转逃了文章列表 但是发表文章的默认行为没有跟着变化 
                // location.href = '/assets/article/art_list.html'
                //所以采用模仿人点击事件 从而达到跳转目的
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1500)
            }
        });
    }



})