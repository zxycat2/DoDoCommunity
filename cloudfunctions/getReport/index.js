// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  // 实例化数据库
  const db = cloud.database()

  var result = {}
  await db.collection('report')
  .where({
    community: event.community
  })
  .limit(100)
  .get()
  .then(res => {
    console.log('已完成搜索')
    console.log(res.data)
    result.data = res.data

    if (result.data.length == 0){
      result.errCode = 1
      result.errMsg = '未找到结果'
    }else{
      result.errCode = 0
      result.errMsg = '已找到匹配结果'
    }
  })
  return result
}