// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 实例化数据库
  const db = cloud.database()

  var result = {}
  if (event.title ){

    await db.collection('announcement')
    .doc(event._id)
    .update({
      data: {        
        top: event.top,
        title: event.title
      }
    })
    .then(res => {
      console.log('更新成功')
      console.log(res)
    })
    result.errNumber = 0
    result.errMsg = '更新通知置顶成功'
  }else{
    result.errNumber = 1
    result.errMsg = '更新通知置顶失败，参数不足'
  }
  return result
}

