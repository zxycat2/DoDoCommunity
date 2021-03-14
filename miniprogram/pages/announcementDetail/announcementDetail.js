// miniprogram/pages/announcementDetail.js
const util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '标题',
    time: 'time',
    content: '内容',
    imgSrc: '',

    hidePhoto: false
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
    const eventChannel = this.getOpenerEventChannel()
    // 监听detailData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('detailData', function(data) {
        that.setData({
          title: data.data.title,
          //格式化显示日期
          time: util.formatDate(new Date(data.data.time), 'yyyy-mm-dd hh:mi:ss'),
          content: data.data.content,
          imgSrc: data.data.imgSrc
        })
        if (that.data.imgSrc == ''){
          that.setData({
            showPhoto: true
          })
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