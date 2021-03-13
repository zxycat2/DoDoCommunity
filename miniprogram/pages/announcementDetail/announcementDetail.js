// miniprogram/pages/announcementDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '今日下午停电',
    time: '2021/3/15',
    content: "   胡晓明于2005年6月加入阿里巴巴集团，先后担任阿里云总裁、天弘基金董事长、网商银行董事长等职位，2018年11月29日出任蚂蚁金服总裁，2019年12月19日升任CEO，支付宝和蚂蚁金服多项业务的创建、发展都和他密不可分。2020年11月2日，中国人民银行、中国银保监会、中国证监会、国家外汇管理局对蚂蚁集团实际控制人马云、董事长井贤栋、总裁胡晓明进行监管约谈。 11月3日，蚂蚁集团被上交所暂缓上市，随后H股也暂缓上市。 蚂蚁集团宣布，在金融管理部门的指导下，成立整改工作组，全面落实约谈要求，规范金融业务的经营和发展，继续沿着“稳妥创新、拥抱监管、服务实体、开放共赢”的十六字指导方针，继续提升普惠服务能力，助力经济和民生发展。阿里曾在2021年第三季度财报中表示，由于最近中国金融科技监管环境的重大变化，蚂蚁集团正在制定整改方案，还须履行监管部门程序，因此，蚂蚁集团的业务前景和上市计划存在重大的不确定性。",
    imgSrc: 'cloud://mydemoenv-2goh570e58b7ae8e.6d79-mydemoenv-2goh570e58b7ae8e-1304794433/userAvatar/omHCE4gAHFFtTb3ErFFFTfuoPVPc1615537603062.JPG'
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