// miniprogram/pages/editContact.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactList: [{name: '联系1', number: '1234242'}, {name: '联系2', number: '21234242'}, {name: '联系3', number: '31234242'}]
  },
  //增减联系人相关
  addOption(e) {
    var that = this
    console.log('tap add')
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.contactList;
    _list.push({"": ""})
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