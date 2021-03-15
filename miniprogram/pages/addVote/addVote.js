// miniprogram/pages/addVote.js
Page({


  data: {
    optionLists: ['', ''],

    community: '',

    title: '',
    content: '',
    imgSrc: ''
  },


  addOption(e) {
    console.log('tap add')
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.optionLists;
    _list.push("")
    this.setData({
      optionLists: _list
    })
  },

  onTapClear(e) {
    var idx = e.currentTarget.dataset.index;
    var _list = this.data.optionLists;
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list.splice(idx, 1)
      }
    }
    this.setData({
      optionLists: _list
    })
  },

  onOptionInput(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list = this.data.optionLists; //data中存放的数据
    _list[idx] = val
    this.setData({
      optionLists: _list
    })
  },

  bindKeyInputTitle: function(e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindTextAreaInputDescription: function(e) {
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
            const cloudPath = that.data.community + '/投票/' + timestamp + filePath.match(/\.[^.]+?$/)[0]
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


  submitClick(){
    var that = this
    console.log(that.data)
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