const Mock = require('mockjs')

const actions = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    action_name: '动作 ' + '@title(1, 3)',
    'action_type|1': [
      'Discovery', 
      'Credential Access', 
      'Privilege Escalation',
      'Lateral Movement',
      'Exfiltration',
      'Impact'
    ],
    action_description: '@cparagraph',
  }]
})

module.exports = [
  // 按条件查询
  {
    url: '/api/action',
    type: 'get',
    response: config => {
      let { id, action_name, pageSize, page } = config.query;
      let res = actions.items;
      let len = 0;
      if(id) {
        res = res.filter(action => action.id == id);
        len = res.length;
      } else {
        action_name = action_name || '';
        res = res.filter(action => action.action_name.includes(action_name));
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
    url: '/api/action',
    type: 'post',
    response: config => {
      let data = config.body;
      data.id = actions.items.length + 1;
      actions.items.push(data);
      return {
        code: 20000,
        data: {}
      }
    }
  },
  // 修改
  {
    url: '/api/action',
    type: 'put',
    response: config => {
      const id = config.query.id || '';
      const data = config.body || {};
      for(let i=0; i<actions.items.length; i++) {
        if(actions.items[i].id == id) {
          actions.items[i] = data;
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
    url: '/api/action',
    type: 'delete',
    response: config => {
      const id = config.query.id || '';
      for(let i=0; i<actions.items.length; i++) {
        if(actions.items[i].id == id) {
          actions.items.splice(i, 1);
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