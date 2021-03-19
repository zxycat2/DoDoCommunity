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
    endDate: '结束日期',
    description: '描述',
    imgSrc: 'cloud://mydemoenv-2goh570e58b7ae8e.6d79-mydemoenv-2goh570e58b7ae8e-1304794433/渡渡鸟社区1/投票/1616138585963.jpg',
    _id: '',
    options: {'选项1':0, '选项2':0, '选项3':0},
    single: true,
    votedUser: [],
    endTime: 'endtime',

    is_admin: false,
    hideDeleteButton: true,

    hidePhoto: false,

    optionList: ['a', 'b', 'c'],
    optionResult: [],
    max: 1,
    form: '单选'
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
    //检验是否是管理员，决定是否隐藏删除按钮
    // that.data.is_admin = app.globalData.userInfo.is_admin
    // console.log(that.data.is_admin)
    // if (that.data.is_admin == true){
    //   that.setData({
    //     hideDeleteButton: false
    //   })
    // }
    const eventChannel = this.getOpenerEventChannel()
    // 监听detailData事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('detailData', function(data) {
    //     that.setData({
    //       title: data.data.title,
    //       //格式化显示日期
    //       time: util.formatDate(new Date(data.data.time), 'yyyy-mm-dd hh:mi:ss'),
    //       endDate: data.data.endDate,
    //       description: data.data.description,
    //       imgSrc: data.data.imgSrc,
    //       _id: data.data._id,
    //       options: data.data.options,
    //       single: data.data.single,
    //       votedUser: data.data.votedUser
    //     })
    //     if (that.data.imgSrc == ''){
    //       that.setData({
    //         showPhoto: true
    //       })
    //     }
    // })
    //把对象形式的options转换为列表，于前端展示
    var optionList = []
    for (var key in that.data.options){
      optionList.push(key)
    }
    console.log(optionList)
    that.setData({
      optionList: optionList
    })
    //单选/多选
    if (that.data.single == true){
      that.setData({
        form: '单选',
        max: 1
      })
    }else{
      that.setData({
        form: '多选',
        max: that.data.optionList.length
      })
    }

    
  },

  onChange(event) {
    this.setData({
      optionResult: event.detail
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},

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