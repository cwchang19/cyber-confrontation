const trainings = [
  {
    id: '1',
    name: '训练A',
    state: '进行中',
    time: '2022.10.10',
    period: '1h.30m.16s',
    run_machine: 'c1,c3,c7'
  }, {
    id: '2',
    name: '训练B',
    state: '进行中',
    time: '2022.10.10',
    period: '1h.30m.16s',
    run_machine: 'c1,c3,c7'
  }, {
    id: '3',
    name: '训练C',
    state: '失败',
    time: '2022.10.10',
    period: '1h.30m.16s',
    run_machine: 'c1,c3,c7'
  }, {
    id: '4',
    name: '训练D',
    state: '成功',
    time: '2022.10.10',
    period: '1h.30m.16s',
    run_machine: 'c1,c3,c7'
  }
];

module.exports = [
  {
    url: '/vue-admin-template/training/search\.*',
    type: 'get',
    response: config => {
      console.log('search');
      console.log(config.query);
      let items = null;
      if(!config.query.id) {
        items = trainings;
      } else {
        items = trainings.filter(training => training.id === config.query.id);
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
    url: '/vue-admin-template/training/add',
    type: 'post',
    response: config => {
      console.log('add');
      let data = config.body;
      trainings.push(data);
      const items = trainings
      return {
        code: 20000,
        data: { }
      }
    }
  },
  {
    url: '/vue-admin-template/training/alter',
    type: 'post',
    response: config => {
      console.log('alter');
      let data = config.body;
      for(let i=0; i<trainings.length; i++) {
        if(trainings[i].id === data.id) {
          trainings[i] = data
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
    url: '/vue-admin-template/training/delete',
    type: 'post',
    response: config => {
      console.log('delete');
      let data = config.body;
      for(let i=0; i<trainings.length; i++) {
        if(trainings[i].id === data.id) {
          trainings.splice(i, 1);
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