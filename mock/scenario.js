const Mock = require('mockjs');

let data = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    scenario_name: '场景 ' + '@word(5, 10)',
    training_num: '@integer(1, 20)',
    'directory_name|1': [1, 2, 3],
    'directory_parent|1': [1, 2, 3],
    nodeNum: '@integer(1, 10)',
    subnetNum: '@integer(1, 10)',
    infiltrateLevel: '@integer(1, 10)',
    protectionLevel: '@integer(1, 10)',
    targetNum: '@integer(1, 10)',
    vulnerabilityNum: '@integer(1, 10)',
  }]
})

module.exports = [
  {
    // url: '/vue-admin-template/scenario/search\.*',
    url: '/api/scenario',
    type: 'get',
    response: config => {
      const { id, fid, pageSize, page } = config.query;
      let res = data.items;
      let len;
      if(id) {
        res = data.items.filter(item => item.id == id);
        len = 1;
      } else {
        res = data.items.filter(item => item.directory_name == fid);
        len = res.length;
        res = res.slice(pageSize * (page - 1), pageSize * page);
      }
      return {
        code: 20000,
        data: {
          total: len,
          items: res
        }
      }
    }
  },
  {
    url: '/api/scenario',
    type: 'post',
    response: config => {
      let newItem = config.body;
      newItem.id = data.items.length + 1;
      data.items.push(newItem);
      return {
        code: 20000,
        data: { }
      }
    }
  },
  {
    url: '/api/scenario',
    type: 'put',
    response: config => {
      const { id } = config.query;
      const item = config.body;
      for(let i=0; i<data.items.length; i++) {
        if(data.items[i].id == id) {
          data.items[i] = item;
          break;
        }
      }
      return {
        code: 20000,
        data: { }
      }
    }
  },
  {
    url: '/api/scenario',
    type: 'delete',
    response: config => {
      let { id } = config.query;
      for(let i=0; i<data.items.length; i++) {
        if(data.items[i].id == id) {
          data.items.splice(i, 1);
          break;
        }
      }
      return {
        code: 20000,
        data: { }
      }
    }
  },
]