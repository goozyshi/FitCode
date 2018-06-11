var fitNullTip = {
  tipText: '暂无健身记录',
}
const app = getApp()
// pages/index/index.js
Page({
  data: {
    fit_record: [],
    fit_lx:null,
    show: 'fit_record',
    nullTip: fitNullTip,
    male_banner:"https://api.zlcatwu.com/static/万用-男-个人页.png",
    female_banner: "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-101755.jpg",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },


  /*登录 */
  userLogin:function() {
    /**登录到服务器 */
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          // --------- 发送凭证 ------------------
          wx.request({
            url: 'https://api.zlcatwu.com/api/token?code='+code,
            header: {
              "content-type": "json"
            },
            success: function (res) {
              console.log('用户登录成功')
              }
          })
          // ------------------------------------
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    });
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'lx',
      success: function(res) {
       that.setData({
          fit_lx :res.data
       })
      },
    })
    wx.getStorage({
      key: 'fit_record',
      success: function(res) {
        that.setData({
          fit_record: res.data,
        })
        console.log(res.data)
        wx.removeStorage({
          key: 'fit_record',
          success: function(res) {},
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
     
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    var that =this
    var key
    /**授权后预加载 */
    wx.showLoading({
      title: '图片加载较慢',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2500);

    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    
  },
  //回看器材详情
  viewDeviceDetial:function(e){
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/detail/detail?id='+data.id,
    })
  },
  //二维码扫码
  scanQR:function(){

    wx.scanCode({
      onlyFromCamera: false,
     success: (res) => {
      console.log(res);
      var deviceid = res.result;
      wx.navigateTo({
        url: '/pages/detail/detail?id='+deviceid,
      })
      } 
    })
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        if (gender == 1) {
          var mygender = '1'
          wx.setStorageSync('Sex', mygender)
          console.log('我是男')
        }
        else if (gender == 2) {
          var mygender = '2'
          wx.setStorageSync('Sex', mygender)
          console.log('我是女')
        }
      }
    })
  }
})