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
];

module.exports = [
  {
    url: '/vue-admin-template/scenario/search\.*',
    type: 'get',
    response: config => {
      console.log('search');
      console.log(config.query);
      let items = null;
      if(!config.query.id) {
        items = scenarios;
      } else {
        items = scenarios.filter(scenario => scenario.id === config.query.id);
      }
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
      console.log('add');
      let data = config.body;
      scenarios.push(data);
      const items = scenarios
      return {
        code: 20000,
        data: { }
      }
    }
  },
  {
    url: '/vue-admin-template/scenario/alter',
    type: 'post',
    response: config => {
      console.log('alter');
      let data = config.body;
      for(let i=0; i<scenarios.length; i++) {
        if(scenarios[i].id === data.id) {
          scenarios[i] = data
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
    url: '/vue-admin-template/scenario/delete',
    type: 'post',
    response: config => {
      console.log('delete');
      let data = config.body;
      for(let i=0; i<scenarios.length; i++) {
        if(scenarios[i].id === data.id) {
          scenarios.splice(i, 1);
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