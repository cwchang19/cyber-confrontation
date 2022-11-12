const Mock = require('mockjs')

const data = Mock.mock({
  'items|3': [{
    'user_id|+1': 1,
    'files|3': [{
      'id|+1': 1,
      filename: '文件夹' + '@word(2)',
      'pid|+1': 0
    }]
  }]
})

module.exports = [
  {
    url: '/api/file',
    method: 'get',
    response: config => {
      const { id } = config.query;
      let res;
      for(let i=0; i<data.items.length; i++) {
        if(data.items[i].user_id == id) {
          return {
            code: 20000,
            data: {
              total: data.items[i].files.length,
              items: data.items[i].files,
            }
          }
        }
      }
      return {
        code: 40000,
        data: {
          msg: 'error1',
        }
      }
    }
  }
]