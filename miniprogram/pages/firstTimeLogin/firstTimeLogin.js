// miniprogram/pages/firstTimeLogin.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/unknowenUserAva.jpeg',
    nickName: '请点击授权登录',
    userInfo: null,
    logged: false,
    community: '选择您所在的小区',
    communityChosen: false
  },
  //获取用户信息
  getUserProfile(e){
    wx.getUserProfile({
      desc: '用于注册保存用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        if (res.userInfo){
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            logged: true
          })
          this.onGetOpenid()
        }
      }
    })
  },

//调用云函数进行静默注册

  onGetOpenid: function() {
    var that = this
    wx.showLoading({
      title: '渡渡鸟正在加载',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'signIn',
      data: {
        avatarUrl: that.data.avatarUrl,
        nickName: that.data.nickName,
        creatingNewUser: true
      },
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          that.setData({
            logged: true
          })
          that.data.userInfo = res.result.data.user
          app.globalData.userInfo = res.result.data.user
        } else {
          wx.showModal({
            title: '抱歉，出错了',
            content: res.result.errMsg,
            confirmText: "我知道了",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail: err => {
        console.error('[云函数] [wechat_sign] 调用失败', err)
        wx.showModal({
          title: '调用失败',
          content: '请检查云函数是否已部署',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  enter:function(e){
    var that = this
    if (that.data.logged == true && that.data.communityChosen == true){
      wx.switchTab({
        url: '../front/front',
      })
    }else{
      wx.showModal({
        title: '还差一步',
        content: '请先授权登录并选择所在社区',
        showCancel: false,
      })
    }
    
  },

  selectCommunity:function(e){
    var that = this
    if (that.data.logged == true){
      wx.navigateTo({
        url: '../searchCommunity/searchCommunity',
      })
    }else{
      wx.showModal({
        title: '别着急',
        content: '请先授权登录',
        showCancel: false,
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})