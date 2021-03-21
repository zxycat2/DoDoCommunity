// miniprogram/pages/front.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    functions: [
      {icon:'../../images/stas.png', path:'/pages/vote/vote', name:'社区投票'},
      {icon:'../../images/phone.png', path:'/pages/searchCommunity/searchCommunity', name:'常用联系'},
      {icon:'../../images/file.png', path:'/pages/searchCommunity/searchCommunity', name:'设备报修'},
      {icon:'../../images/mail.png', path:'/pages/searchCommunity/searchCommunity', name:'意见反馈'}
    ],
    logged: false,
    avatarUrl: '../../images/unknowenUserAva.jpeg', 
    nickName: '登录中',
    community: '正在加载社区',
    is_admin: false,

    firstAnnTitle: '暂无公告',
    firstAnnContent: '等会再来看看吧',
    annIconSrc: '../../images/announcement.png',
    noAnn: false
  },


  redirectToSearchCommunity:function(arg){
    wx.navigateTo({url:'../searchCommunity/searchCommunity'})
  },

  onFirst(){
    var that = this
    if (that.data.noAnn){
      wx.showModal({
        title: '暂时还没有通知哦',
        confirmText: "我知道了",
        showCancel: false,
      })
    }else{
      wx.navigateTo({
        url: '../announcementDetail/announcementDetail',
        success: res => {
          res.eventChannel.emit(
            'detailData', {data: app.globalData.allAnnouncement[app.globalData.allAnnouncement.length - 1]}
          )
        }
      })
    }
  },

  onMore(){
    var that = this
    if (that.data.noAnn){
      wx.showModal({
        title: '暂时还没有通知哦',
        confirmText: "我知道了",
        showCancel: false,
      })
    }else{
      wx.navigateTo({
        url: '../announcement/announcement'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      noAnn: false
    })
    // 调用云函数
    wx.showLoading({
      title: '渡渡鸟正在加载',
    })
    wx.cloud.callFunction({
      name: 'signIn',
      data: {
        creatingNewUser: false
      },
      success: res => {
        console.log('用户已经注册过');
        //当用户已经注册过时，获取数据
        if (res.result.errCode == 0) {
          that.setData({
            logged: true,
            avatarUrl: res.result.data.user.avatarUrl,
            nickName: res.result.data.user.nickName,
            community: res.result.data.user.community,
            is_admin: res.result.data.user.is_admin
          })
          app.globalData.userInfo = res.result.data.user

          //加载通知，存入全局变量
          wx.cloud.callFunction({
            name: 'getAnnouncement',
            data: {
              community: that.data.community
            },
            success: res => {
              console.log('获取公告数据')
              console.log(res)
              if (res.result.errCode == 0) {
                console.log(res.result)
                app.globalData.allAnnouncement = res.result.data
                that.setData({
                  firstAnnTitle: app.globalData.allAnnouncement[app.globalData.allAnnouncement.length - 1].title,
                  firstAnnContent: app.globalData.allAnnouncement[app.globalData.allAnnouncement.length - 1].content
                })
              } else if(res.result.errCode == 1) {
                that.setData({
                  noAnn: true,
                  firstAnnTitle: '暂无公告',
                  firstAnnContent: '等会再来看看吧',
                })

              }
            },
            fail: err => {
              console.error('[云函数] [wechat_sign] 调用失败', err)
              wx.showModal({
                title: '调用失败',
                content: '请检查云函数是否已部署',
                showCancel: false,
              })
            },
            complete: err => {
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
        } else {
          //用户未注册过，跳转到注册页面
          console.log('应该跳转')
          wx.redirectTo({
            url: '../firstTimeLogin/firstTimeLogin',
          })
        }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (app.globalData.userInfoUpdated == true){
      that.onLoad()
      app.globalData.userInfoUpdated = false
    }
    if (app.globalData.announcementUpdated == true){
      app.globalData.announcementUpdated = false
      that.onLoad()
    }
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
    console.log('下拉刷新')
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh()
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