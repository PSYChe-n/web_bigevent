$(function(){
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  var indexAdd = null // 给弹出层一个索引 后续方便利用这个索引关闭弹出层
  $('#btnAddCate').on('click', function() {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  // 因为一开始 页面上是没有form-add表单的 是经过点击事件后渲染过去的 所以只能给页面上有的元素添加点击事件 进行委托
  $('body').on('submit', '#form-add', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })

    // 通过代理的形式，为 btn-edit (编辑) 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
     // 弹出一个修改文章分类信息的层
     indexEdit = layer.open({
       type: 1,
       area: ['500px', '250px'],
       title: '修改文章分类',
       content: $('#dialog-edit').html()
     })

    // 通过自定义属性data-id 获取到这个类别在服务器上的id 在请求时发送id 就能获取其对应的数据
     var id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
      $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,  // '/my/article/cates/:id' 可以直接+冒号后面的字段
        success: function(res) {
          form.val('form-edit', res.data)
        }
      })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
     $('body').on('submit', '#form-edit', function(e) {
       e.preventDefault()
       $.ajax({
         method: 'POST',
         url: '/my/article/updatecate',
         data: $(this).serialize(),
         success: function(res) {
           if (res.status !== 0) {
             return layer.msg('更新分类数据失败！')
           }
           layer.msg('更新分类数据成功！')
           layer.close(indexEdit)
           initArtCateList()
         }
       })
     })

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function() {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })

})