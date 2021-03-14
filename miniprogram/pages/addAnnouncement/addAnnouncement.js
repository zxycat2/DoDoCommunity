// miniprogram/pages/addAnnouncement.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    community: '',

    title: '',
    content: '',
    imgSrc: ''
  },

  bindKeyInputTitle: function(e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindTextAreaInputContent: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

      // 上传图片
    doUpload: function(e) {
      var that = this
      // 选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          wx.showLoading({
            title: '上传中',
          })
          const filePath = res.tempFilePaths[0]
          // 上传图片
          var timestamp = new Date().getTime()
          const cloudPath = that.data.community + '/' + timestamp + filePath.match(/\.[^.]+?$/)[0]
          that.setData({
            isShowPic: false,
          })
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功:', res)
              that.setData({
                isShowPic: true,
                imgSrc: res.fileID,
                cloudPath: cloudPath,
              })
            },
            fail: e => {
              console.error('[上传文件] 失败:', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        },
        fail: e => {
          console.error(e)
        }
      })
    },
    //提交
  submitClick(){
    var that = this
    if (that.data.title != '' && that.data.content != ''){
      wx.showLoading({
        title: '正在上传数据',
      })
      console.log(that.data)
      wx.cloud.callFunction({
        name: 'addAnnouncement',
        data: {
          title: that.data.title,
          content: that.data.content,
          imgSrc: that.data.imgSrc,
          community: that.data.community
        },
        success: res => {
          if (res.result.errNumber == 0) {
            console.log('云数据库新增公告成功')
            app.globalData.announcementUpdated = true
            wx.showToast({
              title: '上传成功',
            })
            wx.navigateBack()
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
      
    }else{
      wx.showModal({
        title: '还差一步',
        content: '标题与内容不能为空',
        confirmText: "我知道了",
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
    var that = this
    that.data.community = app.globalData.userInfo.community
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