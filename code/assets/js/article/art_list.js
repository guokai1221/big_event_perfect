$(function () {

    //为art-template 定义时间过滤除器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var layer = layui.layer
    // 1.定义一个查询的参数对象   将来请求数据的时候需要将请求参数对象提交到服务器    
    var q = {
        pagenum: 1, //页面值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类id
        state: '',  //文章的状态 可选择 已发布 草稿
    }

    // 2.渲染文章列表
    initTable();
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用分页
                randerPage(res.total)
            }
        });
    }

    //渲染筛选区域
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通过layui 重新渲染表单区域的ui结构
                form.render()
            }
        });
    }

    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })

    //分页
    var laypage = layui.laypage;
    function randerPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示的条数。
            curr: q.pagenum, //当前页面值
            limits: [2, 3, 5, 70],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //触发jump回调的方式有两种
            //1.点击页码的时候 会触发  
            //2.只要调用了 laypage.render()方法 就会触发jump回调
            //可以通过first的值 来判断是通过哪种方式 触发jump回调
            // 如果first 的值为true  证明是方式2触发的  否则为方式1触发
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //把最新的页码值 赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                //把最新的每页显示数据条数 赋值到q这个查询参数对象中
                q.pagesize = obj.limit
                //根据最新的q 获取对应的数据列表 并渲染表格
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

    //通过代理的形式 为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //判断删除按钮的个数  从而知道当前页面数据是否被删除完
        var len = $('.btn-delete').length
        //获取到文章的id
        var id = $(this).attr('data-id')
        //询问用户是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' },
            function (index) {
                //do something
                $.ajax({
                    type: "GET",
                    url: "/my/article/delete/" + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg('删除数据成功')
                        //当数据删除完成后 先判断当前页这一页中 是否还有剩余的数据
                        //如果没有剩余的数据 则让页码值 -1 后 再调用initTable方法
                        if (len === 1) {
                            //如果 len 的值等于1 证明删除完毕之后 当前页面上没有任何数据
                            //页码值最小必须是1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable();
                        layer.close(index);
                    }
                });
            });
    })

})