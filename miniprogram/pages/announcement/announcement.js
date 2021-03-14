const app = getApp()

// miniprogram/pages/announcement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    community: '',
    allAnnouncement: [],

    dataArray: [],
    refreshing: false
  },
  //点击进入详情
  tapEntry(event){
    var that = this
    console.log(event.currentTarget.dataset)
    var dataArrayIndex = event.currentTarget.dataset.dataarrayindex
    var entrySetIndex = event.currentTarget.dataset.entrysetindex
    var detailData = that.data.dataArray[dataArrayIndex][entrySetIndex]
    wx.navigateTo({
      url: '../announcementDetail/announcementDetail',
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
    wx.cloud.callFunction({
      name: 'getAnnouncement',
      data: {
        community: that.data.community
      },
      success: res => {
        console.log(res)
        if (res.result.errCode == 0) {
          console.log(res.result)
          app.globalData.allAnnouncement = res.result.data
        } else if(res.result.errCode == 1) {
          wx.showModal({
            title: '暂时还没有通知哦',
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
      }
    })
    that.onLoad()
    that.setData({
      refreshing: false
    })
  },

  //截取allAccouncement
  getSlicedData(currentPage){
    var that = this
    var result = []
    var start = currentPage * 10
    var end = (currentPage * 10) + 10
    result = app.globalData.allAnnouncement.slice(start, end)
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

  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.community = app.globalData.userInfo.community
    that.loadInitData()
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
    if (app.globalData.announcementUpdated == true){
      app.globalData.announcementUpdated = false
      that.onLoad()
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


// {
//   "title": "标题1",
//   "community": "渡渡鸟社区1",
//   "content": "胡晓明于2005年6月加入阿里巴巴集团，先后担任阿里云总裁、天弘基金董事长、网商银行董事长等职位，2018年11月29日出任蚂蚁金服总裁，2019年12月19日升任CEO，支付宝和蚂蚁金服多项业务的创建、发展都和他密不可分。2020年11月2日，中国人民银行、中国银保监会、中国证监会、国家外汇管理局对蚂蚁集团实际控制人马云、董事长井贤栋、总裁胡晓明进行监管约谈。 11月3日，蚂蚁集团被上交所暂缓上市，随后H股也暂缓上市。 蚂蚁集团宣布，在金融管理部门的指导下，成立整改工作组，全面落实约谈要求，规范金融业务的经营和发展，继续沿着“稳妥创新、拥抱监管、服务实体、开放共赢”的十六字指导方针，继续提升普惠服务能力，助力经济和民生发展。阿里曾在2021年第三季度财报中表示，由于最近中国金融科技监管环境的重大变化，蚂蚁集团正在制定整改方案，还须履行监管部门程序，因此，蚂蚁集团的业务前景和上市计划存在重大的不确定性。",
//   "imgSrc": "cloud://mydemoenv-2goh570e58b7ae8e.6d79-mydemoenv-2goh570e58b7ae8e-1304794433/userAvatar/omHCE4gAHFFtTb3ErFFFTfuoPVPc1615537603062.JPG"
// }