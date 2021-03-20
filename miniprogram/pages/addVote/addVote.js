// miniprogram/pages/addVote.js
const app = getApp()
const util = require('../../utils/util')

Page({


  data: {
    optionLists: ['', ''],

    community: '渡渡鸟社区1',
    nickName: '',

    title: '',
    content: '',
    imgSrc: '',
    single: true,

    endDate: '',

    anonymous: false,
    creator: ''

  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var endTime = new Date(e.detail.value + ' 23:59:59').getTime() / 1000 - parseInt(new Date().getTime() / 1000);
    var timeDay = parseInt(endTime / 60 / 60 / 24);        //相差天数
    console.log('相差几天：', timeDay)
    if (timeDay >= 1){
      console.log('合法日期')
      this.setData({
        endDate: e.detail.value
      })
    }else{
      console.log('非法日期')
      wx.showModal({
        title: '提示',
        content: '结束日期不能早于明天哦',
        confirmText: "我知道了",
        showCancel: false,
      })
    }
  },


  onSwitchChange(e){
    var that = this
    var current = that.data.single
    that.setData({
      single: !current
    })
    console.log(that.data.single)
  },

  onAnonymousSwitchChange(){
    var that = this
    var current = that.data.anonymous
    that.setData({
      anonymous: !current
    })
    console.log(that.data.anonymous)
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
    var opStatus = that.checkOptionsNotNull()
    if (that.data.title != '' && opStatus != false){
      console.log('submit')
      //上传前把options从数组加工成对象
      var finalOptionList = {}
      for (var key of that.data.optionLists){
        finalOptionList[key] = 0
      }
      //判断是否要匿名
      if (that.data.anonymous == false){
        that.data.creator = that.data.nickName
      }
      wx.showLoading({
        title: '正在上传数据',
      })
      console.log(that.data)
      wx.cloud.callFunction({
        name: 'addVote',
        data: {
          title: that.data.title,
          description: that.data.description,
          imgSrc: that.data.imgSrc,
          community: that.data.community,
          options: finalOptionList,
          single: that.data.single,
          endDate: that.data.endDate,
          creator: that.data.creator
        },
        success: res => {
          if (res.result.errNumber == 0) {
            console.log('云数据库新增公告成功')
            app.globalData.voteUpdated = true
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
        content: '标题与选项内容不能为空,且至少有两个选项',
        confirmText: "我知道了",
        showCancel: false,
      })
    }

  },

  checkOptionsNotNull(){
    var that = this
    if (that.data.optionLists.length >= 2){
      for (var key of that.data.optionLists){
        if (key == ''){
          return false
        }
      }
      return true
    }else{
      return false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.community = app.globalData.userInfo.community
    that.date.nickName = app.globalData.userInfo.nickName
    var dateTime = new Date()
    dateTime=dateTime.setDate(dateTime.getDate()+7);
    dateTime=new Date(dateTime);
    that.setData({
      endDate: util.formatDate(dateTime, 'yyyy-mm-dd')
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

