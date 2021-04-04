const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        lang: 'zh_CN',
        data: {
          thing1: {
            value: event.content
          },
          thing2: {
            value: event.type
          },
          thing3: {
            value: event.remark
          },
          date4: {
            value: event.finishTime
          }
        },
        templateId: 'yUrc27R2KEpXE7BWYh6hFWVu_UwbLXl40JmbJdjKdDc',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}