const Mock = require('mockjs')

const users = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    nickname: '@first',
    username: '@last',
    phone: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    algorithm: '@integer(0, 20)',
    create_datetime: '@datetime',
    'user_type|1' : [ '管理员', '用户' ],
  }]
})

module.exports = [
  // 按条件查询
  {
    url: '/api/user',
    type: 'get',
    response: config => {
      let { id, username, pageSize, page } = config.query;
      let res = users.items;
      let len = 0;
      if(id) {
        res = res.filter(user => user.id == id);
        len = res.length;
      } else {
        username = username || '';
        res = res.filter(user => user.username.includes(username));
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
    url: '/api/user',
    type: 'post',
    response: config => {
      let data = config.body;
      data.id = users.items.length + 1;
      users.items.push(data);
      return {
        code: 20000,
        data: {}
      }
    }
  },
  // 修改
  {
    url: '/api/user',
    type: 'put',
    response: config => {
      const id = config.query.id || '';
      const data = config.body || {};
      for(let i=0; i<users.items.length; i++) {
        if(users.items[i].id == id) {
          users.items[i] = data;
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
    url: '/api/user/forever',
    type: 'delete',
    response: config => {
      const id = config.query.id || '';
      for(let i=0; i<users.items.length; i++) {
        if(users.items[i].id == id) {
          users.items.splice(i, 1);
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