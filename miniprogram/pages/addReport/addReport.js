// miniprogram/pages/addReport.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['供暖设备', '水管', '电路', '网络', '燃气', '其他'],
    typeListIndex: 0,

    content: '',
    community: '渡渡鸟社区1',
    address: '',
    phone: '',
    openid: '',
    subscribed: false,
    imgSrc: ''

  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeListIndex: e.detail.value
    })
  },

  bindTextAreaInputContent: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  bindKeyInputAddress: function(e) {
    this.setData({
      address: e.detail.value
    })
  },

  bindKeyInputPhone: function(e) {
    this.setData({
      phone: e.detail.value
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
              const cloudPath = that.data.community + '/报修/' + timestamp + filePath.match(/\.[^.]+?$/)[0]
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

  checkInput(){
    var that = this
    var result = true
    if (that.data.address == '' || that.data.phone == ''){
      result = false
    }
    return result
  },

  submit(){
    var that = this
    if (that.checkInput() == true){
      //要求授权订阅
      var tmpID = 'yUrc27R2KEpXE7BWYh6hFWVu_UwbLXl40JmbJdjKdDc'
      wx.requestSubscribeMessage({
        tmplIds: [tmpID],
        success (res) {
          console.log(res)
          if (res[tmpID] == 'accept'){
            that.data.subscribed = true
          }
                //构造数据，调用云函数上传数据
      wx.showLoading({
        title: '正在上传数据',
      })
      console.log('data:', that.data)
      wx.cloud.callFunction({
        name: 'addReport',
        data: {
          type: that.data.typeList[that.data.typeListIndex],
          content: that.data.content,
          imgSrc: that.data.imgSrc,
          community: that.data.community,
          openid: that.data.openid,
          address: that.data.address,
          phone: that.data.phone,
          subscribed: that.data.subscribed
        },
        success: res => {
          if (res.result.errNumber == 0) {
            console.log('云数据库新增报修成功')
            app.globalData.announcementUpdated = true
            wx.showToast({
              title: '上传成功',
            })
            wx.navigateBack({
              delta: 0,
            })
            wx.navigateBack()
          } else if(res.result.errCode == 1) {
            wx.showModal({
              title: '云数据库新增报修失败',
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
        }
      })
    }else{
      wx.showModal({
        title: '还差一步',
        content: '门牌号与电话不能为空',
        confirmText: "我知道了",
        showCancel: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.community = app.globalData.userInfo.community
    that.data.openid = app.globalData.userInfo.openid
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