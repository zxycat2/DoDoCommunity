// miniprogram/pages/my.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../../images/unknowenUserAva.jpeg', 
    nickName: '登录中',
    community: '正在加载社区',
    is_admin: false,

    newUserNameInputValue: '',
    showPopup: false,

    newAvatarUrl: null
  },
  //更改社区
  onTapChangeCommunity (e) {
    wx.navigateTo({
      url: '../searchCommunity/searchCommunity',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: {
          from: 'my'
        } })
      }
    })
  },
  //更改用户名
  onTapChangeUserName (e){
    var that = this
    this.setData({
      newUserNameInputValue: ""
    })
    this.showPopup()
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
  //输入框相关
  bindKeyInput: function (e) {
    this.setData({
      newUserNameInputValue: e.detail.value
    })
  },

  checkInput (e){
    var that = this
    if (that.data.newUserNameInputValue != ''){
      console.log('新用户名合法')
      that.hidePopup()
      //更新云数据库信息
      wx.showLoading({
        title: '正在更新信息',
      })
      wx.cloud.callFunction({
        name: 'updateUserName',
        data: {
          userName: that.data.newUserNameInputValue
        },
        success: res => {
          if (res.result.errNumber == 0) {
            console.log('云数据库更新成功')
            that.setData({
              nickName: that.data.newUserNameInputValue
            })
            app.globalData.userInfoUpdated = true
            that.hidePopup()
          } else if(res.result.errCode == 1) {
            wx.showModal({
              title: '云数据库更新失败',
              content: '请重试',
              confirmText: "好的",
              showCancel: false,
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
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    }else{
      wx.showModal({
        title: '用户名不能为空',
        content: '请尝试重新输入',
        confirmText: "我知道了",
        showCancel: false,
      })
      that.setData({
        codeInputValue: ''
      })
    }
  },
  //上传新头像
  onTapUploadeAvatar(e){
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
        var userOpenID = app.globalData.userInfo.openid
        var timestamp = new Date().getTime()
        const cloudPath = 'userAvatar/' + userOpenID + timestamp + filePath.match(/\.[^.]+?$/)[0]
        console.log("filePath:", filePath, ", cloudPath:", cloudPath)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.data.newAvatarUrl = res.fileID
            console.log('[上传文件] 成功:', res)
            //删掉老的图片
            wx.cloud.deleteFile({
              fileList: [that.data.avatarUrl],
              success: res => {
                console.log('成功删除旧头像')
              
                //更新user信息，本页面setData，全局标记dataUpdated
                wx.cloud.callFunction({
                  name: 'updateAvatarUrl',
                  data: {
                    avatarUrl: that.data.newAvatarUrl
                  },
                  success: res => {
                    if (res.result.errNumber == 0) {
                      console.log('云数据库更新成功')
                      that.setData({
                        avatarUrl: that.data.newAvatarUrl
                      })
                      app.globalData.userInfoUpdated = true
                    } else if(res.result.errCode == 1) {
                      wx.showModal({
                        title: '云数据库更新失败',
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
                    wx.hideLoading({
                      success: (res) => {},
                    })
                  },
                  complete: err => {
                    wx.hideLoading()
                  }
                })
              },
              fail: err => {
                console.log('删除旧头像失败')
              },
              complete: res => {
              }
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
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    var that = this
    //利用全局数据（在front page设定过的）设定页面数据
    that.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl, 
      nickName: app.globalData.userInfo.nickName,
      community: app.globalData.userInfo.community,
      is_admin: app.globalData.userInfo.is_admin
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