// miniprogram/pages/contact.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    community: '',
    is_admin: false,
    hideEditButton: true,
    contactObj: {}
  },

  onTapContact(e){
    var that = this
    var number = that.data.contactObj[e.currentTarget.dataset.contactname]
    console.log(number)
    wx.makePhoneCall({
      phoneNumber: number,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.is_admin = app.globalData.userInfo.is_admin
    that.data.community = app.globalData.userInfo.community
    //检测是否为管理员，编进按钮显隐
    console.log(that.data.is_admin)
    if (that.data.is_admin == true){
      that.setData({
        hideEditButton: false
      })
    }
    //下载联系人数据
    wx.showLoading({
      title: '正在加载',
    })
    wx.cloud.callFunction({
      name: 'getContact',
      data: {
        community: that.data.community
      },
      success: res => {
        console.log(res)
        if (res.result.errCode == 0) {
          console.log(res.result)
          that.setData({
            contactObj: res.result.data
          })
        } else if(res.result.errCode == 1) {
          wx.showModal({
            title: '目前还没有常用联系',
            confirmText: "我知道了",
            showCancel: false,
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
    //


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