// miniprogram/pages/searchCommunity/searchCommunity.js
const md5 = require('../../utils/md5.js')
const app = getApp()

Page({

  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: null,

    showPopup: false,
    focus: false,
    codeInputValue: '',
    selectedIndex: null,

    from: null
  },
  onLoad() {
      var that = this
      this.setData({
          search: this.search.bind(this)
      })
      const eventChannel = this.getOpenerEventChannel()
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log(data.data)
        if (data.data.from == 'my'){
          that.data.from = 'my'
        }
    })
  },
  search: function (value) {
      var that = this
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '正在查找结果',
        })
        wx.cloud.callFunction({
          name: 'searchCommunity',
          data: {
            name: value
          },
          success: res => {
            console.log(res)
            if (res.result.errCode == 0) {
              console.log(res.result)
              that.setData({
                searchResult: res.result.data
              })
              //用搜索结果构建列表，用于search组件显示结果
              var resultNameArray = []
              for (var element of res.result.data){
                resultNameArray.push({text: element.name, value: ''})
              }
              resolve(resultNameArray)
            } else if(res.result.errCode == 1) {
              wx.showModal({
                title: '没有找到匹配社区',
                content: '请尝试重新输入',
                confirmText: "我知道了",
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
      })
  },
  //点击选项后
  selectResult: function (e) {
    var that = this
    this.setData({
      codeInputValue: "",
      selectedIndex: e.detail.index
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
  //口令输入框相关
  bindKeyInput: function (e) {
    this.setData({
      codeInputValue: e.detail.value
    })
  },
  //判断口令 鸟
  checkCode() {
    var that = this
    if (md5.md5(that.data.codeInputValue) == that.data.searchResult[that.data.selectedIndex].code){
      console.log('口令正确')
      that.hidePopup()
      //更新云数据库信息
      wx.showLoading({
        title: '正在更新信息',
      })
      wx.cloud.callFunction({
        name: 'updateCommunity',
        data: {
          community: that.data.searchResult[that.data.selectedIndex].name
        },
        success: res => {
          if (res.result.errNumber == 0) {
            console.log('云数据库更新成功')
            let pages = getCurrentPages();//当前页面
            let prevPage = pages[pages.length-2];//上一页面
            prevPage.setData({//直接给上移页面赋值
              community: that.data.searchResult[that.data.selectedIndex].name,
              communityChosen: true
            });
            if (that.data.from == 'my'){
              app.globalData.userInfoUpdated = true
              console.log('from my')
              console.log(app.globalData.userInfoUpdated)
            }
            wx.navigateBack({//返回
              delta:1
            })
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
        title: '口令不正确',
        content: '请尝试重新输入',
        confirmText: "我知道了",
        showCancel: false,
      })
      that.setData({
        codeInputValue: ''
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面加载
   */

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

