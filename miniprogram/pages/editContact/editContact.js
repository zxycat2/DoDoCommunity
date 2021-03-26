// miniprogram/pages/editContact.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactList: [],
    community: '',
    contactObj: {},
    _id: ''
  },
  //增减联系人相关
  addOption(e) {
    var that = this
    console.log('tap add')
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.contactList;
    _list.push({name: "", number: ""})
    this.setData({
      contactList: _list
    })
    console.log(that.data.contactList)
  },

  onTapClear(e) {
    console.log('onTapClear')
    var that = this
    var idx = e.currentTarget.dataset.index;
    console.log(idx)
    var _list = that.data.contactList;
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list.splice(idx, 1)
      }
    }
    that.setData({
      contactList: _list
    })
    console.log(that.data.contactList)
  },

  onNameInput(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list = this.data.contactList; //data中存放的数据
    _list[idx].name = val
    this.setData({
      contactList: _list
    })
  },

  onNumberInput(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list = this.data.contactList; //data中存放的数据
    _list[idx].number = val
    this.setData({
      contactList: _list
    })
  },

  checkInput(){
    var that = this
    var result = true
    for (var key in that.data.contactList){
      if (that.data.contactList[key].name == "" || that.data.contactList[key].number == ""){
        result = false
        break
      }
    }
    return result
  },

  submitClick(){
    var that = this
    if (that.checkInput() == true){
      //准备数据
      var contactObj = {}
      that.data.contactObj = {}
      for (var key in that.data.contactList){
        contactObj[that.data.contactList[key].name] = that.data.contactList[key].number
      }
      that.data.contactObj = contactObj
      //云函数上传
      wx.showLoading({
        title: '正在上传数据',
      })
      console.log('data:', that.data)
      wx.cloud.callFunction({
        name: 'updateContact',
        data: {
          contactObj: that.data.contactObj,
          community: that.data.community,
          _id: that.data._id
        },
        success: res => {
          if (res.result.errNumber == 0) {
            console.log('云数据库新增联系成功')
            app.globalData.contactUpdated = true
            wx.showToast({
              title: '上传成功',
            })
            wx.navigateBack()
          } else if(res.result.errCode == 1) {
            wx.showModal({
              title: '云数据库新增联系失败',
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
        content: '联系人名自称与电话不能为空',
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
    const eventChannel = this.getOpenerEventChannel()
    // 监听detailData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('contactData', function(data) {
      console.log('emitData:', data)
      that.setData({
        community: data.data.community,
        contactObj: data.data.contactObj,
        _id: data.data._id
      })
      var contactList = []
      for (var key in that.data.contactObj){
        contactList.push({name: key, number: that.data.contactObj[key]})
      }
      that.setData({
        contactList: contactList
      })
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