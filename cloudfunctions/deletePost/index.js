// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 实例化数据库
  const db = cloud.database()

  var result = {}
  if (event._id){
    await db.collection('post')
    .doc(event._id)
    .remove({
      success: function(res) {
        console.log('删除成功')
        console.log(res)
      }
    })
    result.errNumber = 0
    result.errMsg = '留言删除成功'
  }else{
    result.errNumber = 1
    result.errMsg = '留言删除失败，参数不足'
  }
  return result
}