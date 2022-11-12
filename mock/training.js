const Mock = require('mockjs');

let options = ['选项1', '选项2', '选项3', '选项4', '选项5', '选项6'];

let data = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    training_name: '训练 ' + '@word(5, 10)',
    'training_state|1': ['训练中', '成功', '失败'],
    create_datetime: '@datetime',
    training_duration: '@time',
    training_position: '主机 ' + '@word(3)',
    'directory_name|1': [1, 2, 3],
    'directory_parent|1': [1, 2, 3],
    action_config: {
      'discovery|1': options,
      'credentialAccess|1': options,
      'privilegeEscalation|1': options,
      'discovlateralMovementery|1': options,
      'exfiltration|1': options,
      'impact|1': options,
    },
    scenario_id: '@integer(1, 3)',
    startNode_id: '@integer(1, 3)',
    algorithm_id: '@integer(1, 3)',
    seed: '@integer(1, 10)',
    learningRate: '@integer(1, 10)',
    batchSize: '@integer(1, 10)',
    trainingSteps: '@integer(1, 10)',
    'trainingNodeConfigType|1': [0, 1],
    'visualizationType|1': [0, 1],
  }]
})

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
    url: '/api/training',
    type: 'get',
    response: config => {
      const { id, fid, pageSize, page } = config.query;
      let res = data.items;
      let len;
      if(id) {
        res = res.filter(item => item.id == id);
        len = 1;
      } else {
        res = res.filter(item => item.directory_name == fid);
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
    url: '/api/training',
    type: 'post',
    response: config => {
      let newItem = config.body;
      newItem.id = data.items.length + 1;
      newItem.training_state = '训练中';
      newItem.training_duration = '00:01:13';
      newItem.training_position = '主机 aaa';
      data.items.push(newItem);
      return {
        code: 20000,
        data: { }
      }
    }
  },
  {
    url: '/api/training',
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