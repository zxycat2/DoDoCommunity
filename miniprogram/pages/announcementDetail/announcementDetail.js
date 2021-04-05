// miniprogram/pages/announcementDetail.js
const util = require('../../utils/util');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '标题',
    time: 'time',
    content: '内容',
    imgSrc: '',
    _id: '',

    is_admin: false,
    hideAdminOption: true,
    top: false,

    hidePhoto: false,

    newTitle: ''
  },

  onSwitchChange(e){
    var that = this
    var current = that.data.top
    that.setData({
      top: !current
    })
    that.data.newTitle = that.data.title
    if (that.data.top == true){
      that.data.newTitle = '[置顶]' + that.data.title
    }else{
      that.data.newTitle = that.data.title.slice(4)
    }
    console.log('new title:', that.data.newTitle)
    console.log('switch change', that.data.top)
    wx.showLoading({
      title: '正在更新数据',
    })
    console.log(that.data)
    wx.cloud.callFunction({
      name: 'updateAnnouncementTop',
      data: {
        _id: that.data._id,
        top: that.data.top,
        title: that.data.newTitle
      },
      success: res => {
        if (res.result.errNumber == 0) {
          console.log('云数据库新增公告成功')
          app.globalData.announcementUpdated = true
          wx.showToast({
            title: '更新成功',
          })
          that.setData({
            title: that.data.newTitle
          })

        } else if(res.result.errCode == 1) {
          wx.showModal({
            title: '云数据库新增公告失败',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.is_admin = app.globalData.userInfo.is_admin
    console.log(that.data.is_admin)
    if (that.data.is_admin == true){
      that.setData({
        hideAdminOption: false
      })
    }
    const eventChannel = this.getOpenerEventChannel()
    // 监听detailData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('detailData', function(data) {
        that.setData({
          title: data.data.title,
          //格式化显示日期
          time: util.formatDate(new Date(data.data.time), 'yyyy-mm-dd hh:mi:ss'),
          content: data.data.content,
          imgSrc: data.data.imgSrc,
          _id: data.data._id,
          top: data.data.top
        })
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
      title: '您确定要删除该公告吗？',
      content: '公告将会被永久删除',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '正在删除',
          })
          console.log(that.data)
          wx.cloud.callFunction({
            name: 'deleteAnnouncement',
            data: {
              _id: that.data._id
            },
            success: res => {
              if (res.result.errNumber == 0) {
                wx.cloud.deleteFile({
                  fileList: [that.data.imgSrc],
                  success: res => {
                    console.log('删除公告中的图片')
                  },
                  fail: console.error
                })
                console.log('云数据库删除公告成功')
                app.globalData.announcementUpdated = true
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