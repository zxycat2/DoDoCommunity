const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['全部', '供暖设备', '水管', '电路', '网络', '燃气', '其他'],
    typeListIndex: 0,
    community: '渡渡鸟社区1',
    originalAllReport: [],
    allReport: [],

    dataArray: [],
    refreshing: false
  },

  bindPickerChange: function(e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeListIndex: e.detail.value
    })
    that.loadInitData()
  },

  //点击进入详情
  tapEntry(event){
    var that = this
    console.log(event.currentTarget.dataset)
    var dataArrayIndex = event.currentTarget.dataset.dataarrayindex
    var entrySetIndex = event.currentTarget.dataset.entrysetindex
    var detailData = that.data.dataArray[dataArrayIndex][entrySetIndex]
    wx.navigateTo({
      url: '../reportDetail/reportDetail',
      success: res => {
        res.eventChannel.emit(
          'detailData', {data: detailData}
        )
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
    that.data.allReport = []
    wx.cloud.callFunction({
      name: 'getReport',
      data: {
        community: that.data.community
      },
      success: res => {
        console.log(res)
        if (res.result.errCode == 0) {
          console.log(res.result)
          that.data.originalAllReport = res.result.data.reverse()
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

  //截取allReport
  getSlicedData(currentPage){
    var that = this
    var result = []
    var start = currentPage * 10
    var end = (currentPage * 10) + 10
    result = that.data.allReport.slice(start, end)
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
      allReport: [],
      dataArray: []
    })
    //根据分类处理数据
    if (that.data.typeList[that.data.typeListIndex] == '全部'){
      that.data.allReport = that.data.originalAllReport
    }else{
      for (var key in that.data.originalAllReport){
        if (that.data.originalAllReport[key].type == that.data.typeList[that.data.typeListIndex]){
          that.data.allReport.push(that.data.originalAllReport[key])
        }
      }
    }
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

  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // that.data.community = app.globalData.userInfo.community
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
    if (app.globalData.reportUpdated == true){
      app.globalData.reportUpdated = false
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

