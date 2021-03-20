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
    options: {'选项1':8, '选项2':5, '选项3':0},
    single: true,
    votedUser: [],
    endTime: 'endtime',
    creator: '',

    is_admin: false,
    hideDeleteButton: true,

    hidePhoto: false,

    optionList: [],
    optionResult: [],
    max: 1,
    form: '单选',

    openid: '',

    allVoteCount: 0,
    votePercentage: [],
    // [{option: '选项1', percentage: 20, voteCount: 2},{option: '选项2', percentage: 30, voteCount: 3}, {option: '选项3', percentage: 10, voteCount: 1}]

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
    // that.data.openid = app.globalData.userInfo.openid
    // 检验是否是管理员，决定是否隐藏删除按钮
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
    //是否为匿名
    if (that.data.creator == ''){
      that.setData({
        creator: '匿名'
      })
    }
    //展示投票结果
    //计算百分比
    var allVoteCount = 0
    for (key in that.data.options){
      allVoteCount += that.data.options[key]
    }
    console.log("allVoteCount", allVoteCount)
    var newVotePercentage = []
    for (key in that.data.options){
      var item = {option: key, voteCount: that.data.options[key], percentage: parseInt((that.data.options[key] / allVoteCount)*100)}
      newVotePercentage.push(item)
    }
    that.setData({
      votePercentage: newVotePercentage
    })
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
      title: '您确定要删除该投票吗？',
      content: '投票将会被永久删除',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '正在删除',
          })
          console.log(that.data)
          wx.cloud.callFunction({
            name: 'deleteVote',
            data: {
              _id: that.data._id
            },
            success: res => {
              if (res.result.errNumber == 0) {
                wx.cloud.deleteFile({
                  fileList: [that.data.imgSrc],
                  success: res => {
                    console.log('删除投票中的图片')
                  },
                  fail: console.error
                })
                console.log('云数据库删除投票成功')
                app.globalData.announcementUpdated = true
                wx.showToast({
                  title: '删除成功',
                })
                wx.navigateBack()
              } else if(res.result.errCode == 1) {
                wx.showModal({
                  title: '云数据库删除投票失败',
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

  submitClick(){
    var that = this
    //检测是否至少有一个选项
    if (that.optionNotNullCheck() == false){
      wx.showModal({
        title: '别着急',
        content: '请至少选择一个选项',
        showCancel: false
      })
    }else{
      wx.showModal({
        title: '您确定要提交吗？',
        success(res){
          if (res.confirm){
            console.log('用户点击确定')
            //构建数据
            that.data.votedUser.push(that.data.openid)
            for (var key in that.data.optionResult ){
              that.data.options[that.data.optionResult[key]] = that.data.options[that.data.optionResult[key]] + 1
            }
            console.log(that.data)
            //云函数更新
            wx.showLoading({
              title: '正在上传数据',
            })
            wx.cloud.callFunction({
              name: 'updateVote',
              data: {
                _id: that.data._id,
                options: that.data.options,
                votedUser: that.data.votedUser
              },
              success: res => {
                if (res.result.errNumber == 0) {
                  console.log('云数据库更新成功')
                  app.globalData.voteUpdated = true
                } else if(res.result.errCode == 1) {
                  wx.showModal({
                    title: '云数据库更新失败',
                    content: '请重试',
                    confirmText: "好的",
                    showCancel: false,
                  })
                }
                wx.showToast({
                  title: '投票完成',
                })
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
                wx.hideLoading({
                  success: (res) => {},
                })
              }
            })
          }else{
            console.log('用户点击取消')
          }
        }
        
      })
    }

  },

  optionNotNullCheck(){
    var that = this
    if (that.data.optionResult.length == 0){
      return false
    }else{
      return true
    }
  },

  //呈现结果相关


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