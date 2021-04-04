
const util = require('../../utils/util');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 'time',
    content: '',
    imgSrc: '',
    address: 'address',
    type: 'type',
    phone: '1234567890',
    openid: '',
    subscribed: false,
    _id: '',

    is_admin: false,
    hideDeleteButton: true,

    showPhoto: false,
    showContent: false,

    showPopup: false,
    focus: false,
    remarkInputValue: '已完成维修'
  },
  //弹出输入相关
  bindKeyInput: function (e) {
    this.setData({
      remarkInputValue: e.detail.value
    })
  },
  
  confirmRemark(e){
    var that = this
    //发送订阅消息
    console.log('发送订阅消息')
    wx.cloud.callFunction({
      name: 'sendSubscribeMessage',
      data: {
        openid: that.data.openid,
        content: that.data.content,
        type: that.data.type,
        remark: that.data.remarkInputValue,
        finishTime: util.formatDate(new Date(), 'yyyy-mm-dd hh:mi')
      },
      success: res => {
        console.log('订阅消息发送成功', res)
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
        console.log(err)
      }
    })
    that.deleteReport()
  },

  // popup相关
  showPopup() {
    this.setData({ showPopup: true });
  },
  hidePopup() {
    this.setData({ showPopup: false });
  },

  onClose() {
    this.setData({ showPopup: false });
  },

  deleteReport(){
    var that = this
    wx.showLoading({
      title: '正在删除',
    })
    console.log(that.data)
    wx.cloud.callFunction({
      name: 'deleteReport',
      data: {
        _id: that.data._id
      },
      success: res => {
        //删除图片
        if (res.result.errNumber == 0) {
          wx.cloud.deleteFile({
            fileList: [that.data.imgSrc],
            success: res => {
              console.log('删除图片')
            },
            fail: console.error
          })
          console.log('云数据库删除公告成功')
          app.globalData.reportUpdated = true
          wx.showToast({
            title: '删除成功',
          })
          wx.navigateBack()
        } else if(res.result.errCode == 1) {
          wx.showModal({
            title: '云数据库删除公告失败',
            content: '请重试',
            confirmText: "好的",
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
        console.log(err)
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },


  //图片预览
  preview(e){
    var that = this
    var urls = []
    urls.push(that.data.imgSrc)
    wx.previewImage({
      urls: urls
    })
  },

  //按键拨号
  onTapPhone(e){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.phone,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.is_admin = app.globalData.userInfo.is_admin
    console.log(that.data.is_admin)
    if (that.data.is_admin == true){
      that.setData({
        hideDeleteButton: false
      })
    }
    const eventChannel = this.getOpenerEventChannel()
    // 监听detailData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('detailData', function(data) {
        that.setData({
          type: data.data.type,
          address: data.data.address,
          phone: data.data.phone,
          openid: data.data.openid,
          subscribed: data.data.subscribed,
          //格式化显示日期
          time: util.formatDate(new Date(data.data.time), 'yyyy-mm-dd hh:mi'),
          content: data.data.content,
          imgSrc: data.data.imgSrc,
          _id: data.data._id
        })
        if (that.data.content == ''){
          that.setData({
            showContent: true
          })
        }
        if (that.data.imgSrc == ''){
          that.setData({
            showPhoto: true
          })
        }
    })
    
  },

  onTapDelete(){
    var that = this
    wx.showModal({
      title: '您确定要完成该报修吗？',
      content: '条目将会被永久删除',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (that.data.subscribed == true){
            that.showPopup()
          }else{
            that.deleteReport()
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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