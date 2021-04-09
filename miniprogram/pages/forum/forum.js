const app = getApp()
const util = require('../../utils/util');
// miniprogram/pages/announcement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    community: '渡渡鸟社区1',
    allPost: [],

    dataArray: [],
    refreshing: false,

    showPopup: false,
    newPostContent: '',

    anonymous: false,
    nickName:'',
    imgSrc: '',
    showPhoto: false,

    is_admin: false,

    showDeleteButton: false
  },

  checkContent(){
    var that = this
    var res = false
    if (that.data.newPostContent != ''){
      res = true
    }
    return res
  },

  onshowDeleteButtonSwitchChange(){
    var that = this
    var current = that.data.showDeleteButton
    that.setData({
      showDeleteButton: !current
    })
    console.log(that.data.anonymous)
  },

  onTapDelete(e){
    var that = this
    wx.showModal({
      title: '您确定要删除该留言吗？',
      content: '留言将会被永久删除',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '正在删除',
          })
          console.log('e.c.d.imgSrc:', e.currentTarget.dataset)
          wx.cloud.callFunction({
            name: 'deletePost',
            data: {
              _id: e.currentTarget.dataset._id
            },
            success: res => {
              if (res.result.errNumber == 0) {
                if (e.currentTarget.dataset.imgsrc != undefined){
                  wx.cloud.deleteFile({
                    fileList: [e.currentTarget.dataset.imgsrc],
                    success: res => {
                      console.log('删除公告中的图片')
                    },
                    fail: console.error
                  })
                }
                console.log('云数据库删除公告成功')
                app.globalData.announcementUpdated = true
                wx.showToast({
                  title: '删除成功',
                })
                that.onRefresh()
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

  onAnonymousSwitchChange(){
    var that = this
    var current = that.data.anonymous
    that.setData({
      anonymous: !current
    })
    console.log(that.data.anonymous)
  },


  //弹出发布相关

  // popup相关
  showPopup() {
    this.setData({ showPopup: true });
  },
  hidePopup() {
    this.setData({ showPopup: false });
  },

  onClose() {
    this.setData({ 
      newPostContent: '',
      imgSrc: '',
      anonymous: false,
      showPopup: false
    });
  },

  postNewPost(){
    var that = this
    that.showPopup()
  },

  //发布
  confirmPost(){
    var that = this
    if (that.checkContent() == true){
      console.log('post')
      var that = this
      //处理数据
      console.log('src:', that.data.imgSrc)
      if (that.data.imgSrc == ''){
        that.data.showPhoto = false
      }else{
        that.data.showPhoto = true
      }
      if (that.data.anonymous == true){
        that.data.nickName = '匿名'
      }else{
        that.data.nickName = app.globalData.userInfo.nickName
      }
      //上传
      wx.showLoading({
        title: '正在上传数据',
      })
      console.log(that.data)
      wx.cloud.callFunction({
        name: 'addPost',
        data: {
          content: that.data.newPostContent,
          imgSrc: that.data.imgSrc,
          showPhoto: that.data.showPhoto,
          community: that.data.community,
          nickName: that.data.nickName
        },
        success: res => {
          if (res.result.errNumber == 0) {
            console.log('云数据库新增留言成功')
            wx.showToast({
              title: '上传成功',
            })
            that.hidePopup()
            that.onRefresh()
          } else if(res.result.errCode == 1) {
            wx.showModal({
              title: '云数据库新增留言失败',
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
          this.setData({ 
            newPostContent: '',
            imgSrc: '',
            anonymous: false
          });
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    }else{
      wx.showModal({
        title: '还差一步',
        content: '内容不能为空',
        confirmText: "我知道了",
        showCancel: false,
      })
    }

  },

  preview(e){
    var that = this
    var urls = []
    console.log('e:', e)
    urls.push(e.currentTarget.dataset.imgsrc)
    wx.previewImage({
      urls: urls
    })
  },

  //弹出输入相关

  bindTextAreaInputContent: function(e) {
    this.setData({
      newPostContent: e.detail.value
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
            const cloudPath = that.data.community + '/留言/' + timestamp + filePath.match(/\.[^.]+?$/)[0]
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

  //分页加载相关，一次加载十条数据

  //下拉刷新
  onRefresh(){
    var that = this
    //重新下载全局变量
    wx.showLoading({
      title: '加载中',
    })
    that.data.allPost = []
    wx.cloud.callFunction({
      name: 'getPost',
      data: {
        community: that.data.community
      },
      success: res => {
        console.log(res)
        if (res.result.errCode == 0) {
          console.log(res.result)
          that.data.allPost = res.result.data.reverse()
          //格式化显示日期
          for (var key in that.data.allPost){
            that.data.allPost[key].date = util.formatDate(new Date(that.data.allPost[key].date), 'yyyy-mm-dd')
          }
          console.log('从服务器下载数据', that.data)
        } else if(res.result.errCode == 1) {
          wx.showModal({
            title: '暂时还没有投票哦',
            confirmText: "我知道了",
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
        wx.hideLoading({
          success: (res) => {},
        })
        that.loadInitData()
        that.setData({
          refreshing: false
        })
      }
    })
  },

  //截取allPost
  getSlicedData(currentPage){
    var that = this
    var result = []
    var start = currentPage * 10
    var end = (currentPage * 10) + 10
    result = that.data.allPost.slice(start, end)
    console.log('开始执行切片')
    console.log('currentPage', currentPage)
    console.log('start', start)
    console.log('end',end)
    console.log('result', result)
    return result
  },

  //初始输入载入，刷新时也调用
  loadInitData: function () {
    console.log('初始数据加载')
    var that = this
    var currentPage = 0
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: []
    })
    // 获得初始数据
    var entrySet = that.getSlicedData(currentPage)
    var totalDataCount = entrySet.length;
    // setData刷新前端页面
    that.setData({
      ["dataArray["+currentPage+"]"]: entrySet,
      currentPage: currentPage,
      totalDataCount: totalDataCount
    })
    console.log('当前dataArray：')
    console.log(that.data.dataArray)
  },

  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    console.log('加载更多数据')
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    
    var entrySet = that.getSlicedData(currentPage)

    if (entrySet.length == 0){
      console.log('已经没有了')
    }else{
      console.log('添加数据')
      // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
      var totalDataCount = that.data.totalDataCount;
      totalDataCount = totalDataCount + entrySet.length;
          
      // 直接将新一页的数据添加到数组里
      that.setData({
        ["dataArray[" + currentPage + "]"]: entrySet,
        currentPage: currentPage,
        totalDataCount: totalDataCount
      })
    }
    console.log('当前dataArray：')
    console.log(that.data.dataArray)
    
  },

  postNewVote(e){
    wx.navigateTo({
      url: '../addVote/addVote',
    })
  },

  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      community: app.globalData.userInfo.community,
      is_admin: app.globalData.userInfo.is_admin
    })
    that.onRefresh()
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
    var that = this
    if (app.globalData.postUpdated == true){
      app.globalData.postUpdated = false
      that.onRefresh()
    }
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

