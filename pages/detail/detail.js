Page({

  /**
   * 页面的初始数据
   */
  data: {
    mygender:1,
    fit_record:[],
    showMethod: false,
    showLoading: true,
    showContent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mygender =wx.getStorageSync('Sex')
    this.setData({
      mygender:mygender
    })
    var that = this
    var id = options.id  

    // 存储浏览历史

    var fit_record = []

    var data= []

    wx.request({
      url: 'https://api.zlcatwu.com/api/devices/'+options.id,
      success: function (res) {
        that.setData({
          showLoading: false,
          showContent: true
        })
        console.log('请求返回')
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            devicemsg: res.data
          })
        }
        var fit_history = res.data
        console.log('----缓存健身历史----')
        wx.setStorage({
          key: 'fit_record',
          data: fit_history,
          success: function (res) {
            console.log('----缓存成功----')
          }
        })

        wx.getStorage({
          key: 'fit_record',
          success: function (res) {
            console.log('----获取缓存----')
            console.log(fit_history)
            // 当前的数据
            var now_data = {
              data: res.data
            }
            // 今天的数据，没有时插入
            var sub_data = {
                history: []
            }
            sub_data.history.push(now_data)      
            if (fit_record.length == 0) { // 判断是否为空
              fit_record.push(sub_data)
              console.log('----插入数据成功----')
            }
          },
          fail: function (res) {
            console.log('----获取失败----')
            console.log(res)
          }
        })
        /**动态标题 */
          wx.setNavigationBarTitle({
              title: res.data.name, 
          })
       
      }
    })
  },
  //返回查看记录
  viewRecord:function(e){
    //lx：锻炼类型
    var lx = e.currentTarget.dataset.id
    console.log(lx)
    wx.setStorage({
      key: 'lx',
      data: lx,
    })
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  showMe:function(){
    var that = this
    that.setData({
      showMethod:true
    })
  }
})
