// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 实例化数据库
  const db = cloud.database()
  const _ = db.command

  var result = {}
  if (event.contactObj){
    await db.collection('community')
    .doc(event._id)
    .update({
      data: {        
        contact: _.set(event.contactObj)
      }
    })
    .then(res => {
      console.log('更新成功')
      console.log(res)
    })
    result.errNumber = 0
    result.errMsg = '更新社区联系成功'
  }else{
    result.errNumber = 1
    result.errMsg = '更新社区联系失败，参数不足'
  }
  return result
}