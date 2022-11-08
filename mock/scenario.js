const scenarios = [
  {
    id: '1',
    scenario: '场景A',
    number: '2'
  }, 
  {
    id: '2',
    scenario: '场景B',
    number: '3'
  }, 
  {
    id: '3',
    scenario: '场景C',
    number: '4'
  }, 
  {
    id: '4',
    scenario: '场景D',
    number: '5'
  }
]

module.exports = [
  {
    url: '/vue-admin-template/scenario/list',
    type: 'get',
    response: config => {
      const items = scenarios
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/scenario/add',
    type: 'post',
    response: config => {
      let data = config.body;
      console.log(typeof data);
      scenarios.push(data);
      console.log(scenarios);
      const items = scenarios
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]