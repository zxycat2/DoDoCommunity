// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 实例化数据库
  const db = cloud.database()

  var add_result = {}

  if (event.community && event.options && event.title && event.single != undefined){
    // 构造要添加的数据
    to_add_data = {
      title: event.title,
      time: new Date(),
      community: event.community,
      description: event.description,
      imgSrc: event.imgSrc,
      options: event.options,
      single: event.single,
      votedUser: [],
      endDate: event.endDate,
      creator: event.creator
    }

    console.log('新增投票')
    console.log(to_add_data)

    await db.collection('vote')
    .add({
      data: to_add_data
    })
    .then(res => {
      console.log('新增投票成功')
      console.log(res)
      // 集合中该数据被赋值的_id
      add_result.resID = res._id
      add_result.errMsg = '新增投票成功'
      add_result.errNumber = 0
    })
  }else{
    add_result.errMsg = '新增投票失败,必要参数不足'
      add_result.errNumber = 1
  }
  return add_result
}


// {
//   "title": "投票标题",
//   "community": "渡渡鸟社区1",
//   "description": "投票内容简介投票内容简介投票内容简介投票内容简介投票内容简介投票内容简介投票内容简介",
//   "imgSrc": "cloud://mydemoenv-2goh570e58b7ae8e.6d79-mydemoenv-2goh570e58b7ae8e-1304794433/渡渡鸟社区1/投票/1616138585963.jpg",
//   "options": "{'选项1': 3, '选项1': 5, '选项1': 0, '选项1': 2}",
//   "single": "true",
//   "endDate": "2021-03-27"
// }