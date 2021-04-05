// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 实例化数据库
  const db = cloud.database()

  var add_result = {}

  if (event.community && event.content && event.title){
    // 构造要添加的数据
    to_add_data = {
      title: event.title,
      time: new Date(),
      community: event.community,
      content: event.content,
      imgSrc: event.imgSrc,
      top: false
    }

    console.log('新增通知')
    console.log(to_add_data)

    await db.collection('announcement')
    .add({
      data: to_add_data
    })
    .then(res => {
      console.log('新增通知成功')
      console.log(res)
      // 集合中该数据被赋值的_id
      add_result.resID = res._id
      add_result.errMsg = '新增通知成功'
      add_result.errNumber = 0
    })
  }else{
    add_result.errMsg = '新增通知失败,必要参数不足'
      add_result.errNumber = 1
  }
  return add_result
}


