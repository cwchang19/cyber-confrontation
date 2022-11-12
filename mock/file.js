const Mock = require('mockjs')

const data = Mock.mock({
  'items|3': [{
    'user_id|+1': 1,
    'files|10': [{
      'id|+1': 2,
      filename: '文件夹' + '@word(2)',
      'pid|1': [1, 2, 3]
    }]
  }]
})


module.exports = [
  {
    url: '/api/file',
    type: 'get',
    response: config => {
      const { id } = config.query;
      let res = data.items;
      res = res.filter(item => item.user_id == id);
      if(res.length > 0) {
        res = res[0].files;
      } else {
        res = [];
      }
      return {
        code: 20000,
        data: {
          total: res.length,
          items: res,
        }
      }
    }
  }
]