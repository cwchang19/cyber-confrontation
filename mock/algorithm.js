const Mock = require('mockjs')

const algorithms = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    algorithm_name: '算法' + '@word(5)',
    algorithm_description: '@csentence(10, 50)',
    algorithm_file: '@word(5)'+'.py',
    algorithm_owner: '@last',
    create_datetime: '@datetime'
  }]
})

module.exports = [
  // 按条件查询
  {
    url: '/api/algorithm',
    type: 'get',
    response: config => {
      let { id, algorithm_name, pageSize, page } = config.query;
      let res = algorithms.items;
      let len = 0;
      if(id) {
        res = res.filter(algorithm => algorithm.id == id);
        len = res.length;
      } else {
        algorithm_name = algorithm_name || '';
        res = res.filter(algorithm => algorithm.algorithm_name.includes(algorithm_name));
        len = res.length;
        res = res.slice(pageSize * (page-1), pageSize * page);
      }
      const items = res;
      return {
        code: 20000,
        data: {
          total: len,
          items: items,
        }
      }
    }
  },
  // 新增
  {
    url: '/api/algorithm',
    type: 'post',
    response: config => {
      let data = config.body;
      data.id = algorithms.items.length + 1;
      algorithms.items.push(data);
      return {
        code: 20000,
        data: {}
      }
    }
  },
  // 修改
  {
    url: '/api/algorithm',
    type: 'put',
    response: config => {
      const id = config.query.id || '';
      const data = config.body || {};
      for(let i=0; i<algorithms.items.length; i++) {
        if(algorithms.items[i].id == id) {
          algorithms.items[i] = data;
          break;
        }
      }
      return {
        code: 20000,
        data: {}
      }
    }
  },
  // 删除
  {
    url: '/api/algorithm',
    type: 'delete',
    response: config => {
      const id = config.query.id || '';
      for(let i=0; i<algorithms.items.length; i++) {
        if(algorithms.items[i].id == id) {
          algorithms.items.splice(i, 1);
          break;
        }
      }
      return {
        code: 20000,
        data: {}
      }
    }
  },
]